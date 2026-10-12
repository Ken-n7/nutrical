import { useCallback, useState } from 'react';
import { fmt1, fmtInt, fmtValue, EXCHANGE_MAX } from '../hooks/useNutriCal';

const DEFAULT_OPEN = { basic: true, rice: true, meat: true, fat: true };

function ExchangeInput({ value, onChange, label }) {
  const handleBlur = useCallback(
    (e) => {
      const val = e.target.value;
      const num = Number(val);
      if (val === '' || num < 0 || !Number.isFinite(num)) {
        onChange({ target: { value: '0' } });
      } else {
        const snapped = Math.min(EXCHANGE_MAX, Math.round(num) || 0);
        if (snapped !== num) onChange({ target: { value: String(snapped) } });
      }
    },
    [onChange]
  );

  return (
    <input
      type="number"
      min="0"
      max={EXCHANGE_MAX}
      step="1"
      inputMode="numeric"
      value={value === 0 ? '' : value}
      onChange={onChange}
      onBlur={handleBlur}
      className="exchange-input"
      aria-label={label}
      placeholder="0"
    />
  );
}

function DiffTag({ diff, unit = 'g' }) {
  const abs = Math.abs(diff);
  const sign = diff > 0 ? '+' : '';
  const cls =
    abs <= 5 ? 'chip chip-good' : abs <= 15 ? 'chip chip-warn' : 'chip chip-bad';

  return (
    <span className={`chip ${cls}`}>
      {sign}
      {fmt1(diff)} {unit}
    </span>
  );
}

function RemainingHint({ remaining, perExchange, label }) {
  if (remaining <= 0) return null;
  const needed = remaining / perExchange;
  return (
    <span className="text-xs text-primary font-medium">
      Remaining {fmt1(remaining)} g → ≈ {fmt1(needed)} {label}
    </span>
  );
}

function TableGroup({ title, open, onToggle, children }) {
  return (
    <div className="fel-group">
      <div className="fel-section">
        <button
          type="button"
          className="fel-section-toggle"
          aria-expanded={open}
          onClick={onToggle}
        >
          {title}
          <svg
            className="caret w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div
        className="fel-collapse"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="fel-collapse-inner">{children}</div>
      </div>
    </div>
  );
}

function TableRow({ index, name, count, data, onChange, sub }) {
  return (
    <div className={`fel-row fel-data-row ${sub ? 'subgroup-row' : ''}`}>
      <div className={`fel-td ${sub ? 'pl-2 md:pl-8' : ''}`}>
        {index && (
          <span className="inline-block w-8 max-md:w-5 text-xs font-bold text-faint">{index}</span>
        )}
        <span className="font-medium">{name}</span>
      </div>
      <div className="fel-td text-center">
        <ExchangeInput value={count} onChange={onChange} label={`${name} exchanges`} />
      </div>
      <div className="fel-td text-right">{fmtValue(data?.cho ?? 0)}</div>
      <div className="fel-td text-right">{fmtValue(data?.protein ?? 0)}</div>
      <div className="fel-td text-right">{fmtValue(data?.fat ?? 0)}</div>
      <div className="fel-td text-right">{fmtValue(data?.kcal ?? 0)}</div>
    </div>
  );
}

