import { useCallback } from 'react';
import { fmt1, fmtInt, fmtValue } from '../hooks/useNutriCal';

const EXCHANGE_MAX = 20;

function ExchangeInput({ value, onChange, label }) {
  const handleBlur = useCallback(
    (e) => {
      const val = e.target.value;
      const num = Number(val);
      if (val === '' || num < 0 || !Number.isFinite(num)) {
        onChange({ target: { value: '0' } });
      } else if (num > EXCHANGE_MAX) {
        onChange({ target: { value: String(EXCHANGE_MAX) } });
      }
    },
    [onChange]
  );

  const isHigh = Number(value) > EXCHANGE_MAX;

  return (
    <input
      type="number"
      min="0"
      max={EXCHANGE_MAX}
      step="any"
      inputMode="decimal"
      value={value === 0 ? '' : value}
      onChange={onChange}
      onBlur={handleBlur}
      className={`input-exchange ${
        isHigh
          ? 'border-amber-500 focus:border-amber-600 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]'
          : ''
      }`}
      aria-label={label}
      aria-invalid={isHigh}
      placeholder="0"
    />
  );
}

function PrescriptionBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-teal-200 rounded text-sm font-semibold text-teal-700">
      {label} <strong className="text-gray-900">{value}</strong>
    </span>
  );
}

function DiffTag({ diff, unit = 'g' }) {
  const abs = Math.abs(diff);
  const sign = diff > 0 ? '+' : '';
  const color =
    abs <= 5 ? 'text-emerald-600' : abs <= 15 ? 'text-amber-600' : 'text-red-600';

  return (
    <span className={`text-xs font-semibold ${color}`}>
      {sign}
      {fmt1(diff)} {unit}
    </span>
  );
}

function RemainingHint({ remaining, perExchange, label }) {
  if (remaining <= 0) return null;
  const needed = remaining / perExchange;
  return (
    <span className="text-xs text-teal-600 font-medium">
      Remaining {fmt1(remaining)} g → ≈ {fmt1(needed)} {label}
    </span>
  );
}

function CompareItem({ label, value, diff }) {
  return (
    <div className="border-2 border-gray-200 bg-gray-50 rounded p-3">
      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <strong className="block text-sm font-bold mt-1 text-gray-900">{value}</strong>
      <small className="block text-xs text-gray-500 mt-1">{diff}</small>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <tr className="section-header">
      <td
        colSpan={6}
        className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50/80 border-b border-teal-200"
      >
        {label}
      </td>
    </tr>
  );
}

function TableRow({ index, name, count, data, onChange, sub }) {
  return (
    <tr className={sub ? 'subgroup-row' : ''}>
      <td className={sub ? 'pl-8' : ''}>
        {index && (
          <span className="inline-block w-8 text-xs font-bold text-gray-400">
            {index}
          </span>
        )}
        <span className="font-medium text-gray-700">{name}</span>
      </td>
      <td className="text-center">
        <ExchangeInput
          value={count}
          onChange={onChange}
          label={`${name} exchanges`}
        />
      </td>
      <td className="text-right">{fmtValue(data?.cho ?? 0)}</td>
      <td className="text-right">{fmtValue(data?.protein ?? 0)}</td>
      <td className="text-right">{fmtValue(data?.fat ?? 0)}</td>
      <td className="text-right">{fmtValue(data?.kcal ?? 0)}</td>
    </tr>
  );
}

