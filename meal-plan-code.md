# Suggested Meal Plan — NutriCal Code

This is the full code for the suggested meal plan generation flow:
`suggestExchanges()` fills the exchange counts, then `generateMealPlan()`
distributes those counts across meals.

---

## 1. `src/hooks/useNutriCal.js` — the suggest function (fills exchange counts)

```js
// Helpers (top of file)
const roundToHalf = (n) => {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 2) / 2;
};
const snapExchange = (n) => Math.min(20, roundToHalf(n));

const DEFAULTS = {
  veg: 3,
  fruit: 3,
  milk: 1,
  milkWhole: 0,
  milkSkim: 0,
  sugar: 2,
};

// Official FEL 4th Edition values
const EX = {
  veg:       { cho: 3,  protein: 1, fat: 0,  kcal: 16 },
  fruit:     { cho: 10, protein: 0, fat: 0,  kcal: 40 },
  milkWhole: { cho: 12, protein: 8, fat: 10, kcal: 170 },
  milk:      { cho: 12, protein: 8, fat: 5,  kcal: 125 },
  milkSkim:  { cho: 12, protein: 8, fat: 0,  kcal: 80 },
  riceA:     { cho: 23, protein: 0, fat: 0,  kcal: 92 },
  riceB:     { cho: 23, protein: 2, fat: 0,  kcal: 100 },
  riceC:     { cho: 23, protein: 4, fat: 0,  kcal: 108 },
  meatLow:   { cho: 0,  protein: 8, fat: 1,  kcal: 41 },
  meatMed:   { cho: 0,  protein: 8, fat: 6,  kcal: 86 },
  meatHigh:  { cho: 0,  protein: 8, fat: 10, kcal: 122 },
  fatEx:     { cho: 0,  protein: 0, fat: 5,  kcal: 45 },
  sugar:     { cho: 5,  protein: 0, fat: 0,  kcal: 20 },
};

// Inside useNutriCal() hook:
const suggestExchanges = useCallback(() => {
  if (!assessment) return;
  const { targetCho, targetProtein, targetFat } = assessment;

  // Step 1: fixed/default exchanges
  const result = {
    veg: snapExchange(DEFAULTS.veg),
    fruit: snapExchange(DEFAULTS.fruit),
    milkWhole: snapExchange(DEFAULTS.milkWhole),
    milk: snapExchange(DEFAULTS.milk),
    milkSkim: snapExchange(DEFAULTS.milkSkim),
    sugar: snapExchange(DEFAULTS.sugar),
    riceA: 0,
    riceB: 0,
    riceC: 0,
    meatLow: 0,
    meatMed: 0,
    meatHigh: 0,
    fat: 0,
  };

  // Step 2: CHO partial sum from veg + fruit + milk(s) + sugar
  const choPartialSum =
    result.veg * EX.veg.cho +
    result.fruit * EX.fruit.cho +
    result.milk * EX.milk.cho +
    result.milkWhole * EX.milkWhole.cho +
    result.milkSkim * EX.milkSkim.cho +
    result.sugar * EX.sugar.cho;

  // Step 3: Rice exchanges
  const totalRice = Math.max(0, targetCho - choPartialSum) / 23;
  result.riceB = snapExchange(totalRice);

  // Step 4: Protein partial sum from veg + milk(s) + rice(s)
  const proteinPartialSum =
    result.veg * EX.veg.protein +
    result.milk * EX.milk.protein +
    result.milkWhole * EX.milkWhole.protein +
    result.milkSkim * EX.milkSkim.protein +
    result.riceA * EX.riceA.protein +
    result.riceB * EX.riceB.protein +
    result.riceC * EX.riceC.protein;

  // Step 5: Meat exchanges
  const totalMeat = Math.max(0, targetProtein - proteinPartialSum) / 8;
  result.meatMed = snapExchange(totalMeat);

  // Step 6: Fat partial sum from milk + meat
  const fatPartialSum =
    result.milk * EX.milk.fat +
    result.milkWhole * EX.milkWhole.fat +
    result.milkSkim * EX.milkSkim.fat +
    result.meatLow * EX.meatLow.fat +
    result.meatMed * EX.meatMed.fat +
    result.meatHigh * EX.meatHigh.fat;

  // Step 7: Fat exchanges
  result.fat = snapExchange((targetFat - fatPartialSum) / 5);

  setExchanges(result);
}, [assessment]);
```

