const DOTS = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Stepper({ steps, current, unlocked, onSelect, ariaBusy }) {
  return (
    <nav aria-label="Progress" aria-busy={ariaBusy} className="no-print">
      <ol className="flex items-center gap-1 overflow-x-auto py-1">
        {steps.map((step, idx) => {
          const state =
            idx === current
              ? 'stepper-item--active'
              : idx < current
              ? 'stepper-item--done'
              : unlocked[idx]
              ? 'stepper-item--done'
              : '';
          const dot = idx < current ? 'stepper-dot--done' : '';
          const active = idx === current;
          const accessible = idx === 0 || unlocked[idx];
          return (
            <li key={step.id} className="flex items-center shrink-0">
              <button
                type="button"
                className={`stepper-item ${state}`}
                disabled={!accessible}
                onClick={() => onSelect(idx)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Step ${step.num}: ${step.name}${!accessible ? ' (locked)' : ''}`}
              >
                <span className={`stepper-dot ${dot}`}>
                  {idx < current ? <DOTS /> : step.num}
                </span>
                <span className="hidden sm:inline">{step.name}</span>
              </button>
              {idx < steps.length - 1 && (
                <span className="mx-1 h-px w-3 bg-border" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}