import { useState, useCallback, useMemo } from 'react';

const EX = {
  veg:      { cho: 3,  chon: 1, fat: 0,  kcal: 16 },
  fruit:    { cho: 10, chon: 0, fat: 0,  kcal: 40 },
  milk:     { cho: 12, chon: 8, fat: 5,  kcal: 125 },
  riceA:    { cho: 23, chon: 0, fat: 0,  kcal: 92 },
  riceB:    { cho: 23, chon: 2, fat: 0,  kcal: 100 },
  riceC:    { cho: 23, chon: 4, fat: 0,  kcal: 108 },
  meatLow:  { cho: 0,  chon: 8, fat: 1,  kcal: 41 },
  meatMed:  { cho: 0,  chon: 8, fat: 6,  kcal: 86 },
  meatHigh: { cho: 0,  chon: 8, fat: 10, kcal: 122 },
  fatEx:    { cho: 0,  chon: 0, fat: 5,  kcal: 45 },
  sugar:    { cho: 5,  chon: 0, fat: 0,  kcal: 20 },
};

const FACTOR_LABEL = { 30: 'Lightly active', 35: 'Moderately active', 40: 'Active', 45: 'Very active' };

export const fmtInt = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');
export const fmt1 = (n) =>
  (Math.round((Number(n) || 0) * 10) / 10).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
export const fmtValue = (n) => (Number.isInteger(Number(n)) ? fmtInt(n) : fmt1(n));

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
  const frameAdjustedKg = (baseAdjustedLbs / 2.2) * frame;
  const direction = inchesFromFiveFeet >= 0 ? '+' : '\u2212';
  const absInches = Math.abs(inchesFromFiveFeet);
  const formula = `${base} ${direction} (${absInches} \u00d7 ${perInch}) lb \u00f7 2.2${frame !== 1 ? ` \u00d7 ${frame.toFixed(2)}` : ''}`;
  return { lbs: baseAdjustedLbs * frame, kg: frameAdjustedKg, formula };
}

function dbwClass(percent) {
  if (percent < 90)  return { label: `${Math.round(percent)}% of DBW \u00b7 Underweight`, color: 'bg-blue-100 text-blue-700' };
  if (percent <= 110) return { label: `${Math.round(percent)}% of DBW \u00b7 Normal`, color: 'bg-mint-100 text-mint-700' };
  if (percent <= 120) return { label: `${Math.round(percent)}% of DBW \u00b7 Overweight`, color: 'bg-amber-100 text-amber-700' };
  return { label: `${Math.round(percent)}% of DBW \u00b7 Obese`, color: 'bg-red-100 text-red-700' };
}

const initialPatient = {
  name: 'Maria Dela Cruz',
  age: 45,
  sex: 'female',
  frame: 1,
  heightFt: 5,
  heightIn: 1,
  weight: 150,
  activity: 35,
  distribution: '65,15,20',
};

const initialExchanges = {
  veg: 3, fruit: 5, milk: 1, sugar: 3,
  riceA: 1, riceB: 5, riceC: 1,
  meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2,
};