---

## 2. `src/data/mealPlanData.js` — the meal plan generator (distributes counts across meals)

```js
export function generateMealPlan(exchanges = {}) {
  const e = exchanges;
  const breakfast = [], amSnack = [], lunch = [], pmSnack = [], supper = [];

  // --- Vegetable (main meals) ---
  {
    const [b, l, s] = distribute(e.veg || 0, 3);
    for (let i = 0; i < b; i++) breakfast.push(createRow('veg'));
    for (let i = 0; i < l; i++) lunch.push(createRow('veg'));
    for (let i = 0; i < s; i++) supper.push(createRow('veg'));
  }

  // --- Fruit ---
  {
    const [b, am, l, pm, s] = distribute(e.fruit || 0, 5);
    for (let i = 0; i < b; i++) breakfast.push(createRow('fruit'));
    for (let i = 0; i < am; i++) amSnack.push(createRow('fruit'));
    for (let i = 0; i < l; i++) lunch.push(createRow('fruit'));
    for (let i = 0; i < pm; i++) pmSnack.push(createRow('fruit'));
    for (let i = 0; i < s; i++) supper.push(createRow('fruit'));
  }

  // --- Milk (prefer breakfast & snacks) ---
  ['milkWhole', 'milk', 'milkSkim'].forEach((key) => {
    const count = e[key] || 0;
    if (count >= 1) breakfast.push(createRow(key));
    if (count >= 2) amSnack.push(createRow(key));
    if (count >= 3) pmSnack.push(createRow(key));
    for (let i = 3; i < count; i++) lunch.push(createRow(key));
  });

  // --- Sugar ---
  {
    const total = e.sugar || 0;
    if (total >= 1) breakfast.push(createRow('sugar'));
    if (total >= 2) amSnack.push(createRow('sugar'));
    if (total >= 3) pmSnack.push(createRow('sugar'));
    for (let i = 3; i < total; i++) lunch.push(createRow('sugar'));
  }

  // --- Rice A (usually snack or side) ---
  {
    const [pm, b] = distribute(e.riceA || 0, 2);
    for (let i = 0; i < pm; i++) pmSnack.push(createRow('riceA'));
    for (let i = 0; i < b; i++) breakfast.push(createRow('riceA'));
  }

  // --- Rice B (main carbohydrate) ---
  {
    const [b, am, l, s] = distribute(e.riceB || 0, 4);
    for (let i = 0; i < b; i++) breakfast.push(createRow('riceB'));
    for (let i = 0; i < am; i++) amSnack.push(createRow('riceB'));
    for (let i = 0; i < l; i++) lunch.push(createRow('riceB'));
    for (let i = 0; i < s; i++) supper.push(createRow('riceB'));
  }

  // --- Rice C (usually breakfast) ---
  {
    const total = e.riceC || 0;
    for (let i = 0; i < total; i++) breakfast.push(createRow('riceC'));
  }

  // --- Low-Fat Meat ---
  {
    const [l, s] = distribute(e.meatLow || 0, 2);
    for (let i = 0; i < l; i++) lunch.push(createRow('meatLow'));
    for (let i = 0; i < s; i++) supper.push(createRow('meatLow'));
  }

  // --- Medium-Fat Meat ---
  {
    const [b, l, s] = distribute(e.meatMed || 0, 3);
    for (let i = 0; i < b; i++) breakfast.push(createRow('meatMed'));
    for (let i = 0; i < l; i++) lunch.push(createRow('meatMed'));
    for (let i = 0; i < s; i++) supper.push(createRow('meatMed'));
  }

  // --- High-Fat Meat ---
  {
    const total = e.meatHigh || 0;
    for (let i = 0; i < total; i++) lunch.push(createRow('meatHigh'));
  }

  // --- Fat ---
  {
    const [b, l, s] = distribute(e.fat || 0, 3);
    for (let i = 0; i < b; i++) breakfast.push(createRow('fat'));
    for (let i = 0; i < l; i++) lunch.push(createRow('fat'));
    for (let i = 0; i < s; i++) supper.push(createRow('fat'));
  }

  return { breakfast, amSnack, lunch, pmSnack, supper };
}

function distribute(total, slots) {
  const result = Array(slots).fill(0);
  if (total <= 0) return result;
  const base = Math.floor(total / slots);
  let remainder = total % slots;
  for (let i = 0; i < slots; i++) {
    result[i] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
  }
  return result;
}

function createRow(group, foodIndex = 0, n = 1) {
  return { id: _idCounter++, group, foodIndex, n };
}
```

