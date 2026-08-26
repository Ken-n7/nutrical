import { fmt1, fmtInt } from '../hooks/useNutriCal';

export default function AssessmentDisplay({ assessment }) {
  if (!assessment) return null;

  const { bmi, bmiInfo, dbw, dbwInfo, af, afLabel, ter, terRaw, dist, targetCho, targetChon, targetFat } = assessment;
  const [choPct, chonPct, fatPct] = dist;

  return (
    <section id="assessment" className="scroll-mt-20 mb-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Energy Assessment</h2>
          <p className="text-sm text-gray-500 m-0">Hamwi DBW &times; activity factor determines total energy requirement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="BMI" value={fmt1(bmi)} badge={bmiInfo} />
        <MetricCard
          label="Desirable Body Weight"
          value={`${fmt1(dbw.kg)} kg`}
          formula={dbw.formula}
          badge={dbwInfo}
          highlighted
        />
        <MetricCard label="Activity Factor" value={`× ${af}`} note={`${afLabel} · kcal/kg DBW`} />
        <MetricCard
          label="Total Energy Requirement"
          value={`${fmtInt(ter)} kcal/day`}
          formula={`${fmt1(dbw.kg)} × ${af} ≈ ${fmt1(terRaw)} → rounded to ${fmtInt(ter)}`}
          highlight
        />
      </div>

      {/* Macronutrient targets */}
      <div className="card-traditional p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 m-0">Macronutrient Targets</h3>
            <p className="text-sm text-gray-500 m-0 mt-1">Based on {fmtInt(ter)} kcal total energy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MacroTarget
            label="Carbohydrates"
            grams={targetCho}
            pct={choPct}
            kcal={fmtInt(ter * choPct / 100)}
            color="bg-teal-600"
          />
          <MacroTarget
            label="Protein (CHON)"
            grams={targetChon}
            pct={chonPct}
            kcal={fmtInt(ter * chonPct / 100)}
            color="bg-gray-500"
          />
          <MacroTarget
            label="Fat"
            grams={targetFat}
            pct={fatPct}
            kcal={fmtInt(ter * fatPct / 100)}
            color="bg-amber-500"
          />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, formula, badge, note, highlighted, highlight }) {
  const borderColor = highlight ? 'border-emerald-300' : 'border-gray-200';
  const bgClass = highlighted ? 'bg-gradient-to-br from-gray-50 to-white' : 'bg-white';

  return (
    <article className={`metric-card ${bgClass} ${borderColor}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {formula && (
        <code className="text-xs text-gray-500 mt-1 block whitespace-normal">{formula}</code>
      )}
      {note && (
        <span className="text-xs text-gray-500 mt-auto">{note}</span>
      )}
      {badge && (
        <span className={`status-badge ${badge.color} mt-2 self-start`}>
          {badge.label}
        </span>
      )}
    </article>
  );
}

function MacroTarget({ label, grams, pct, kcal, color }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-gray-600">{label}</span>
        <strong className="text-sm">
          {fmt1(grams)} g
          <span className="text-gray-400 font-normal ml-1">· {pct}% · {kcal} kcal</span>
        </strong>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
