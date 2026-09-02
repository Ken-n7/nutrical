import { fmt1, fmtInt } from '../hooks/useNutriCal';

function Icon({ d }) {
  return (
    <span className="w-6 h-6 rounded-md bg-primary-soft text-primary flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    </span>
  );
}

function MetricCard({ icon, label, value, formula, note, badge, highlight }) {
  const cls = highlight
    ? 'metric metric-highlight'
    : 'metric';

  return (
    <article className={cls}>
      <span className="metric-label">
        <Icon d={icon} />
        {label}
      </span>
      <strong className="metric-value">{value}</strong>
      {formula && (
        <code className="text-xs text-muted mt-1 block whitespace-normal">{formula}</code>
      )}
      {note && <span className="metric-note">{note}</span>}
      {badge && (
        <span className={`badge ${badge.color} mt-2 self-start`}>{badge.label}</span>
      )}
    </article>
  );
}

function MacroTarget({ label, grams, pct, kcal, barClass }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-text">{label}</span>
        <strong className="text-sm">
          {fmt1(grams)} g
          <span className="text-muted font-normal ml-1">· {pct}% · {kcal} kcal</span>
        </strong>
      </div>
      <div className="macro-bar">
        <div className={`macro-fill ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AssessmentDisplay({ assessment }) {
  if (!assessment) return null;

  const { bmi, bmiInfo, dbw, dbwInfo, af, afLabel, ter, terRaw, dist, targetCho, targetProtein, targetFat } = assessment;
  const [choPct, proteinPct, fatPct] = dist;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon="M4.5 12.75l6 6 9-13.5"
          label="BMI"
          value={fmt1(bmi)}
          badge={bmiInfo}
        />
        <MetricCard
          icon="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-12v4m0 4h.01"
          label="Desirable Body Weight"
          value={`${fmt1(dbw.kg)} kg`}
          formula={dbw.formula}
          badge={dbwInfo}
        />
        <MetricCard
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          label="Activity Factor"
          value={`× ${af}`}
          note={`${afLabel} · kcal/kg DBW`}
        />
        <MetricCard
          icon="M12 3v18m6-12l3 3-3 3M6 15l-3-3 3-3"
          label="Total Energy Requirement"
          value={`${fmtInt(ter)} kcal/day`}
          formula={`${fmt1(dbw.kg)} × ${af} ≈ ${fmt1(terRaw)} → rounded to ${fmtInt(ter)}`}
          highlight
        />
      </div>

      <div className="card p-5">
        <div className="mb-4">
          <h3 className="text-base font-bold m-0">Macronutrient Targets</h3>
          <p className="text-sm text-muted m-0 mt-1">Based on {fmtInt(ter)} kcal total energy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MacroTarget
            label="Carbohydrates"
            grams={targetCho}
            pct={choPct}
            kcal={fmtInt(ter * choPct / 100)}
            barClass="dots-fill"
          />
          <MacroTarget
            label="Protein"
            grams={targetProtein}
            pct={proteinPct}
            kcal={fmtInt(ter * proteinPct / 100)}
            barClass="bar-pro"
          />
          <MacroTarget
            label="Fat"
            grams={targetFat}
            pct={fatPct}
            kcal={fmtInt(ter * fatPct / 100)}
            barClass="bar-fat"
          />
        </div>
      </div>
    </div>
  );
}