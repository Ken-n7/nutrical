import { useState, useRef, useCallback, useEffect } from 'react';
import PatientForm from './PatientForm';

export default function PatientPanel({ patient, updatePatient, error, onCompute }) {
  const [isOpen, setIsOpen] = useState(false);
  const touchStartY = useRef(0);
  const touchDelta = useRef(0);
  const sheetRef = useRef(null);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleCompute = useCallback(() => {
    onCompute();
    close();
  }, [onCompute, close]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Touch handlers for swipe
  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchDelta.current = 0;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchDelta.current = e.touches[0].clientY - touchStartY.current;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchDelta.current < -50) {
      setIsOpen(true);
    } else if (touchDelta.current > 50) {
      setIsOpen(false);
    }
    touchDelta.current = 0;
  }, []);

  const summaryParts = [];
  if (patient.name) summaryParts.push(patient.name);
  if (patient.age) summaryParts.push(`${patient.age}y`);
  if (patient.sex) summaryParts.push(patient.sex === 'female' ? 'F' : 'M');
  if (patient.weight) summaryParts.push(`${patient.weight}lb`);
  const summary = summaryParts.join(' · ') || 'Patient Info';

  return (
    <>
      {/* Collapsed trigger — fixed bottom bar */}
      <div
        className={`patient-panel-bar ${isOpen ? 'patient-panel-bar--hidden' : ''}`}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        aria-label="Open patient information"
      >
        <div className="patient-panel-handle" />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 bg-teal-700 text-white rounded flex items-center justify-center text-xs font-extrabold shrink-0">N</span>
            <span className="text-sm font-semibold text-gray-800 truncate">{summary}</span>
          </div>
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      {/* Desktop floating trigger — fixed top-right area */}
      <button
        type="button"
        className={`patient-panel-fab ${isOpen ? 'patient-panel-fab--hidden' : ''}`}
        onClick={toggle}
        aria-label="Open patient information"
      >
        <span className="w-8 h-8 bg-teal-700 text-white rounded flex items-center justify-center text-xs font-extrabold">N</span>
        <span className="text-xs font-semibold text-teal-700 hidden xl:inline">Patient</span>
      </button>

      {/* Backdrop */}
      <div
        className={`patient-panel-backdrop ${isOpen ? 'patient-panel-backdrop--visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Expanded panel */}
      <div
        ref={sheetRef}
        className={`patient-panel-sheet ${isOpen ? 'patient-panel-sheet--open' : ''}`}
        role="dialog"
        aria-label="Patient information"
        aria-modal="true"
      >
        {/* Drag handle (mobile) + close button */}
        <div
          className="patient-panel-drag-area lg:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={close}
        >
          <div className="patient-panel-drag-bar" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 m-0">Patient Information</h2>
          <button
            type="button"
            onClick={close}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close patient information"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="patient-panel-scroll">
          <PatientForm
            patient={patient}
            updatePatient={updatePatient}
            error={error}
            onCompute={handleCompute}
          />
        </div>
      </div>
    </>
  );
}
