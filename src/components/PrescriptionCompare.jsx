import { MovingBorderOutline } from './ui/moving-border';
import { fmt1, fmtInt } from '../hooks/useNutriCal';
import { OkBadge, WarnBadge } from './CompareBadges';

function CompareRow({ label, value, diff }) {
  return (
    <div className="fel-cmp-row">
      <span className="fel-cmp-left">
        <span className="fel-cmp-label">{label}</span>
        <span className="fel-cmp-value">{value}</span>
      </span>
      <span className="fel-cmp-diff">{diff}</span>
    </div>
  );
}

export default function PrescriptionCompare({ exchangeData, assessment }) {
  if (!exchangeData || !assessment) return null;

  const { ter, targetCho, targetProtein, targetFat } = assessment;
  const {
    totalCho,
    totalProtein,
    totalFat,
    totalKcal,
    choDiff,
    proteinDiff,
    fatDiff,
    kcalDiff,
    within,
  } = exchangeData;

  const rows = [
    {
      label: 'CHO',
      value: `${fmt1(totalCho)} / ${fmt1(targetCho)} g`,
      diff: `${choDiff >= 0 ? '+' : ''}${fmt1(choDiff)} g`,
    },
    {
      label: 'PRO',
      value: `${fmt1(totalProtein)} / ${fmt1(targetProtein)} g`,
      diff: `${proteinDiff >= 0 ? '+' : ''}${fmt1(proteinDiff)} g`,
    },
    {
      label: 'Fat',
      value: `${fmt1(totalFat)} / ${fmt1(targetFat)} g`,
      diff: `${fatDiff >= 0 ? '+' : ''}${fmt1(fatDiff)} g`,
    },
    {
      label: 'Energy',
      value: `${fmtInt(totalKcal)} / ${fmtInt(ter)} kcal`,
      diff: `${kcalDiff >= 0 ? '+' : ''}${fmtInt(kcalDiff)} kcal`,
    },
  ];

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-bold text-muted uppercase tracking-wide m-0">
          Prescription vs Entered
        </h3>
        {within ? <OkBadge /> : <WarnBadge />}
      </div>

      <div className="divide-y divide-border">
        {rows.map((r) => <CompareRow key={r.label} {...r} />)}
      </div>
    </>
  );

  if (within) {
    return (
      <div className="card p-4 space-y-3" aria-live="polite">
        {content}
      </div>
    );
  }

  return (
    <div
      className="card p-4 space-y-3 fel-cmp-warn relative"
      aria-live="polite"
    >
      <MovingBorderOutline duration={4500} />
      <div className="relative">{content}</div>
    </div>
  );
}