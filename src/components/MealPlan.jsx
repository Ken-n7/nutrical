import { useState, useRef, useCallback } from 'react';
import {
  FOOD_ITEMS,
  MEAL_PERIODS,
  GROUP_LABELS,
  GROUP_KEYS,
} from '../data/mealPlanData';

const EXCHANGE_MAX = 20;

function MealRow({
  item,
  mealKey,
  validation,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  dragState,
}) {
  const isEmpty = !item.group;
  const group = item.group;
  const items = group ? FOOD_ITEMS[group] || [] : [];
  const fIdx = Math.min(item.foodIndex || 0, Math.max(items.length - 1, 0));
  const selectedFood = items[fIdx];
  const isOver = validation?.over;

  const { draggingId, overId, dropSide } = dragState;
  const isDragging = draggingId === item.id;
  const isDropTarget = overId === item.id;

  let rowClass = 'transition-all duration-150 ease-out ';
  if (isDragging) {
    rowClass += 'opacity-40 scale-[0.98] bg-teal-50 ';
  } else if (isOver) {
    rowClass += 'bg-red-50 ';
  } else if (isEmpty) {
    rowClass += 'bg-amber-50/50 ';
  }

  if (isDropTarget && !isDragging) {
    rowClass += dropSide === 'top' ? 'border-t-2 border-teal-500 ' : 'border-b-2 border-teal-500 ';
  }

  const inputCls =
    'w-full text-xs border-0 bg-transparent py-2 px-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded cursor-pointer';

  return (
    <tr
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, item.id)}
      className={rowClass}
    >
      {/* Drag handle */}
      <td className="w-7 cursor-grab active:cursor-grabbing select-none text-center">
        <span className="inline-flex items-center justify-center text-gray-300 hover:text-gray-500">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </span>
      </td>

      {/* Group */}
      <td className="w-36">
        <select
          className={`${inputCls} ${isEmpty ? 'text-gray-400 italic' : 'text-gray-800 font-medium'}`}
          value={item.group || ''}
          onChange={(e) => onUpdate(mealKey, item.id, 'group', e.target.value)}
          aria-label="Food group"
          tabIndex={isDragging ? -1 : 0}
        >
          <option value="">— select —</option>
          {GROUP_KEYS.map((g) => (
            <option key={g} value={g}>
              {GROUP_LABELS[g]}
            </option>
          ))}
        </select>
      </td>

      {/* Exchange count */}
      <td className="w-14 text-center">
        {isEmpty ? (
          <span className="text-xs text-gray-300">—</span>
        ) : (
          <input
            type="number"
            min="0"
            max={EXCHANGE_MAX}
            step="0.5"
            value={item.n ?? 1}
            onChange={(e) => onUpdate(mealKey, item.id, 'n', e.target.value)}
            onBlur={(e) => {
              const v = parseFloat(e.target.value);
              const capped = Number.isFinite(v) && v >= 0 ? Math.min(v, EXCHANGE_MAX) : 1;
              if (capped !== item.n) onUpdate(mealKey, item.id, 'n', String(capped));
            }}
            className="w-full text-center text-xs font-semibold border-0 bg-transparent py-2 px-1 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
            aria-label="Exchange count"
            tabIndex={isDragging ? -1 : 0}
          />
        )}
      </td>

      {/* Food item */}
      <td className="min-w-0">
        {isEmpty ? (
          <span className="text-xs text-gray-300 px-1">—</span>
        ) : (
          <select
            className={inputCls}
            value={fIdx}
            onChange={(e) => onUpdate(mealKey, item.id, 'foodIndex', e.target.value)}
            aria-label="Food item"
            tabIndex={isDragging ? -1 : 0}
            title={selectedFood?.name}
          >
            {items.map((it, i) => (
              <option key={i} value={i}>
                {it.name}
              </option>
            ))}
          </select>
        )}
      </td>

      {/* Measure (now comes directly from the food) */}
      <td className="w-28">
        {isEmpty ? (
          <span className="text-xs text-gray-300 px-1">—</span>
        ) : (
          <span className="text-xs text-gray-600 px-1.5">
            {selectedFood?.measure || '—'}
          </span>
        )}
      </td>

      {/* Remove button */}
      <td className="w-8 text-center">
        <button
          type="button"
          onClick={() => onRemove(mealKey, item.id)}
          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          aria-label={`Remove ${GROUP_LABELS[group] || 'row'}`}
          tabIndex={isDragging ? -1 : 0}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

