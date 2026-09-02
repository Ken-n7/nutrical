import { useState, useCallback, useMemo, useRef } from 'react';
import { NEW_ROW_DEFAULTS, GROUP_KEYS, generateMealPlan } from '../data/mealPlanData';

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

const DEFAULTS = {
  veg: 3,
  fruit: 3,
  milk: 1,
  milkWhole: 0,
  milkSkim: 0,
  sugar: 2,
};

const roundN = (n) => {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
};
const snapExchange = (n) => Math.min(20, roundN(n));

const FACTOR_LABEL = {
  30: 'Lightly active',
  35: 'Moderately active',
  40: 'Active',
  45: 'Very active',
};

export const fmtInt = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');
export const fmt1 = (n) => fmtInt(n);
export const fmtValue = (n) => fmtInt(n);

function bmiOf(weightKg, heightCm) {
  const m = heightCm / 100;
  return m > 0 ? weightKg / (m * m) : 0;
}

function bmiClass(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-700' };
  if (bmi < 25)   return { label: 'Normal', color: 'bg-mint-100 text-mint-700' };
  if (bmi < 30)   return { label: 'Overweight', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Obese', color: 'bg-red-100 text-red-700' };
}

function dbwHamwi(sex, totalInches, frame) {
  const inchesFromFiveFeet = totalInches - 60;
  const base = sex === 'male' ? 106 : 100;
  const perInch = sex === 'male' ? 6 : 5;
  const baseAdjustedLbs = base + inchesFromFiveFeet * perInch;
  const frameAdjustedKg = Math.round((baseAdjustedLbs / 2.2) * frame);
  const direction = inchesFromFiveFeet >= 0 ? '+' : '−';
  const absInches = Math.abs(inchesFromFiveFeet);
  const formula = `${base} ${direction} (${absInches} × ${perInch}) lb ÷ 2.2${frame !== 1 ? ` × ${frame.toFixed(2)}` : ''}`;
  return { lbs: baseAdjustedLbs * frame, kg: frameAdjustedKg, formula };
}

function dbwClass(percent) {
  if (percent < 90)  return { label: `${Math.round(percent)}% of DBW · Underweight`, color: 'bg-blue-100 text-blue-700' };
  if (percent <= 110) return { label: `${Math.round(percent)}% of DBW · Normal`, color: 'bg-mint-100 text-mint-700' };
  if (percent <= 120) return { label: `${Math.round(percent)}% of DBW · Overweight`, color: 'bg-amber-100 text-amber-700' };
  return { label: `${Math.round(percent)}% of DBW · Obese`, color: 'bg-red-100 text-red-700' };
}

const initialPatient = {
  name: '',
  age: '25',
  sex: 'female',
  frame: 1,
  heightFt: '5',
  heightIn: '1',
  weight: '150',
  activity: 35,
  distribution: '65,15,20',
};

const initialExchanges = {
  veg: 0,
  fruit: 0,
  milkWhole: 0,
  milk: 0,
  milkSkim: 0,
  sugar: 0,
  riceA: 0,
  riceB: 0,
  riceC: 0,
  meatLow: 0,
  meatMed: 0,
  meatHigh: 0,
  fat: 0,
};

export function useNutriCal() {
  const [patient, setPatient] = useState(initialPatient);
  const [exchanges, setExchanges] = useState(initialExchanges);
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    amSnack: [],
    lunch: [],
    pmSnack: [],
    supper: [],
  });
  const [error, setError] = useState(null);

  const rowIdRef = useRef(1000);

  const updatePatient = useCallback((field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const updateExchange = useCallback((key, value) => {
    const num = parseFloat(value);
    const rounded = Number.isFinite(num) && num >= 0 ? Math.round(num) : 0;
    const capped = Math.min(rounded, 20);
    setExchanges((prev) => ({
      ...prev,
      [key]: capped,
    }));
  }, []);

  const addMealRow = useCallback((mealKey) => {
    setMealPlan((prev) => ({
      ...prev,
      [mealKey]: [
        ...(prev[mealKey] || []),
        { id: rowIdRef.current++, ...NEW_ROW_DEFAULTS },
      ],
    }));
  }, []);

  const removeMealRow = useCallback((mealKey, rowId) => {
    setMealPlan((prev) => ({
      ...prev,
      [mealKey]: (prev[mealKey] || []).filter((r) => r.id !== rowId),
    }));
  }, []);

  const moveMealRow = useCallback((mealKey, sourceId, targetId, side = 'bottom') => {
    setMealPlan((prev) => {
      const rows = [...(prev[mealKey] || [])];
      const srcIdx = rows.findIndex((r) => r.id === sourceId);
      const tgtIdx = rows.findIndex((r) => r.id === targetId);
      if (srcIdx < 0 || tgtIdx < 0 || srcIdx === tgtIdx) return prev;

      const [moved] = rows.splice(srcIdx, 1);
      const insertAt = side === 'top' ? tgtIdx : tgtIdx + (srcIdx < tgtIdx ? 0 : 1);
      rows.splice(insertAt, 0, moved);

      return { ...prev, [mealKey]: rows };
    });
  }, []);

  const updateMealRow = useCallback((mealKey, rowId, field, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [mealKey]: (prev[mealKey] || []).map((r) => {
        if (r.id !== rowId) return r;

        if (field === 'group') {
          return { ...r, group: value, foodIndex: 0, measureIndex: 0 };
        }
        if (field === 'n') {
          const num = parseFloat(value);
          const rounded = Number.isFinite(num) && num >= 0 ? Math.round(num) : 0;
          const capped = Math.min(rounded, 20);
          return { ...r, n: capped };
        }
        return { ...r, [field]: parseInt(value, 10) };
      }),
    }));
  }, []);

  const generatePlan = useCallback(() => {
    setMealPlan(generateMealPlan(exchanges));
  }, [exchanges]);

  const assessment = useMemo(() => {
    const { age, sex, frame, heightFt, heightIn, weight, activity, distribution } = patient;

    const totalInches = (parseInt(heightFt, 10) || 0) * 12 + (parseInt(heightIn, 10) || 0);
    const htCm = totalInches * 2.54;
    const wtLbs = parseFloat(weight) || 0;
    const af = parseFloat(activity) || 35;
    const frameNum = parseFloat(frame) || 1;
    const dist = (distribution || '65,15,20').split(',').map(Number);

    if (![parseFloat(age), totalInches, wtLbs, frameNum, af].every(Number.isFinite)) {
      return null;
    }

    const weightKg = wtLbs / 2.205;
    const bmi = bmiOf(weightKg, htCm);
    const bmiInfo = bmiClass(bmi);

    const dbw = dbwHamwi(sex, totalInches, frameNum);
    const dbwPercent = dbw.kg > 0 ? (weightKg / dbw.kg) * 100 : 0;
    const dbwInfo = dbwClass(dbwPercent);

    // Simple method: DBW × Activity Factor
    const terRaw = dbw.kg * af;
    const ter = Math.round(terRaw / 10) * 10;

    const [choPct, proteinPct, fatPct] = dist;
    const targetCho = Math.round((ter * choPct) / 100 / 4);
    const targetProtein = Math.round((ter * proteinPct) / 100 / 4);
    const targetFat = Math.round((ter * fatPct) / 100 / 9);

    return {
      bmi,
      bmiInfo,
      dbw,
      dbwPercent,
      dbwInfo,
      af,
      afLabel: FACTOR_LABEL[String(af)] || 'Custom',
      ter,
      terRaw,
      dist,
      targetCho,
      targetProtein,
      targetFat,
    };
  }, [patient]);

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

  const exchangeData = useMemo(() => {
    if (!assessment) return null;

    const groups = {
      veg: EX.veg,
      fruit: EX.fruit,
      milkWhole: EX.milkWhole,
      milk: EX.milk,
      milkSkim: EX.milkSkim,
      sugar: EX.sugar,
      riceA: EX.riceA,
      riceB: EX.riceB,
      riceC: EX.riceC,
      meatLow: EX.meatLow,
      meatMed: EX.meatMed,
      meatHigh: EX.meatHigh,
      fat: EX.fatEx,
    };

    const rows = Object.entries(groups).map(([key, ex]) => ({
      key,
      count: exchanges[key] || 0,
      cho: (exchanges[key] || 0) * ex.cho,
      protein: (exchanges[key] || 0) * ex.protein,
      fat: (exchanges[key] || 0) * ex.fat,
      kcal: (exchanges[key] || 0) * ex.kcal,
    }));

    const riceKeys = ['riceA', 'riceB', 'riceC'];
    const meatKeys = ['meatLow', 'meatMed', 'meatHigh'];
    const basicKeys = ['veg', 'fruit', 'milkWhole', 'milk', 'milkSkim', 'sugar'];

    const sumGroup = (keys, field) =>
      keys.reduce((sum, key) => sum + (exchanges[key] || 0) * groups[key][field], 0);

    // Rice
    const riceN = riceKeys.reduce((sum, key) => sum + (exchanges[key] || 0), 0);
    const riceCho = sumGroup(riceKeys, 'cho');
    const riceProtein = sumGroup(riceKeys, 'protein');
    const riceFat = sumGroup(riceKeys, 'fat');
    const riceKcal = sumGroup(riceKeys, 'kcal');

    // Meat
    const meatN = meatKeys.reduce((s, k) => s + (exchanges[k] || 0), 0);
    const meatProtein = sumGroup(meatKeys, 'protein');
    const meatFat = sumGroup(meatKeys, 'fat');
    const meatKcal = sumGroup(meatKeys, 'kcal');

    // Basic (CHO sources before rice)
    const basicCho = sumGroup(basicKeys, 'cho');
    const basicProtein = sumGroup(basicKeys, 'protein');
    const basicFat = sumGroup(basicKeys, 'fat');

    // Totals
    const totalCho = basicCho + riceCho;
    const totalProtein = basicProtein + riceProtein + meatProtein;
    const totalFat = basicFat + riceFat + meatFat + (exchanges.fat || 0) * EX.fatEx.fat;
    const totalKcal = Object.entries(groups).reduce(
      (sum, [key, ex]) => sum + (exchanges[key] || 0) * ex.kcal,
      0
    );
    const totalN = Object.values(exchanges).reduce((a, b) => a + b, 0);

    const { targetCho, targetProtein, targetFat, ter } = assessment;

    const choDiff = totalCho - targetCho;
    const proteinDiff = totalProtein - targetProtein;
    const fatDiff = totalFat - targetFat;
    const kcalDiff = totalKcal - ter;

    const within =
      Math.abs(choDiff) <= 5 &&
      Math.abs(proteinDiff) <= 5 &&
      Math.abs(fatDiff) <= 5 &&
      Math.abs(kcalDiff) <= 50;

    return {
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
    };
  }, [exchanges, assessment]);

  const mealPlanValidation = useMemo(() => {
    const counts = {};
    for (const g of GROUP_KEYS) counts[g] = 0;

    for (const mealKey of Object.keys(mealPlan)) {
      for (const item of mealPlan[mealKey] || []) {
        counts[item.group] = (counts[item.group] || 0) + (item.n || 0);
      }
    }

    const result = {};
    let allValid = true;

    for (const group of GROUP_KEYS) {
      const exchangeTotal = exchanges[group] || 0;
      const mealTotal = counts[group] || 0;
      const diff = exchangeTotal - mealTotal;
      const over = mealTotal > exchangeTotal;
      const under = mealTotal < exchangeTotal && exchangeTotal > 0;
      const valid = Math.abs(diff) < 0.001;

      if (over) allValid = false;

      result[group] = { exchangeTotal, mealTotal, diff, valid, over, under };
    }

    return { groups: result, allValid };
  }, [exchanges, mealPlan]);

  return {
    patient,
    updatePatient,
    exchanges,
    updateExchange,
    mealPlan,
    addMealRow,
    removeMealRow,
    updateMealRow,
    moveMealRow,
    generatePlan,
    suggestExchanges,
    mealPlanValidation,
    assessment,
    exchangeData,
    error,
    setError,
  };
}