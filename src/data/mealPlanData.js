// ======================
// FOOD ITEMS (Sample lists – practical for demo)
// ======================
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

export const GROUP_MEASURES = {
  veg: ['½ cup', '1 cup', '1½ cups'],
  fruit: ['1 slice', '1 pc', '1 cup', '1 glass'],
  milkWhole: ['5 Tbsp', '1 cup', '½ cup', '2 Tbsp'],
  milk: ['5 Tbsp', '1 cup', '½ cup'],
  milkSkim: ['5 Tbsp', '1 cup', '½ cup'],
  sugar: ['1 tsp', '2 tsp', '1 Tbsp'],
  riceA: ['1 pc', '1 slice', '1 ear', '3 pcs'],
  riceB: ['1 cup', '1 slice', '1½ cups'],
  riceC: ['1½ pcs', '1 slice', '¾ cup', '2 pcs'],
  meatLow: ['1 slice', '3 pcs', '1 cup'],
  meatMed: ['1 pc', '1 slice', '½ cup', '1 egg'],
  meatHigh: ['1 slice', '1 pc', '1 can', '¼ cup'],
  fat: ['1 tsp', '1 Tbsp', '2 tsp'],
};

// ======================
// LABELS & KEYS
// ======================
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

export const GROUP_KEYS = Object.keys(GROUP_LABELS);

export const MEAL_PERIODS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'amSnack', label: 'AM Snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'pmSnack', label: 'PM Snack' },
  { key: 'supper', label: 'Supper' },
];

// ======================
// DEFAULTS
// ======================
export const NEW_ROW_DEFAULTS = {
  group: 'veg',
  foodIndex: 0,
  n: 1,
};

// ======================
// HELPERS
// ======================
let _idCounter = 1000;

// Single source of row ids, so generated and hand-added rows never collide.
export const nextRowId = () => _idCounter++;

function snapToInt(n) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}

/** Turn 5 into [1, 1, 1, 1, 1] */
function splitExchangeCount(total) {
  const t = snapToInt(total);
  if (t <= 0) return [];
  return Array.from({ length: t }, () => 1);
}

/**
 * Distribute an array of parts across `slots` buckets as evenly as possible.
 * Returns array of arrays, length === slots.
 */
function distributeParts(parts, slots) {
  const buckets = Array.from({ length: slots }, () => []);
  if (!parts.length || slots <= 0) return buckets;
  parts.forEach((part, i) => {
    buckets[i % slots].push(part);
  });
  return buckets;
}

function createRow(group, foodIndex = 0, n = 1) {
  return {
    id: nextRowId(),
    group,
    foodIndex,
    n: snapToInt(n) || 1,
  };
}