---

## 3. `src/data/mealPlanData.js` — supporting data (FOOD_ITEMS, labels, periods)

```js
export const FOOD_ITEMS = {
  veg: [
    { name: 'Malunggay leaves', measure: '1 cup' },
    { name: 'Kangkong', measure: '1 cup' },
    { name: 'Sitaw (string beans)', measure: '½ cup' },
    { name: 'Squash', measure: '½ cup' },
    { name: 'Eggplant', measure: '½ cup' },
    { name: 'Tomato', measure: '½ cup' },
    { name: 'Cabbage', measure: '½ cup' },
    { name: 'Bell pepper', measure: '½ cup' },
    { name: 'Papaya, unripe', measure: '½ cup' },
    { name: 'Pechay', measure: '1 cup' },
  ],
  fruit: [
    { name: 'Banana, Lacatan', measure: '1 pc' },
    { name: 'Banana, Saba', measure: '1 pc' },
    { name: 'Mango, ripe', measure: '1 slice' },
    { name: 'Papaya, ripe', measure: '1 cup' },
    { name: 'Watermelon', measure: '1 cup' },
    { name: 'Apple', measure: '1 pc' },
    { name: 'Orange', measure: '1 pc' },
    { name: 'Pineapple', measure: '1 cup' },
    { name: 'Guava', measure: '1 pc' },
    { name: 'Coconut water', measure: '1 glass' },
  ],
  milkWhole: [
    { name: 'Full cream milk, powder', measure: '5 Tbsp' },
    { name: 'Whole milk, fresh', measure: '1 cup' },
    { name: 'Evaporated milk, whole', measure: '½ cup' },
    { name: 'Yogurt, whole', measure: '1 cup' },
  ],
  milk: [
    { name: 'Low-fat milk, powder', measure: '5 Tbsp' },
    { name: 'Low-fat milk, fresh', measure: '1 cup' },
    { name: 'Evaporated milk, low-fat', measure: '½ cup' },
    { name: 'Yogurt, low-fat', measure: '1 cup' },
  ],
  milkSkim: [
    { name: 'Skim milk, powder', measure: '5 Tbsp' },
    { name: 'Skim milk, fresh', measure: '1 cup' },
    { name: 'Evaporated milk, skim', measure: '½ cup' },
    { name: 'Yogurt, fat-free', measure: '1 cup' },
  ],
  sugar: [
    { name: 'White sugar', measure: '1 tsp' },
    { name: 'Brown sugar', measure: '1 tsp' },
    { name: 'Honey', measure: '1 tsp' },
    { name: 'Jam', measure: '1 tsp' },
  ],
  riceA: [
    { name: 'Potato, boiled', measure: '1 medium' },
    { name: 'Sweet potato, boiled', measure: '1 medium' },
    { name: 'Corn on cob, boiled', measure: '1 ear' },
    { name: 'White bread', measure: '1 slice' },
    { name: 'Crackers, plain', measure: '3 pcs' },
  ],
  riceB: [
    { name: 'Boiled rice (well-milled)', measure: '1 cup' },
    { name: 'Brown rice, boiled', measure: '1 cup' },
    { name: 'Noodles, boiled', measure: '1 cup' },
    { name: 'Pancit bihon (plain)', measure: '1 cup' },
    { name: 'Puto', measure: '1 pc' },
  ],
  riceC: [
    { name: 'Pan de sal', measure: '1½ pcs' },
    { name: 'Wheat bread', measure: '1 slice' },
    { name: 'Oatmeal, cooked', measure: '¾ cup' },
    { name: 'Cornflakes', measure: '¾ cup' },
    { name: 'Graham crackers', measure: '2 pcs' },
  ],
  meatLow: [
    { name: 'Fish, steamed/broiled', measure: '1 slice (30–40g)' },
    { name: 'Bangus, broiled', measure: '1 slice' },
    { name: 'Shrimp, boiled', measure: '4–5 pcs' },
    { name: 'Squid, grilled', measure: '1 serving' },
    { name: 'Tofu, firm', measure: '¾–1 cup' },
    { name: 'Egg white only', measure: '2 pcs' },
  ],
  meatMed: [
    { name: 'Chicken, without skin', measure: '1 pc (leg/thigh)' },
    { name: 'Pork, lean, boiled', measure: '1 slice' },
    { name: 'Beef, lean, boiled', measure: '1 slice' },
    { name: 'Egg, whole', measure: '1 pc' },
    { name: 'Tuna, canned in water', measure: '½ cup' },
  ],
  meatHigh: [
    { name: 'Pork liempo', measure: '1 slice' },
    { name: 'Chicken with skin, fried', measure: '1 pc' },
    { name: 'Beef, fatty cut', measure: '1 slice' },
    { name: 'Sardines in oil', measure: '½ can' },
    { name: 'Corned beef', measure: '¼ cup' },
  ],
  fat: [
    { name: 'Cooking oil', measure: '1 tsp' },
    { name: 'Olive oil', measure: '1 tsp' },
    { name: 'Butter', measure: '1 tsp' },
    { name: 'Margarine', measure: '1 tsp' },
    { name: 'Mayonnaise', measure: '1 tsp' },
    { name: 'Peanut butter', measure: '1 tsp' },
  ],
};

export const GROUP_LABELS = {
  veg: 'Vegetable',
  fruit: 'Fruit',
  milkWhole: 'Whole Milk',
  milk: 'Low-Fat Milk',
  milkSkim: 'Skim / Fat-Free Milk',
  sugar: 'Sugar',
  riceA: 'Rice A (Low Protein)',
  riceB: 'Rice B (Medium Protein)',
  riceC: 'Rice C (High Protein)',
  meatLow: 'Low-Fat Meat',
  meatMed: 'Medium-Fat Meat',
  meatHigh: 'High-Fat Meat',
  fat: 'Fat',
};

export const MEAL_PERIODS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'amSnack', label: 'AM Snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'pmSnack', label: 'PM Snack' },
  { key: 'supper', label: 'Supper' },
];

export const NEW_ROW_DEFAULTS = {
  group: 'veg',
  foodIndex: 0,
  n: 1,
};
```

