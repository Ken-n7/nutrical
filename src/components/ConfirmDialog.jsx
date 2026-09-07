import { useEffect, useId, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  icon,
}) {
  const titleId = useId();
  const confirmRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    confirmRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <motion.div
        className="card w-full max-w-sm p-6 shadow-xl bg-surface"
        initial={reduce ? false : { opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
        transition={{ duration: reduce ? 0 : 0.16, ease: 'easeOut' }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-500">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 id={titleId} className="text-base font-bold m-0 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted m-0 mt-1">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button type="button" className="btn btn-ghost text-sm" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
            className="btn text-sm bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}