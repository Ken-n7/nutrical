import { GROUP_KEYS, GROUP_LABELS } from '../data/mealPlanData';

export default function PlanCompare({ validation, exchanges }) {
  if (!validation?.groups) return null;
  const { groups } = validation;
  const entries = GROUP_KEYS.filter(
    (g) => (exchanges[g] || 0) > 0 || (groups[g]?.mealTotal || 0) > 0
  );

  if (entries.length === 0) return null;

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-[11px] font-bold text-muted uppercase tracking-wide m-0">
        Distribution vs Meal Plan
      </h3>
      <div className="divide-y divide-border">
        {entries.map((g) => {
          const { exchangeTotal, mealTotal, over } = groups[g];
          const diff = mealTotal - exchangeTotal;
          const chipClass =
            diff === 0 ? 'chip-good' : diff > 0 ? 'chip-bad' : 'chip-warn';
          const chipText =
            diff === 0
              ? 'Match'
              : `${diff > 0 ? '+' : ''}${diff}${diff > 0 ? ' over' : ' under'}`;
          return (
            <div
              key={g}
              className={`fel-cmp-row ${over ? 'rounded-md bg-red-50 dark:bg-red-950/40 px-2 -mx-2' : ''}`}
            >
              <span className="fel-cmp-left">
                <span className="fel-cmp-label">{GROUP_LABELS[g]}</span>
                <span className="fel-cmp-value">
                  Plan {mealTotal} / Dist {exchangeTotal}
                </span>
              </span>
              <span className={`chip ${chipClass} fel-cmp-diff`}>{chipText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}