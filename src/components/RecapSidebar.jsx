import { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardList, X, ChevronUp } from 'lucide-react';
import { fmt1, ACTIVITY_LEVELS } from '../hooks/useNutriCal';

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs text-right ${strong ? 'font-bold text-text' : 'font-medium text-text'}`}>
        {value}
      </span>
    </div>
  );
}

function BlockTitle({ children }) {
  return (
    <h3 className="text-[11px] font-bold text-muted uppercase tracking-wide m-0">
      {children}
    </h3>
  );
}

export default function RecapSidebar({ patient, assessment, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [y, setY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const headerBtnRef = useRef(null);
  const sheetEl = useRef(null);
  const headerEl = useRef(null);
  const measuredRef = useRef(false);
  const closedOffsetRef = useRef(0);
  const yRef = useRef(0);
  const isOpenRef = useRef(false);
  const dragStartRef = useRef(null);
  const justDraggedRef = useRef(false);

  const setClosedOffset = useCallback(() => {
    if (!sheetEl.current || !headerEl.current) return;
    closedOffsetRef.current = Math.max(0, sheetEl.current.offsetHeight - headerEl.current.offsetHeight);
    if (!isOpenRef.current) setY(closedOffsetRef.current);
  }, []);

  const sheetRef = useCallback((el) => {
    sheetEl.current = el;
    if (el && !measuredRef.current) {
      measuredRef.current = true;
      setClosedOffset();
    }
  }, [setClosedOffset]);

  const headerRef = useCallback((el) => {
    headerEl.current = el;
    if (el && !measuredRef.current) {
      measuredRef.current = true;
      setClosedOffset();
    }
  }, [setClosedOffset]);

  const openSheet = useCallback(() => {
    setIsOpen(true);
    setY(0);
    headerBtnRef.current?.focus({ preventScroll: true });
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setY(closedOffsetRef.current);
    headerBtnRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    yRef.current = y;
  }, [y]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeSheet();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeSheet]);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevRoot = root.style.overflow;
    const prevScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    window.scrollTo({ top: prevScroll, behavior: 'instant' });
    return () => {
      document.body.style.overflow = prevBody;
      root.style.overflow = prevRoot;
      window.scrollTo({ top: prevScroll, behavior: 'instant' });
    };
  }, [isOpen]);

  useEffect(() => {
    const s = sheetEl.current;
    const h = headerEl.current;
    if (!s || !h) return;
    const ro = new ResizeObserver(() => setClosedOffset());
    ro.observe(s);
    ro.observe(h);
    return () => ro.disconnect();
  }, [setClosedOffset]);

  const startDrag = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragStartRef.current = {
      startY: e.clientY,
      baseY: yRef.current,
      isOpenAtStart: isOpenRef.current,
    };
    setDragging(true);
  };

  const onDragMove = (e) => {
    const s = dragStartRef.current;
    if (!s) return;
    const dy = e.clientY - s.startY;
    let next;
    if (s.isOpenAtStart) {
      next = dy;
    } else {
      next = closedOffsetRef.current + dy;
    }
    const maxY = closedOffsetRef.current + (s.isOpenAtStart ? closedOffsetRef.current * 0.2 : 24);
    next = Math.max(0, Math.min(maxY, next));
    yRef.current = next;
    setY(next);
  };

  const endDrag = () => {
    const s = dragStartRef.current;
    dragStartRef.current = null;
    if (!s) return;
    setDragging(false);
    justDraggedRef.current = Math.abs(yRef.current - s.baseY) > 8;
    if (yRef.current <= closedOffsetRef.current / 2) {
      openSheet();
    } else {
      closeSheet();
    }
  };

  const handleToggle = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    justDraggedRef.current = false;
    if (isOpen) closeSheet();
    else openSheet();
  };

  const frame =
    patient.frame === '0.9' ? 'Small' :
    patient.frame === '1.1' ? 'Large' : 'Medium';
  const height = `${parseInt(patient.heightFt, 10) || 0}′${parseInt(patient.heightIn, 10) || 0}″`;
  const activityLabel = ACTIVITY_LEVELS[patient.activity];

  const rows = [
    { label: 'Name', value: patient.name || '—' },
    { label: 'Age', value: patient.age || '—' },
    { label: 'Sex', value: patient.sex === 'male' ? 'Male' : 'Female' },
    { label: 'Body frame', value: frame },
    { label: 'Height', value: height },
    { label: 'Weight', value: patient.weight ? `${patient.weight} lb` : '—' },
    { label: 'Activity', value: `${patient.activity} · ${activityLabel}` },
  ];

  if (assessment) {
    rows.push(
      { label: 'BMI', value: `${assessment.bmi.toFixed(1)} · ${assessment.bmiInfo.label}` },
      { label: 'DBW', value: `${fmt1(assessment.dbw.kg)} kg` }
    );
  }

  const summary = (
    <>
      <div className="card p-4 space-y-3">
        <BlockTitle>Patient Assessment</BlockTitle>
        <div className="divide-y divide-border">
          {rows.map((r) => <Row key={r.label} {...r} />)}
        </div>
      </div>

      {children}
    </>
  );

  return (
    <>
      <aside className="hidden lg:block print:block space-y-4 lg:sticky lg:top-24 lg:self-start">
        {summary}
      </aside>

      <div className="lg:hidden no-print">
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
          onClick={closeSheet}
          aria-hidden="true"
        />

        <div
          ref={sheetRef}
          role={isOpen ? 'dialog' : undefined}
          aria-modal={isOpen || undefined}
          aria-label={isOpen ? 'Assessment summary' : undefined}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-border bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
          style={{
            transform: `translateY(${y}px)`,
            transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(0.32, 0.72, 0.25, 1)',
            willChange: dragging ? 'transform' : undefined,
          }}
        >
          <div
            ref={headerRef}
            className="shrink-0 select-none"
            style={{ touchAction: 'none' }}
            onPointerDown={startDrag}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="mx-auto my-2 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 px-4 pb-2.5">
              <button
                type="button"
                ref={headerBtnRef}
                onClick={handleToggle}
                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer bg-transparent border-0 p-0"
                aria-expanded={isOpen}
                aria-controls="recap-content"
              >
                <span className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList size={15} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-text leading-tight">
                  {isOpen ? 'Assessment Summary' : 'View Summary'}
                </span>
                <ChevronUp
                  size={16}
                  className={`shrink-0 text-muted transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                className={`icon-btn shrink-0 cursor-pointer transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Close summary"
                tabIndex={isOpen ? 0 : -1}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            id="recap-content"
            inert={!isOpen}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-1 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-4"
          >
            {summary}
          </div>
        </div>
      </div>
    </>
  );
}