export function useNutriCal() {
  const [patient, setPatient] = useState(initialPatient);
  const [exchanges, setExchanges] = useState(initialExchanges);
  const [error, setError] = useState(null);

  const updatePatient = useCallback((field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const updateExchange = useCallback((key, value) => {
    const num = parseFloat(value);
    setExchanges((prev) => ({
      ...prev,
      [key]: Number.isFinite(num) && num >= 0 ? num : 0,
    }));
  }, []);

  const assessment = useMemo(() => {
    const { age, sex, frame, heightFt, heightIn, weight, activity, distribution } = patient;
    const totalInches = (parseInt(heightFt, 10) || 0) * 12 + (parseInt(heightIn, 10) || 0);
    const htCm = totalInches * 2.54;
    const wtLbs = parseFloat(weight) || 0;
    const af = parseFloat(activity) || 35;
    const dist = (distribution || '65,15,20').split(',').map(Number);

    if (![parseFloat(age), totalInches, wtLbs, frame, af].every(Number.isFinite)) {
      return null;
    }

    const weightKg = wtLbs / 2.205;
    const bmi = bmiOf(weightKg, htCm);
    const bmiInfo = bmiClass(bmi);

    const dbw = dbwHamwi(sex, totalInches, frame);
    const dbwPercent = dbw.kg > 0 ? (weightKg / dbw.kg) * 100 : 0;
    const dbwInfo = dbwClass(dbwPercent);

    const terRaw = dbw.kg * af;
    const ter = Math.round(terRaw / 10) * 10;

    const [choPct, chonPct, fatPct] = dist;
    const targetCho = (ter * choPct) / 100 / 4;
    const targetChon = (ter * chonPct) / 100 / 4;
    const targetFat = (ter * fatPct) / 100 / 9;

    return {
      bmi, bmiInfo, dbw, dbwPercent, dbwInfo,
      af, afLabel: FACTOR_LABEL[String(af)],
      ter, terRaw,
      dist, targetCho, targetChon, targetFat,
    };
  }, [patient]);

  const exchangeData = useMemo(() => {
    if (!assessment) return null;

    const groups = {
      veg: EX.veg, fruit: EX.fruit, milk: EX.milk, sugar: EX.sugar,
      riceA: EX.riceA, riceB: EX.riceB, riceC: EX.riceC,
      meatLow: EX.meatLow, meatMed: EX.meatMed, meatHigh: EX.meatHigh,
      fat: EX.fatEx,
    };

    const rows = Object.entries(groups).map(([key, ex]) => ({
      key,
      count: exchanges[key] || 0,
      cho: (exchanges[key] || 0) * ex.cho,
      chon: (exchanges[key] || 0) * ex.chon,
      fat: (exchanges[key] || 0) * ex.fat,
      kcal: (exchanges[key] || 0) * ex.kcal,
    }));

    const riceKeys = ['riceA', 'riceB', 'riceC'];
    const meatKeys = ['meatLow', 'meatMed', 'meatHigh'];

    const sumGroup = (keys, field) =>
      keys.reduce((sum, key) => sum + (exchanges[key] || 0) * groups[key][field], 0);

    const riceN = riceKeys.reduce((sum, key) => sum + (exchanges[key] || 0), 0);
    const riceCho = sumGroup(riceKeys, 'cho');
    const riceChon = sumGroup(riceKeys, 'chon');
    const riceFat = sumGroup(riceKeys, 'fat');
    const riceKcal = sumGroup(riceKeys, 'kcal');

    const meatN = meatKeys.reduce((s, k) => s + (exchanges[k] || 0), 0);
    const meatChon = sumGroup(meatKeys, 'chon');
    const meatFat = sumGroup(meatKeys, 'fat');
    const meatKcal = sumGroup(meatKeys, 'kcal');

    const basicKeys = ['veg', 'fruit', 'milk', 'sugar'];
    const basicCho = sumGroup(basicKeys, 'cho');
    const basicChon = sumGroup(basicKeys, 'chon');
    const basicFat = sumGroup(basicKeys, 'fat');

    const totalCho = basicCho + riceCho;
    const totalChon = basicChon + riceChon + meatChon;
    const totalFat = basicFat + riceFat + meatFat + (exchanges.fat || 0) * EX.fatEx.fat;
    const totalKcal = Object.entries(groups).reduce(
      (sum, [key, ex]) => sum + (exchanges[key] || 0) * ex.kcal, 0
    );
    const totalN = Object.values(exchanges).reduce((a, b) => a + b, 0);

    const { targetCho, targetChon, targetFat, ter } = assessment;
    const choDiff = totalCho - targetCho;
    const chonDiff = totalChon - targetChon;
    const fatDiff = totalFat - targetFat;
    const kcalDiff = totalKcal - ter;

    const within = Math.abs(choDiff) <= 5 && Math.abs(chonDiff) <= 5 && Math.abs(fatDiff) <= 5 && Math.abs(kcalDiff) <= 50;

    return {
      rows, riceN, riceCho, riceChon, riceFat, riceKcal,
      meatN, meatChon, meatFat, meatKcal,
      basicCho, basicChon, basicFat,
      totalCho, totalChon, totalFat, totalKcal, totalN,
      choDiff, chonDiff, fatDiff, kcalDiff, within,
    };
  }, [exchanges, assessment]);

  return {
    patient, updatePatient,
    exchanges, updateExchange,
    assessment, exchangeData, error, setError,
  };
}