// ======================
// GENERATE MEAL PLAN
// ======================
export function generateMealPlan(exchanges = {}) {
  const e = exchanges;

  const breakfast = [];
  const amSnack = [];
  const lunch = [];
  const pmSnack = [];
  const supper = [];

  // --- Vegetable → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.veg || 0);
    const [vB, vL, vS] = distributeParts(parts, 3);
    vB.forEach((n) => breakfast.push(createRow('veg', 0, n)));
    vL.forEach((n) => lunch.push(createRow('veg', 0, n)));
    vS.forEach((n) => supper.push(createRow('veg', 0, n)));
  }

  // --- Fruit → all 5 meals ---
  {
    const parts = splitExchangeCount(e.fruit || 0);
    const [fB, fAm, fL, fPm, fS] = distributeParts(parts, 5);
    fB.forEach((n) => breakfast.push(createRow('fruit', 0, n)));
    fAm.forEach((n) => amSnack.push(createRow('fruit', 0, n)));
    fL.forEach((n) => lunch.push(createRow('fruit', 0, n)));
    fPm.forEach((n) => pmSnack.push(createRow('fruit', 0, n)));
    fS.forEach((n) => supper.push(createRow('fruit', 0, n)));
  }

  // --- Milk (prefer breakfast → amSnack → pmSnack → lunch for leftovers) ---
  ['milkWhole', 'milk', 'milkSkim'].forEach((key) => {
    const parts = splitExchangeCount(e[key] || 0);
    if (parts.length === 0) return;
    if (parts.length === 1) {
      breakfast.push(createRow(key, 0, parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow(key, 0, parts[0]));
      amSnack.push(createRow(key, 0, parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow(key, 0, parts[0]));
      amSnack.push(createRow(key, 0, parts[1]));
      pmSnack.push(createRow(key, 0, parts[2]));
    } else {
      breakfast.push(createRow(key, 0, parts[0]));
      amSnack.push(createRow(key, 0, parts[1]));
      pmSnack.push(createRow(key, 0, parts[2]));
      for (let i = 3; i < parts.length; i++) {
        lunch.push(createRow(key, 0, parts[i]));
      }
    }
  });

  // --- Sugar (prefer breakfast → amSnack → pmSnack → lunch) ---
  {
    const parts = splitExchangeCount(e.sugar || 0);
    if (parts.length === 1) {
      breakfast.push(createRow('sugar', 0, parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow('sugar', 0, parts[0]));
      amSnack.push(createRow('sugar', 0, parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow('sugar', 0, parts[0]));
      amSnack.push(createRow('sugar', 0, parts[1]));
      pmSnack.push(createRow('sugar', 0, parts[2]));
    } else {
      for (let i = 0; i < parts.length; i++) {
        if (i === 0) breakfast.push(createRow('sugar', 0, parts[i]));
        else if (i === 1) amSnack.push(createRow('sugar', 0, parts[i]));
        else if (i === 2) pmSnack.push(createRow('sugar', 0, parts[i]));
        else lunch.push(createRow('sugar', 0, parts[i]));
      }
    }
  }

  // --- Rice A → pmSnack + breakfast ---
  {
    const parts = splitExchangeCount(e.riceA || 0);
    const [rPm, rB] = distributeParts(parts, 2);
    rPm.forEach((n) => pmSnack.push(createRow('riceA', 0, n)));
    rB.forEach((n) => breakfast.push(createRow('riceA', 0, n)));
  }

  // --- Rice B → breakfast, amSnack, lunch, supper ---
  {
    const parts = splitExchangeCount(e.riceB || 0);
    const [rB, rAm, rL, rS] = distributeParts(parts, 4);
    rB.forEach((n) => breakfast.push(createRow('riceB', 0, n)));
    rAm.forEach((n) => amSnack.push(createRow('riceB', 0, n)));
    rL.forEach((n) => lunch.push(createRow('riceB', 0, n)));
    rS.forEach((n) => supper.push(createRow('riceB', 0, n)));
  }

  // --- Rice C → breakfast ---
  {
    const parts = splitExchangeCount(e.riceC || 0);
    parts.forEach((n) => breakfast.push(createRow('riceC', 0, n)));
  }

  // --- Low-Fat Meat → lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatLow || 0);
    const [mL, mS] = distributeParts(parts, 2);
    mL.forEach((n) => lunch.push(createRow('meatLow', 0, n)));
    mS.forEach((n) => supper.push(createRow('meatLow', 0, n)));
  }

  // --- Medium-Fat Meat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatMed || 0);
    const [mB, mL, mS] = distributeParts(parts, 3);
    mB.forEach((n) => breakfast.push(createRow('meatMed', 0, n)));
    mL.forEach((n) => lunch.push(createRow('meatMed', 0, n)));
    mS.forEach((n) => supper.push(createRow('meatMed', 0, n)));
  }

  // --- High-Fat Meat → lunch ---
  {
    const parts = splitExchangeCount(e.meatHigh || 0);
    parts.forEach((n) => lunch.push(createRow('meatHigh', 0, n)));
  }

  // --- Fat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.fat || 0);
    const [fB, fL, fS] = distributeParts(parts, 3);
    fB.forEach((n) => breakfast.push(createRow('fat', 0, n)));
    fL.forEach((n) => lunch.push(createRow('fat', 0, n)));
    fS.forEach((n) => supper.push(createRow('fat', 0, n)));
  }

  return {
    breakfast,
    amSnack,
    lunch,
    pmSnack,
    supper,
  };
}

// Optional: empty starting plan
export const EMPTY_MEAL_PLAN = {
  breakfast: [],
  amSnack: [],
  lunch: [],
  pmSnack: [],
  supper: [],
};