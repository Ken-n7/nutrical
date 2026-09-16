import { useState, useRef, useCallback } from 'react';
import {
  FOOD_ITEMS,
  MEAL_PERIODS,
  GROUP_LABELS,
  GROUP_KEYS,
} from '../data/mealPlanData';
import { EXCHANGE_MAX } from '../hooks/useNutriCal';

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
    rowClass += 'opacity-40 scale-[0.98] bg-bg ';
  } else if (isOver) {
    rowClass += 'bg-amber-50 dark:bg-amber-950/40 ';
  } else if (isEmpty) {
    rowClass += 'bg-amber-50/40 dark:bg-amber-950/40 ';
  }

  if (isDropTarget && !isDragging) {
    rowClass += dropSide === 'top' ? 'border-t-2 border-primary ' : 'border-b-2 border-primary ';
  }

  const inputCls =
    'w-full text-xs border-0 bg-transparent py-2 px-1.5 focus:outline-none focus:ring-1 focus:ring-primary rounded cursor-pointer';

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
        <span className="inline-flex items-center justify-center text-faint hover:text-primary">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
          className={`${inputCls} ${isEmpty ? 'text-faint italic' : 'font-medium'}`}
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
          <span className="text-xs text-faint">—</span>
        ) : (
          <input
            type="number"
            min="0"
            max={EXCHANGE_MAX}
            step="1"
            value={item.n ?? 1}
            onChange={(e) => onUpdate(mealKey, item.id, 'n', e.target.value)}
            onBlur={(e) => {
              const v = parseFloat(e.target.value);
              const snapped = Number.isFinite(v) && v >= 0
                ? Math.min(EXCHANGE_MAX, Math.round(v))
                : 1;
              if (snapped !== item.n) onUpdate(mealKey, item.id, 'n', String(snapped));
            }}
            className="w-full text-center text-xs font-semibold border-0 bg-transparent py-2 px-1 focus:outline-none focus:ring-1 focus:ring-primary rounded"
            aria-label="Exchange count"
            tabIndex={isDragging ? -1 : 0}
          />
        )}
      </td>

      {/* Food item */}
      <td className="min-w-0">
        {isEmpty ? (
          <span className="text-xs text-faint px-1">—</span>
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

      {/* Measure */}
      <td className="w-28">
        {isEmpty ? (
          <span className="text-xs text-faint px-1">—</span>
        ) : (
          <span className="block text-xs text-muted px-1.5 leading-snug break-words" title={selectedFood?.measure || '—'}>
            {selectedFood?.measure || '—'}
          </span>
        )}
      </td>

      {/* Remove */}
      <td className="w-8 text-center">
        <button
          type="button"
          onClick={() => onRemove(mealKey, item.id)}
          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-faint hover:text-red-500 transition-colors cursor-pointer"
          aria-label={`Remove ${GROUP_LABELS[group] || 'row'}`}
          tabIndex={isDragging ? -1 : 0}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
  const dropSideRef = useRef(null);

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
    dropSideRef.current = side;

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
        moveMealRow(mealKey, sourceId, targetId, dropSideRef.current || 'bottom');
      }
      setDragState({ draggingId: null, overId: null, dropSide: null });
      dropSideRef.current = null;
      dragItem.current = null;
    },
    [mealKey, moveMealRow]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ draggingId: null, overId: null, dropSide: null });
    dropSideRef.current = null;
    dragItem.current = null;
  }, []);

  const activeCount = rows.filter((r) => r.group).length;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 bg-primary">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wide m-0">
            {mealLabel}
          </h4>
          {activeCount > 0 && (
            <span className="text-[10px] font-semibold text-brand-100 bg-white/20 px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addMealRow(mealKey)}
          className="text-[11px] font-semibold text-brand-100 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-white/10"
        >
          + Add
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="py-6 text-center text-faint text-xs">
          No items yet. Click <span className="font-semibold text-primary">+ Add</span> to begin.
        </div>
      ) : (
        <div>
          <table className="meal-table w-full text-xs">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="text-left text-faint uppercase tracking-wider border-b border-border">
                <th className="py-1.5 px-1" />
                <th className="py-1.5 px-1 text-[10px] font-semibold">Group</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold text-center">#</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold">Food</th>
                <th className="py-1.5 px-1 text-[10px] font-semibold">Measure</th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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

export default function MealPlan({
  mealPlan,
  addMealRow,
  removeMealRow,
  updateMealRow,
  moveMealRow,
  mealPlanValidation,
}) {
  if (!mealPlan || !mealPlanValidation) return null;

  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-4">
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
    </div>
  );
}