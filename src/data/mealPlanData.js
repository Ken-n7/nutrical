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

function createRow(group, foodIndex = 0, n = 1) {
  return {
    id: _idCounter++,
    group,
    foodIndex,
    n,
  };
}

/**
 * Evenly distribute a total count across a number of slots
 * Example: distribute(7, 3) → [3, 2, 2]
 */
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
    for (let i = 3; i < count; i++) {
      lunch.push(createRow(key));
    }
  });

  // --- Sugar ---
  {
    const total = e.sugar || 0;
    if (total >= 1) breakfast.push(createRow('sugar'));
    if (total >= 2) amSnack.push(createRow('sugar'));
    if (total >= 3) pmSnack.push(createRow('sugar'));
    for (let i = 3; i < total; i++) {
      lunch.push(createRow('sugar'));
    }
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
    for (let i = 0; i < total; i++) {
      breakfast.push(createRow('riceC'));
    }
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
    for (let i = 0; i < total; i++) {
      lunch.push(createRow('meatHigh'));
    }
  }

  // --- Fat ---
  {
    const [b, l, s] = distribute(e.fat || 0, 3);
    for (let i = 0; i < b; i++) breakfast.push(createRow('fat'));
    for (let i = 0; i < l; i++) lunch.push(createRow('fat'));
    for (let i = 0; i < s; i++) supper.push(createRow('fat'));
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