import { useCallback } from 'react';
import { fmt1, fmtInt, fmtValue } from '../hooks/useNutriCal';

function ExchangeInput({ value, onChange, label }) {
  const handleBlur = useCallback((e) => {
    const val = e.target.value;
    if (val === '' || Number(val) < 0 || !Number.isFinite(Number(val))) {
      onChange({ target: { value: '0' } });
    }
  }, [onChange]);

  return (
    <input
      type="number"
      min="0"
      step="any"
      inputMode="decimal"
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      className="input-traditional w-20 text-center"
      aria-label={label}
    />
  );
}

function PrescriptionBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-gray-200 rounded text-sm font-semibold text-gray-600">
      {label} <strong className="text-gray-900">{value}</strong>
    </span>
  );
}

function CompareItem({ label, value, diff }) {
  return (
    <div className="border-2 border-gray-200 bg-gray-50 rounded p-3">
      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
      <strong className="block text-sm font-bold mt-1 text-gray-900">{value}</strong>
      <small className="block text-xs text-gray-500 mt-1">{diff}</small>
    </div>
  );
}

export default function ExchangeTable({ exchanges, updateExchange, exchangeData, assessment }) {
  if (!exchangeData || !assessment) return null;

  const { targetCho, targetChon, targetFat, ter } = assessment;
  const {
    rows, riceN, riceCho, riceChon, riceFat, riceKcal,
    meatN, meatChon, meatFat, meatKcal,
    totalCho, totalChon, totalFat, totalKcal, totalN,
    choDiff, chonDiff, fatDiff, kcalDiff, within,
  } = exchangeData;

  const getRow = (key) => rows.find((r) => r.key === key);

  return (
    <section id="prescription" className="scroll-mt-20 mb-8">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">FEL Exchange Distribution</h2>
          <p className="text-sm text-gray-500 m-0">
            Enter the number of exchanges for each food group
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Nutritionist Input
        </div>
      </div>

      {/* Current prescription summary */}
      <div className="flex flex-wrap items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded px-4 py-3 mb-4">
        <span className="text-xs font-bold text-gray-500 mr-auto uppercase tracking-wide">Current Prescription</span>
        <PrescriptionBadge label="CHO" value={`${fmt1(targetCho)} g`} />
        <PrescriptionBadge label="CHON" value={`${fmt1(targetChon)} g`} />
        <PrescriptionBadge label="Fat" value={`${fmt1(targetFat)} g`} />
        <PrescriptionBadge label="TER" value={`${fmtInt(ter)} kcal`} />
      </div>

      {/* Exchange table */}
      <div className="card-traditional overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-traditional min-w-[660px]">
            <thead>
              <tr>
                <th className="w-[180px]">Food Group</th>
                <th className="w-[100px]">Exchanges</th>
                <th className="text-right">CHO (g)</th>
                <th className="text-right">CHON (g)</th>
                <th className="text-right">Fat (g)</th>
                <th className="text-right">Energy (kcal)</th>
              </tr>
            </thead>
            <tbody>
              {/* Basic groups */}
              <TableRow index="I" name="Vegetable" count={exchanges.veg} data={getRow('veg')} onChange={(e) => updateExchange('veg', e.target.value)} />
              <TableRow index="II" name="Fruit" count={exchanges.fruit} data={getRow('fruit')} onChange={(e) => updateExchange('fruit', e.target.value)} />
              <TableRow index="III" name="Milk" count={exchanges.milk} data={getRow('milk')} onChange={(e) => updateExchange('milk', e.target.value)} />
              <TableRow index="VII" name="Sugar" count={exchanges.sugar} data={getRow('sugar')} onChange={(e) => updateExchange('sugar', e.target.value)} />

              {/* CHO partial sum */}
              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">CHO Partial Sum</td>
                <td className="text-right font-bold">{fmtValue(exchangeData.basicCho)}</td>
                <td colSpan={3} />
              </tr>
              <tr>
                <td colSpan={2} className="text-xs text-gray-500">Target difference</td>
                <td colSpan={3} className="text-right text-xs text-gray-500">
                  Entered {fmt1(totalCho)} g · target {fmt1(targetCho)} g · difference {choDiff >= 0 ? '+' : ''}{fmt1(choDiff)} g
                </td>
              </tr>

              {/* Rice group */}
              <TableRow index="IV" name="Rice A" count={exchanges.riceA} data={getRow('riceA')} onChange={(e) => updateExchange('riceA', e.target.value)} />
              <TableRow index="" name="Rice B" count={exchanges.riceB} data={getRow('riceB')} onChange={(e) => updateExchange('riceB', e.target.value)} indent />
              <TableRow index="" name="Rice C" count={exchanges.riceC} data={getRow('riceC')} onChange={(e) => updateExchange('riceC', e.target.value)} indent />

              {/* Rice subtotal */}
              <tr className="subtotal-row">
                <td className="font-bold text-gray-700">Rice Subtotal</td>
                <td className="text-right font-bold">{fmtValue(riceN)}</td>
                <td className="text-right font-bold">{fmtValue(riceCho)}</td>
                <td className="text-right font-bold">{fmtValue(riceChon)}</td>
                <td className="text-right font-bold">{fmtValue(riceFat)}</td>
                <td className="text-right font-bold">{fmtValue(riceKcal)}</td>
              </tr>

              {/* CHON partial sum */}
              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">CHON Partial Sum</td>
                <td className="text-right" />
                <td className="text-right font-bold">{fmtValue(exchangeData.basicChon + riceChon)}</td>
                <td colSpan={2} />
              </tr>
              <tr>
                <td colSpan={2} className="text-xs text-gray-500">Target difference</td>
                <td colSpan={4} className="text-right text-xs text-gray-500">
                  Entered {fmt1(totalChon)} g · target {fmt1(targetChon)} g · difference {chonDiff >= 0 ? '+' : ''}{fmt1(chonDiff)} g
                </td>
              </tr>

              {/* Meat group */}
              <TableRow index="V" name="LF Meat" count={exchanges.meatLow} data={getRow('meatLow')} onChange={(e) => updateExchange('meatLow', e.target.value)} />
              <TableRow index="" name="MF Meat" count={exchanges.meatMed} data={getRow('meatMed')} onChange={(e) => updateExchange('meatMed', e.target.value)} indent />
              <TableRow index="" name="HF Meat" count={exchanges.meatHigh} data={getRow('meatHigh')} onChange={(e) => updateExchange('meatHigh', e.target.value)} indent />

              {/* Meat subtotal */}
              <tr className="subtotal-row">
                <td className="font-bold text-gray-700">Meat Subtotal</td>
                <td className="text-right font-bold">{fmtValue(meatN)}</td>
                <td className="text-right">0</td>
                <td className="text-right font-bold">{fmtValue(meatChon)}</td>
                <td className="text-right font-bold">{fmtValue(meatFat)}</td>
                <td className="text-right font-bold">{fmtValue(meatKcal)}</td>
              </tr>

              {/* Fat partial sum */}
              <tr className="subtotal-row">
                <td colSpan={2} className="font-bold text-gray-700">Fat Partial Sum</td>
                <td colSpan={2} />
                <td className="text-right font-bold">{fmtValue(exchangeData.basicFat + riceFat + meatFat)}</td>
                <td />
              </tr>
              <tr>
                <td colSpan={2} className="text-xs text-gray-500">Target difference</td>
                <td colSpan={4} className="text-right text-xs text-gray-500">
                  Entered {fmt1(totalFat)} g · target {fmt1(targetFat)} g · difference {fatDiff >= 0 ? '+' : ''}{fmt1(fatDiff)} g
                </td>
              </tr>

              {/* Fat exchange */}
              <TableRow index="VI" name="Fat" count={exchanges.fat} data={getRow('fat')} onChange={(e) => updateExchange('fat', e.target.value)} />

              {/* Grand total */}
              <tr className="total-row">
                <td className="font-bold">Total Entered</td>
                <td className="text-right font-bold">{fmtValue(totalN)}</td>
                <td className="text-right font-bold">{fmtValue(totalCho)}</td>
                <td className="text-right font-bold">{fmtValue(totalChon)}</td>
                <td className="text-right font-bold">{fmtValue(totalFat)}</td>
                <td className="text-right font-bold">{fmtInt(totalKcal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 px-4 py-2 border-t-2 border-gray-100 m-0">
          Tip: Click an exchange value to edit. Fractional exchanges are accepted (e.g., 2.5).
        </p>
      </div>

      {/* Comparison review */}
      <div className="card-traditional p-5 mt-4" aria-live="polite">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 m-0">Prescription vs. Entered Exchanges</h3>
            <p className="text-sm text-gray-500 m-0 mt-1">Compare your distribution against targets</p>
          </div>
          <span className={`status-badge ${within ? 'status-normal' : 'status-warning'}`}>
            {within ? 'Within tolerance' : 'Review needed'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CompareItem label="CHO" value={`${fmt1(totalCho)} / ${fmt1(targetCho)} g`} diff={`${choDiff >= 0 ? '+' : ''}${fmt1(choDiff)} g`} />
          <CompareItem label="CHON" value={`${fmt1(totalChon)} / ${fmt1(targetChon)} g`} diff={`${chonDiff >= 0 ? '+' : ''}${fmt1(chonDiff)} g`} />
          <CompareItem label="Fat" value={`${fmt1(totalFat)} / ${fmt1(targetFat)} g`} diff={`${fatDiff >= 0 ? '+' : ''}${fmt1(fatDiff)} g`} />
          <CompareItem label="Energy" value={`${fmtInt(totalKcal)} / ${fmtInt(ter)} kcal`} diff={`${kcalDiff >= 0 ? '+' : ''}${fmtInt(kcalDiff)}`} />
        </div>

        <p className="text-xs text-gray-500 mt-4 mb-0">
          Exchange quantities are nutritionist-entered values. NutriCal reports the difference but does not automatically adjust the distribution. Adjust exchanges manually to meet targets.
        </p>
      </div>
    </section>
  );
}

function TableRow({ index, name, count, data, onChange, indent }) {
  return (
    <tr>
      <td className={indent ? 'pl-8' : ''}>
        {index && <span className="inline-block w-8 text-xs font-bold text-gray-400">{index}</span>}
        <span className="font-medium text-gray-700">{name}</span>
      </td>
      <td>
        <ExchangeInput value={count} onChange={onChange} label={`${name} exchanges`} />
      </td>
      <td className="text-right">{fmtValue(data.cho)}</td>
      <td className="text-right">{fmtValue(data.chon)}</td>
      <td className="text-right">{fmtValue(data.fat)}</td>
      <td className="text-right">{fmtValue(data.kcal)}</td>
    </tr>
  );
}