function MealSection({
  mealKey,
  mealLabel,
  rows,
  validation,
  addMealRow,
  removeMealRow,
  updateMealRow,
  moveMealRow,
}) {
  const [dragState, setDragState] = useState({
    draggingId: null,
    overId: null,
    dropSide: null,
  });
  const dragItem = useRef(null);

  const handleDragStart = useCallback((e, rowId) => {
    dragItem.current = rowId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rowId);
    requestAnimationFrame(() => {
      setDragState({ draggingId: rowId, overId: null, dropSide: null });
    });
  }, []);

  const handleDragOver = useCallback((e, rowId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragItem.current === rowId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';

    setDragState((prev) => {
      if (prev.overId === rowId && prev.dropSide === side) return prev;
      return { ...prev, overId: rowId, dropSide: side };
    });
  }, []);

  const handleDrop = useCallback(
    (e, targetId) => {
      e.preventDefault();
      const sourceId = dragItem.current;
      if (sourceId && sourceId !== targetId) {
        moveMealRow(mealKey, sourceId, targetId, dragState.dropSide || 'bottom');
      }
      setDragState({ draggingId: null, overId: null, dropSide: null });
      dragItem.current = null;
    },
    [dragState.dropSide, mealKey, moveMealRow]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ draggingId: null, overId: null, dropSide: null });
    dragItem.current = null;
  }, []);

  const activeCount = rows.filter((r) => r.group).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wide">
            {mealLabel}
          </h4>
          {activeCount > 0 && (
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addMealRow(mealKey)}
          className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-teal-50"
        >
          + Add
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="py-6 text-center text-gray-400 text-xs">
          No items yet. Click <span className="font-semibold text-teal-600">+ Add</span> to begin.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '28px' }} />
              <col style={{ width: '130px' }} />
              <col style={{ width: '52px' }} />
              <col />
              <col style={{ width: '110px' }} />
              <col style={{ width: '36px' }} />
            </colgroup>
            <thead>
              <tr className="text-left text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="py-1.5 px-1" />
                <th className="py-1.5 px-1 text-[10px] font-semibold">Group</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold text-center">#</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold">Food</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold">Measure</th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((item) => (
                <MealRow
                  key={item.id}
                  item={item}
                  mealKey={mealKey}
                  validation={validation?.groups?.[item.group]}
                  onUpdate={updateMealRow}
                  onRemove={removeMealRow}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  dragState={dragState}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DistributionComparison({ validation, exchanges }) {
  const { groups } = validation;
  const entries = GROUP_KEYS.filter(
    (g) => (exchanges[g] || 0) > 0 || (groups[g]?.mealTotal || 0) > 0
  );

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Distribution vs Meal Plan
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="py-2 px-3 text-[10px] font-semibold">Group</th>
              <th className="py-2 px-3 text-[10px] font-semibold text-center">
                Distribution
              </th>
              <th className="py-2 px-3 text-[10px] font-semibold text-center">
                Meal Plan
              </th>
              <th className="py-2 px-3 text-[10px] font-semibold text-center">
                Diff
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((g) => {
              const { exchangeTotal, mealTotal, over } = groups[g];
              const diff = mealTotal - exchangeTotal;

              return (
                <tr key={g} className={over ? 'bg-red-50' : ''}>
                  <td className="py-2 px-3 font-medium text-gray-700">
                    {GROUP_LABELS[g]}
                  </td>
                  <td className="py-2 px-3 text-center text-gray-500">
                    {exchangeTotal}
                  </td>
                  <td className="py-2 px-3 text-center font-semibold text-gray-800">
                    {mealTotal}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        diff === 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : diff > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff}
                      {diff > 0 && ' over'}
                      {diff < 0 && ' under'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MealPlan({
  mealPlan,
  addMealRow,
  removeMealRow,
  updateMealRow,
  moveMealRow,
  generatePlan,
  exchanges,
  mealPlanValidation,
}) {
  if (!mealPlan || !mealPlanValidation) return null;

  const hasExchanges = exchanges && Object.values(exchanges).some((v) => v > 0);
  const isEmpty = Object.values(mealPlan).every((rows) => rows.length === 0);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">One-Day Meal Plan</h2>
          <p className="text-sm text-gray-500 m-0">
            {isEmpty
              ? 'Fill in patient info and exchanges above, then generate a meal plan.'
              : 'Drag rows to reorder. Edit # to change exchange count per row.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasExchanges && (
            <button
              type="button"
              onClick={generatePlan}
              className="btn-primary text-sm cursor-pointer"
            >
              Generate Plan
            </button>
          )}
          {!isEmpty && (
            <span
              className={`status-badge ${
                mealPlanValidation.allValid ? 'status-normal' : 'status-warning'
              }`}
            >
              {mealPlanValidation.allValid ? 'Within limits' : 'Over limit'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {MEAL_PERIODS.map(({ key, label }) => (
          <MealSection
            key={key}
            mealKey={key}
            mealLabel={label}
            rows={mealPlan[key] || []}
            validation={mealPlanValidation}
            addMealRow={addMealRow}
            removeMealRow={removeMealRow}
            updateMealRow={updateMealRow}
            moveMealRow={moveMealRow}
          />
        ))}
      </div>

      <DistributionComparison
        validation={mealPlanValidation}
        exchanges={exchanges}
      />
    </section>
  );
}