export default function ExchangeTable({
  exchanges,
  updateExchange,
  exchangeData,
  assessment,
}) {
  if (!exchangeData || !assessment) return null;

  const { targetCho, targetProtein, targetFat, ter } = assessment;
  const {
    rows,
    riceN,
    riceCho,
    riceProtein,
    riceFat,
    riceKcal,
    meatN,
    meatProtein,
    meatFat,
    meatKcal,
    basicCho,
    basicProtein,
    basicFat,
    totalCho,
    totalProtein,
    totalFat,
    totalKcal,
    totalN,
    choDiff,
    proteinDiff,
    fatDiff,
    kcalDiff,
    within,
  } = exchangeData;

  const getRow = (key) => rows.find((r) => r.key === key) || {};

  // Running values for better guidance
  const remainingChoAfterBasic = targetCho - basicCho;
  const proteinSoFarAfterRice = basicProtein + riceProtein;
  const remainingProteinAfterRice = targetProtein - proteinSoFarAfterRice;
  const fatSoFarBeforeFatExchange = basicFat + riceFat + meatFat;
  const remainingFat = targetFat - fatSoFarBeforeFatExchange;

  return (
    <section id="prescription" className="scroll-mt-20 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            FEL Exchange Distribution
          </h2>
          <p className="text-sm text-gray-500 m-0">
            Enter the number of exchanges for each food group
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Nutritionist Input
        </div>
      </div>

      {/* Current Prescription */}
      <div className="flex flex-wrap items-center gap-2 bg-teal-50 border-2 border-teal-200 rounded px-4 py-3 mb-4">
        <span className="text-xs font-bold text-teal-700 mr-auto uppercase tracking-wide">
          Current Prescription
        </span>
        <PrescriptionBadge label="CHO" value={`${fmt1(targetCho)} g`} />
        <PrescriptionBadge label="PRO" value={`${fmt1(targetProtein)} g`} />
        <PrescriptionBadge label="Fat" value={`${fmt1(targetFat)} g`} />
        <PrescriptionBadge label="TER" value={`${fmtInt(ter)} kcal`} />
      </div>

      {/* Main Table */}
      <div className="card-traditional overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-traditional fel-table min-w-[560px]">
            <thead>
              <tr>
                <th scope="col" className="w-[160px]">
                  Food Group
                </th>
                <th scope="col" className="w-[90px] text-center">
                  Exchange
                </th>
                <th scope="col" className="text-right">
                  CHO (g)
                </th>
                <th scope="col" className="text-right">
                  PRO (g)
                </th>
                <th scope="col" className="text-right">
                  Fat (g)
                </th>
                <th scope="col" className="text-right">
                  kcal
                </th>
              </tr>
            </thead>

            <tbody>
              {/* ── Basic Foods ── */}
              <SectionHeader label="Basic Foods" />
              <TableRow
                index="I"
                name="Vegetable"
                count={exchanges.veg}
                data={getRow('veg')}
                onChange={(e) => updateExchange('veg', e.target.value)}
              />
              <TableRow
                index="II"
                name="Fruit"
                count={exchanges.fruit}
                data={getRow('fruit')}
                onChange={(e) => updateExchange('fruit', e.target.value)}
              />
              <TableRow
                index="III"
                name="Whole Milk"
                count={exchanges.milkWhole}
                data={getRow('milkWhole')}
                onChange={(e) => updateExchange('milkWhole', e.target.value)}
                sub
              />
              <TableRow
                name="Low-Fat Milk"
                count={exchanges.milk}
                data={getRow('milk')}
                onChange={(e) => updateExchange('milk', e.target.value)}
                sub
              />
              <TableRow
                name="Skim Milk"
                count={exchanges.milkSkim}
                data={getRow('milkSkim')}
                onChange={(e) => updateExchange('milkSkim', e.target.value)}
                sub
              />
              <TableRow
                index="VII"
                name="Sugar"
                count={exchanges.sugar}
                data={getRow('sugar')}
                onChange={(e) => updateExchange('sugar', e.target.value)}
              />

              {/* CHO Subtotal + Remaining */}
              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">
                  CHO Subtotal
                </td>
                <td className="text-right font-bold">{fmtValue(basicCho)}</td>
                <td colSpan={3} />
              </tr>
              <tr className="diff-row">
                <td colSpan={6} className="text-right py-1.5">
                  <div className="flex items-center justify-end gap-3">
                    <RemainingHint
                      remaining={remainingChoAfterBasic}
                      perExchange={23}
                      label="Rice"
                    />
                    <span className="text-xs text-gray-500">
                      Target {fmt1(targetCho)} g ·{' '}
                    </span>
                    <DiffTag diff={choDiff} />
                  </div>
                </td>
              </tr>

              {/* ── Rice ── */}
              <SectionHeader label="Rice / Starchy" />
              <TableRow
                index="IV"
                name="Rice A (Low-Protein)"
                count={exchanges.riceA}
                data={getRow('riceA')}
                onChange={(e) => updateExchange('riceA', e.target.value)}
              />
              <TableRow
                name="Rice B (Med-Protein)"
                count={exchanges.riceB}
                data={getRow('riceB')}
                onChange={(e) => updateExchange('riceB', e.target.value)}
                sub
              />
              <TableRow
                name="Rice C (High-Protein)"
                count={exchanges.riceC}
                data={getRow('riceC')}
                onChange={(e) => updateExchange('riceC', e.target.value)}
                sub
              />

              <tr className="subtotal-row">
                <td className="font-bold text-gray-700">Rice Subtotal</td>
                <td className="text-right font-bold">{fmtValue(riceN)}</td>
                <td className="text-right font-bold">{fmtValue(riceCho)}</td>
                <td className="text-right font-bold">{fmtValue(riceProtein)}</td>
                <td className="text-right font-bold">{fmtValue(riceFat)}</td>
                <td className="text-right font-bold">{fmtValue(riceKcal)}</td>
              </tr>

              {/* Protein so far */}
              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">
                  Protein so far
                </td>
                <td />
                <td className="text-right font-bold">
                  {fmtValue(proteinSoFarAfterRice)}
                </td>
                <td colSpan={2} />
              </tr>
              <tr className="diff-row">
                <td colSpan={6} className="text-right py-1.5">
                  <div className="flex items-center justify-end gap-3">
                    <RemainingHint
                      remaining={remainingProteinAfterRice}
                      perExchange={8}
                      label="Meat"
                    />
                    <span className="text-xs text-gray-500">
                      Target {fmt1(targetProtein)} g
                    </span>
                  </div>
                </td>
              </tr>

              {/* ── Meat ── */}
              <SectionHeader label="Meat / Fish" />
              <TableRow
                index="V"
                name="Low-Fat Meat"
                count={exchanges.meatLow}
                data={getRow('meatLow')}
                onChange={(e) => updateExchange('meatLow', e.target.value)}
              />
              <TableRow
                name="Med-Fat Meat"
                count={exchanges.meatMed}
                data={getRow('meatMed')}
                onChange={(e) => updateExchange('meatMed', e.target.value)}
                sub
              />
              <TableRow
                name="High-Fat Meat"
                count={exchanges.meatHigh}
                data={getRow('meatHigh')}
                onChange={(e) => updateExchange('meatHigh', e.target.value)}
                sub
              />

              <tr className="subtotal-row">
                <td className="font-bold text-gray-700">Meat Subtotal</td>
                <td className="text-right font-bold">{fmtValue(meatN)}</td>
                <td className="text-right">0</td>
                <td className="text-right font-bold">{fmtValue(meatProtein)}</td>
                <td className="text-right font-bold">{fmtValue(meatFat)}</td>
                <td className="text-right font-bold">{fmtValue(meatKcal)}</td>
              </tr>

              {/* ── Fat ── */}
              <SectionHeader label="Fat" />
              <TableRow
                index="VI"
                name="Fat"
                count={exchanges.fat}
                data={getRow('fat')}
                onChange={(e) => updateExchange('fat', e.target.value)}
              />

              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">
                  Fat so far (before Fat exchanges)
                </td>
                <td colSpan={2} />
                <td className="text-right font-bold">
                  {fmtValue(fatSoFarBeforeFatExchange)}
                </td>
                <td />
              </tr>
              <tr className="diff-row">
                <td colSpan={6} className="text-right py-1.5">
                  <div className="flex items-center justify-end gap-3">
                    <RemainingHint
                      remaining={remainingFat}
                      perExchange={5}
                      label="Fat"
                    />
                    <span className="text-xs text-gray-500">
                      Target {fmt1(targetFat)} g ·{' '}
                    </span>
                    <DiffTag diff={fatDiff} />
                  </div>
                </td>
              </tr>

              {/* ── Grand Total ── */}
              <tr className="total-row">
                <td className="font-bold">TOTAL</td>
                <td className="text-right font-bold">{fmtValue(totalN)}</td>
                <td className="text-right font-bold">{fmtValue(totalCho)}</td>
                <td className="text-right font-bold">{fmtValue(totalProtein)}</td>
                <td className="text-right font-bold">{fmtValue(totalFat)}</td>
                <td className="text-right font-bold">{fmtInt(totalKcal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 px-4 py-2 border-t-2 border-gray-100 m-0">
          Fractional exchanges accepted (e.g. 2.5). Maximum {EXCHANGE_MAX} per
          group.
        </p>
      </div>

      {/* Final Comparison */}
      <div className="card-traditional p-5 mt-4" aria-live="polite">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 m-0">
              Prescription vs Entered Exchanges
            </h3>
            <p className="text-sm text-gray-500 m-0 mt-1">
              Final comparison against targets
            </p>
          </div>
          <span
            className={`status-badge ${
              within ? 'status-normal' : 'status-warning'
            }`}
          >
            {within ? 'Within tolerance' : 'Review needed'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <CompareItem
            label="CHO"
            value={`${fmt1(totalCho)} / ${fmt1(targetCho)} g`}
            diff={`${choDiff >= 0 ? '+' : ''}${fmt1(choDiff)} g`}
          />
          <CompareItem
            label="PRO"
            value={`${fmt1(totalProtein)} / ${fmt1(targetProtein)} g`}
            diff={`${proteinDiff >= 0 ? '+' : ''}${fmt1(proteinDiff)} g`}
          />
          <CompareItem
            label="Fat"
            value={`${fmt1(totalFat)} / ${fmt1(targetFat)} g`}
            diff={`${fatDiff >= 0 ? '+' : ''}${fmt1(fatDiff)} g`}
          />
          <CompareItem
            label="Energy"
            value={`${fmtInt(totalKcal)} / ${fmtInt(ter)} kcal`}
            diff={`${kcalDiff >= 0 ? '+' : ''}${fmtInt(kcalDiff)} kcal`}
          />
        </div>

        <p className="text-xs text-gray-500 mt-4 mb-0">
          NutriCal shows the difference but does not automatically adjust the
          distribution. The nutritionist remains in full control.
        </p>
      </div>
    </section>
  );
}