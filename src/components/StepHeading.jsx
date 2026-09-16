export default function StepHeading({ idx, num, title, hint, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="stepper-dot stepper-dot--done">{num}</span>
        <div>
          <h2
            id={`step-heading-${idx}`}
            tabIndex={-1}
            className="text-lg font-bold text-gray-900 dark:text-white m-0 leading-tight outline-none"
          >
            {title}
          </h2>
          {hint && <p className="text-sm text-muted m-0">{hint}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}