export default function ExchangeTable({
  exchanges,
  updateExchange,
  exchangeData,
  assessment,
}) {
  const [open, setOpen] = useState({ ...DEFAULT_OPEN });
  const toggleSection = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  if (!exchangeData || !assessment) return null;

  const { targetCho, targetProtein, targetFat } = assessment;
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
    fatDiff,
  } = exchangeData;

  const getRow = (key) => rows.find((r) => r.key === key) || {};

  // Running values for better guidance
  const remainingChoAfterBasic = targetCho - basicCho;
  const proteinSoFarAfterRice = basicProtein + riceProtein;
  const remainingProteinAfterRice = targetProtein - proteinSoFarAfterRice;
  const fatSoFarBeforeFatExchange = basicFat + riceFat + meatFat;
  const remainingFat = targetFat - fatSoFarBeforeFatExchange;

  return (
    <div className="space-y-4">
      {/* Main Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="fel-table min-w-0">
            <div className="fel-row fel-head-row">
              <div className="fel-th">Food Group</div>
              <div className="fel-th text-center">Exchange</div>
              <div className="fel-th text-right">CHO (g)</div>
              <div className="fel-th text-right">PRO (g)</div>
              <div className="fel-th text-right">Fat (g)</div>
              <div className="fel-th text-right">kcal</div>
            </div>

            <TableGroup title="Basic Foods" open={open.basic} onToggle={() => toggleSection('basic')}>
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

              <div className="fel-row subtotal-row">
                <div className="fel-td font-bold col-span-2">CHO Subtotal</div>
                <div className="fel-td text-right font-bold">{fmtValue(basicCho)}</div>
                <div className="fel-td col-span-3" />
              </div>
            </TableGroup>
            <div className="fel-row diff-row">
              <div className="fel-td col-span-6 text-right">
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  <RemainingHint remaining={remainingChoAfterBasic} perExchange={23} label="Rice" />
                  <span className="text-xs text-muted">Target {fmt1(targetCho)} g</span>
                  <DiffTag diff={choDiff} />
                </div>
              </div>
            </div>

            <TableGroup title="Rice / Starchy" open={open.rice} onToggle={() => toggleSection('rice')}>
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
              <div className="fel-row subtotal-row">
                <div className="fel-td font-bold">Rice Subtotal</div>
                <div className="fel-td text-right font-bold">{fmtValue(riceN)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(riceCho)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(riceProtein)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(riceFat)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(riceKcal)}</div>
              </div>

              <div className="fel-row subtotal-row">
                <div className="fel-td font-bold col-span-2">Protein so far</div>
                <div className="fel-td" />
                <div className="fel-td text-right font-bold">{fmtValue(proteinSoFarAfterRice)}</div>
                <div className="fel-td col-span-2" />
              </div>
            </TableGroup>
            <div className="fel-row diff-row">
              <div className="fel-td col-span-6 text-right">
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  <RemainingHint remaining={remainingProteinAfterRice} perExchange={8} label="Meat" />
                  <span className="text-xs text-muted">Target {fmt1(targetProtein)} g</span>
                </div>
              </div>
            </div>

            <TableGroup title="Meat / Fish" open={open.meat} onToggle={() => toggleSection('meat')}>
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
              <div className="fel-row subtotal-row">
                <div className="fel-td font-bold">Meat Subtotal</div>
                <div className="fel-td text-right font-bold">{fmtValue(meatN)}</div>
                <div className="fel-td text-right">0</div>
                <div className="fel-td text-right font-bold">{fmtValue(meatProtein)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(meatFat)}</div>
                <div className="fel-td text-right font-bold">{fmtValue(meatKcal)}</div>
              </div>
            </TableGroup>
            <div className="fel-row diff-row">
              <div className="fel-td col-span-6 text-right">
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  <RemainingHint remaining={remainingFat} perExchange={5} label="Fat" />
                  <span className="text-xs text-muted">Target {fmt1(targetFat)} g</span>
                  <DiffTag diff={fatDiff} />
                </div>
              </div>
            </div>

            <TableGroup title="Fat" open={open.fat} onToggle={() => toggleSection('fat')}>
              <TableRow
                index="VI"
                name="Fat"
                count={exchanges.fat}
                data={getRow('fat')}
                onChange={(e) => updateExchange('fat', e.target.value)}
              />
              <div className="fel-row subtotal-row">
                <div className="fel-td font-bold col-span-2">
                  Fat so far (before Fat exchanges)
                </div>
                <div className="fel-td col-span-2" />
                <div className="fel-td text-right font-bold">{fmtValue(fatSoFarBeforeFatExchange)}</div>
                <div className="fel-td" />
              </div>
            </TableGroup>

            <div className="fel-row total-row">
              <div className="fel-td font-bold">TOTAL</div>
              <div className="fel-td text-right font-bold">{fmtValue(totalN)}</div>
              <div className="fel-td text-right font-bold">{fmtValue(totalCho)}</div>
              <div className="fel-td text-right font-bold">{fmtValue(totalProtein)}</div>
              <div className="fel-td text-right font-bold">{fmtValue(totalFat)}</div>
              <div className="fel-td text-right font-bold">{fmtInt(totalKcal)}</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted px-4 py-2 border-t border-border m-0">
          Values are rounded to whole exchanges. Maximum {EXCHANGE_MAX} per group.
        </p>
      </div>
    </div>
  );
}