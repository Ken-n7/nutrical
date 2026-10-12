// ======================
// FOOD ITEMS
// riceA is transcribed from the FNRI Food Exchange Lists; the other groups
// are still short sample lists waiting to be replaced the same way.
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

  // FEL p. 33, Rice A: Low Protein (23 g carbohydrate, zero or negligible protein).
  // Transcribed from the book; weight is grams of edible portion.
  riceA: [
    { category: 'Rice and Rice Products', filipino: 'Kanin, "protein-reduced"', name: 'Rice, "protein-reduced"', weight: 55, measure: '⅓ cup' },
    { category: 'Rice and Rice Products', filipino: 'Ampaw, pinipig', name: 'Ampaw, pinipig', weight: 25, measure: '2 pcs', dimension: '7 × 4 × 1.5 cm each' },
    { category: 'Rice and Rice Products', filipino: 'Biko', name: 'Rice cake (glutinous), biko', weight: 40, measure: '1 slice', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Rice and Rice Products', filipino: 'Cuchinta', name: 'Rice cake, cuchinta', weight: 60, measure: '2 pcs (5 cm) or 6 pcs (3 cm)', dimension: '5 or 3 cm diameter × 1.5 cm each' },
    { category: 'Rice and Rice Products', filipino: 'Sapin-sapin', name: 'Rice prep (glutinous), sapin-sapin', weight: 75, measure: '1 slice', dimension: '7 × 4 × 2 cm' },
    { category: 'Corn and Corn Products', filipino: 'Cornstarch', name: 'Cornstarch', weight: 25, measure: '¼ cup' },
    { category: 'Corn and Corn Products', filipino: 'Maja blanca', name: 'Corn pudding, maja blanca', weight: 65, measure: '½ slice', dimension: '4.5 × 4 × 3.5 cm' },
    { category: 'Corn and Corn Products', filipino: 'Maja mais', name: 'Corn pudding, maja mais, yellow', weight: 75, measure: '1 slice', dimension: '6 × 4 × 2.5 cm' },
    { category: 'Noodles and Pasta', filipino: 'Bihon', name: 'Noodles, rice', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Misua', name: 'Noodles, wheat, thin', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Sotanghon', name: 'Noodles, mungbean starch', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Sweet potato noodles', name: 'Noodles, sweet potato', weight: 100, measure: '1 cup' },
    { category: 'Rootcrops and Products', filipino: 'Gabi', name: 'Taro', weight: 100, measure: '¾ cup, cubed' },
    { category: 'Rootcrops and Products', filipino: 'Kamote (dilaw, murado, puti)', name: 'Sweet potato (yellow, purple, white)', weight: 85, measure: '1 pc or ¾ cup, cubed', dimension: '4 cm diameter × 9 cm long' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy/balinghoy', name: 'Cassava', weight: 85, measure: '1 slice or ¾ cup, cubed', dimension: '6 × 5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, bibingka', name: 'Cassava cake, bibingka', weight: 55, measure: '1 slice', dimension: '3.5 × 4.5 × 3.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, linupak', name: 'Cassava, mashed, w/sugar and margarine', weight: 55, measure: '1 pc', dimension: '7 × 3 × 3.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, pichi-pichi', name: 'Cassava, pichi-pichi', weight: 45, measure: '1 pc', dimension: '5 cm diameter' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, suman', name: 'Cassava, suman', weight: 45, measure: '1 pc', dimension: '8.5 × 3 × 2 cm' },
    { category: 'Rootcrops and Products', filipino: 'Tugi', name: 'Yam, spiny', weight: 150, measure: '1 pc or 1¼ cups, cubed', dimension: '11.5 × 4.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Ubi', name: 'Yam, purple', weight: 130, measure: '1 cup, cubed' },
    { category: 'Others', filipino: 'Saging, saba, nilaga', name: 'Banana, saba, boiled', weight: 65, measure: '1 pc', dimension: '9.5 × 3.5 × 3.5 cm' },
    { category: 'Others', filipino: 'Sago, nilaga', name: 'Palm starch ball, boiled', weight: 120, measure: '½ cup' },
    { category: 'Others', filipino: 'Sago, tapioca', name: 'Tapioca pearls', weight: 160, measure: '¾ cup' },
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
// Length caps for typed foods (inputs, saved bank, restored sessions).
export const FOOD_NAME_MAX = 80;
export const FOOD_MEASURE_MAX = 40;

// Food used by "+ Add" and "Generate Plan", by English name: the book's sample
// menu choice (Table 1.7) where it has one. Groups not listed use their first food.
export const DEFAULT_FOOD = {
  riceA: 'Sweet potato (yellow, purple, white)',
};

// "Gabi (Taro)"; a single name when Filipino and English are the same.
export const foodLabel = (food) =>
  food.filipino && food.filipino !== food.name ? `${food.filipino} (${food.name})` : food.name;

/** The name and measure a row starts with for a group. */
export function defaultFood(group) {
  const foods = FOOD_ITEMS[group] || [];
  const food = foods.find((f) => f.name === DEFAULT_FOOD[group]) || foods[0];
  return food ? { name: foodLabel(food), measure: food.measure } : { name: '', measure: '' };
}

/** 0.5 -> "½", 1.5 -> "1½", 2 -> "2" */
export const fmtExchanges = (n) => {
  const whole = Math.floor(n);
  return n === whole ? String(whole) : `${whole || ''}½`;
};

// ======================
// HELPERS
// ======================
// Seeded from the clock so ids stay unique next to rows restored after a reload.
let _idCounter = Date.now();

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

// A row carries its own food name and measure, so lists can grow or be
// reordered without breaking saved plans, and typed foods need no lookup.
export function createRow(group, n = 1) {
  return {
    id: nextRowId(),
    group,
    n: snapToInt(n) || 1,
    ...defaultFood(group),
    custom: false,
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
    vB.forEach((n) => breakfast.push(createRow('veg', n)));
    vL.forEach((n) => lunch.push(createRow('veg', n)));
    vS.forEach((n) => supper.push(createRow('veg', n)));
  }

  // --- Fruit → all 5 meals ---
  {
    const parts = splitExchangeCount(e.fruit || 0);
    const [fB, fAm, fL, fPm, fS] = distributeParts(parts, 5);
    fB.forEach((n) => breakfast.push(createRow('fruit', n)));
    fAm.forEach((n) => amSnack.push(createRow('fruit', n)));
    fL.forEach((n) => lunch.push(createRow('fruit', n)));
    fPm.forEach((n) => pmSnack.push(createRow('fruit', n)));
    fS.forEach((n) => supper.push(createRow('fruit', n)));
  }

  // --- Milk (prefer breakfast → amSnack → pmSnack → lunch for leftovers) ---
  ['milkWhole', 'milk', 'milkSkim'].forEach((key) => {
    const parts = splitExchangeCount(e[key] || 0);
    if (parts.length === 0) return;
    if (parts.length === 1) {
      breakfast.push(createRow(key, parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
      pmSnack.push(createRow(key, parts[2]));
    } else {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
      pmSnack.push(createRow(key, parts[2]));
      for (let i = 3; i < parts.length; i++) {
        lunch.push(createRow(key, parts[i]));
      }
    }
  });

  // --- Sugar (prefer breakfast → amSnack → pmSnack → lunch) ---
  {
    const parts = splitExchangeCount(e.sugar || 0);
    if (parts.length === 1) {
      breakfast.push(createRow('sugar', parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow('sugar', parts[0]));
      amSnack.push(createRow('sugar', parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow('sugar', parts[0]));
      amSnack.push(createRow('sugar', parts[1]));
      pmSnack.push(createRow('sugar', parts[2]));
    } else {
      for (let i = 0; i < parts.length; i++) {
        if (i === 0) breakfast.push(createRow('sugar', parts[i]));
        else if (i === 1) amSnack.push(createRow('sugar', parts[i]));
        else if (i === 2) pmSnack.push(createRow('sugar', parts[i]));
        else lunch.push(createRow('sugar', parts[i]));
      }
    }
  }

  // --- Rice A → pmSnack + breakfast ---
  {
    const parts = splitExchangeCount(e.riceA || 0);
    const [rPm, rB] = distributeParts(parts, 2);
    rPm.forEach((n) => pmSnack.push(createRow('riceA', n)));
    rB.forEach((n) => breakfast.push(createRow('riceA', n)));
  }

  // --- Rice B → breakfast, amSnack, lunch, supper ---
  {
    const parts = splitExchangeCount(e.riceB || 0);
    const [rB, rAm, rL, rS] = distributeParts(parts, 4);
    rB.forEach((n) => breakfast.push(createRow('riceB', n)));
    rAm.forEach((n) => amSnack.push(createRow('riceB', n)));
    rL.forEach((n) => lunch.push(createRow('riceB', n)));
    rS.forEach((n) => supper.push(createRow('riceB', n)));
  }

  // --- Rice C → breakfast ---
  {
    const parts = splitExchangeCount(e.riceC || 0);
    parts.forEach((n) => breakfast.push(createRow('riceC', n)));
  }

  // --- Low-Fat Meat → lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatLow || 0);
    const [mL, mS] = distributeParts(parts, 2);
    mL.forEach((n) => lunch.push(createRow('meatLow', n)));
    mS.forEach((n) => supper.push(createRow('meatLow', n)));
  }

  // --- Medium-Fat Meat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatMed || 0);
    const [mB, mL, mS] = distributeParts(parts, 3);
    mB.forEach((n) => breakfast.push(createRow('meatMed', n)));
    mL.forEach((n) => lunch.push(createRow('meatMed', n)));
    mS.forEach((n) => supper.push(createRow('meatMed', n)));
  }

  // --- High-Fat Meat → lunch ---
  {
    const parts = splitExchangeCount(e.meatHigh || 0);
    parts.forEach((n) => lunch.push(createRow('meatHigh', n)));
  }

  // --- Fat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.fat || 0);
    const [fB, fL, fS] = distributeParts(parts, 3);
    fB.forEach((n) => breakfast.push(createRow('fat', n)));
    fL.forEach((n) => lunch.push(createRow('fat', n)));
    fS.forEach((n) => supper.push(createRow('fat', n)));
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