---

## 4. `src/components/MealPlan.jsx` — the renderer (meal plan UI)

```jsx
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
            step="0.5"
            value={item.n ?? 1}
            onChange={(e) => onUpdate(mealKey, item.id, 'n', e.target.value)}
            onBlur={(e) => {
              const v = parseFloat(e.target.value);
              const capped = Number.isFinite(v) && v >= 0 ? Math.min(v, EXCHANGE_MAX) : 1;
              if (capped !== item.n) onUpdate(mealKey, item.id, 'n', String(capped));
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
          <span className="text-xs text-muted px-1.5">
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
  generatePlan,
  exchanges,
  mealPlanValidation,
}) {
  if (!mealPlan || !mealPlanValidation) return null;

  const hasExchanges = exchanges && Object.values(exchanges).some((v) => v > 0);
  const isEmpty = Object.values(mealPlan).every((rows) => rows.length === 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted m-0">
          {isEmpty
            ? 'Enter exchanges in step 3, then generate a meal plan.'
            : 'Drag rows to reorder. Edit # to change exchange count per row.'}
        </p>

        <div className="flex items-center gap-3">
          {hasExchanges && (
            <button type="button" onClick={generatePlan} className="btn-primary text-sm cursor-pointer">
              Generate Plan
            </button>
          )}
          {!isEmpty && (
            <span
              className={`badge ${mealPlanValidation.allValid ? 'badge-normal' : 'badge-warning'}`}
            >
              {mealPlanValidation.allValid ? 'Within limits' : 'Over limit'}
            </span>
          )}
        </div>
      </div>

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
 ```

---

## 5. Food Groups, Foods & Measurements

### Vegetable
| Food | Measure |
|------|---------|
| Malunggay leaves | 1 cup |
| Kangkong | 1 cup |
| Sitaw (string beans) | ½ cup |
| Squash | ½ cup |
| Eggplant | ½ cup |
| Tomato | ½ cup |
| Cabbage | ½ cup |
| Bell pepper | ½ cup |
| Papaya, unripe | ½ cup |
| Pechay | 1 cup |

### Fruit
| Food | Measure |
|------|---------|
| Banana, Lacatan | 1 pc |
| Banana, Saba | 1 pc |
| Mango, ripe | 1 slice |
| Papaya, ripe | 1 cup |
| Watermelon | 1 cup |
| Apple | 1 pc |
| Orange | 1 pc |
| Pineapple | 1 cup |
| Guava | 1 pc |
| Coconut water | 1 glass |

### Whole Milk
| Food | Measure |
|------|---------|
| Full cream milk, powder | 5 Tbsp |
| Whole milk, fresh | 1 cup |
| Evaporated milk, whole | ½ cup |
| Yogurt, whole | 1 cup |

### Low-Fat Milk
| Food | Measure |
|------|---------|
| Low-fat milk, powder | 5 Tbsp |
| Low-fat milk, fresh | 1 cup |
| Evaporated milk, low-fat | ½ cup |
| Yogurt, low-fat | 1 cup |

### Skim / Fat-Free Milk
| Food | Measure |
|------|---------|
| Skim milk, powder | 5 Tbsp |
| Skim milk, fresh | 1 cup |
| Evaporated milk, skim | ½ cup |
| Yogurt, fat-free | 1 cup |

### Sugar
| Food | Measure |
|------|---------|
| White sugar | 1 tsp |
| Brown sugar | 1 tsp |
| Honey | 1 tsp |
| Jam | 1 tsp |

### Rice A (Low Protein)
| Food | Measure |
|------|---------|
| Potato, boiled | 1 medium |
| Sweet potato, boiled | 1 medium |
| Corn on cob, boiled | 1 ear |
| White bread | 1 slice |
| Crackers, plain | 3 pcs |

### Rice B (Medium Protein)
| Food | Measure |
|------|---------|
| Boiled rice (well-milled) | 1 cup |
| Brown rice, boiled | 1 cup |
| Noodles, boiled | 1 cup |
| Pancit bihon (plain) | 1 cup |
| Puto | 1 pc |

### Rice C (High Protein)
| Food | Measure |
|------|---------|
| Pan de sal | 1½ pcs |
| Wheat bread | 1 slice |
| Oatmeal, cooked | ¾ cup |
| Cornflakes | ¾ cup |
| Graham crackers | 2 pcs |

### Low-Fat Meat
| Food | Measure |
|------|---------|
| Fish, steamed/broiled | 1 slice (30–40g) |
| Bangus, broiled | 1 slice |
| Shrimp, boiled | 4–5 pcs |
| Squid, grilled | 1 serving |
| Tofu, firm | ¾–1 cup |
| Egg white only | 2 pcs |

### Medium-Fat Meat
| Food | Measure |
|------|---------|
| Chicken, without skin | 1 pc (leg/thigh) |
| Pork, lean, boiled | 1 slice |
| Beef, lean, boiled | 1 slice |
| Egg, whole | 1 pc |
| Tuna, canned in water | ½ cup |

### High-Fat Meat
| Food | Measure |
|------|---------|
| Pork liempo | 1 slice |
| Chicken with skin, fried | 1 pc |
| Beef, fatty cut | 1 slice |
| Sardines in oil | ½ can |
| Corned beef | ¼ cup |

### Fat
| Food | Measure |
|------|---------|
| Cooking oil | 1 tsp |
| Olive oil | 1 tsp |
| Butter | 1 tsp |
| Margarine | 1 tsp |
| Mayonnaise | 1 tsp |
| Peanut butter | 1 tsp |
