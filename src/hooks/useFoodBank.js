import { useState, useEffect, useCallback } from 'react';
import { GROUP_KEYS, FOOD_NAME_MAX, FOOD_MEASURE_MAX } from '../data/mealPlanData';

// localStorage, unlike the patient session: saved foods are not patient data
// and should still be there next visit. Per browser; nothing is shared.
const BANK_KEY = 'nutrical-my-foods';

const clean = (food) => ({
  name: String(food?.name ?? '').trim().slice(0, FOOD_NAME_MAX),
  measure: String(food?.measure ?? '').trim().slice(0, FOOD_MEASURE_MAX),
});

const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();

// Storage can hold anything: keep only well-formed foods under known groups.
function loadBank() {
  const bank = Object.fromEntries(GROUP_KEYS.map((group) => [group, []]));
  try {
    const saved = JSON.parse(localStorage.getItem(BANK_KEY)) || {};
    for (const group of GROUP_KEYS) {
      if (!Array.isArray(saved[group])) continue;
      bank[group] = saved[group].map(clean).filter((food) => food.name && food.measure);
    }
  } catch {}
  return bank;
}

export function useFoodBank() {
  const [bank, setBank] = useState(loadBank);

  useEffect(() => {
    try {
      localStorage.setItem(BANK_KEY, JSON.stringify(bank));
    } catch {}
  }, [bank]);

  // Saving a name that is already there replaces its measure. Returns the food as stored.
  const saveFood = useCallback((group, food) => {
    const saved = clean(food);
    if (!GROUP_KEYS.includes(group) || !saved.name || !saved.measure) return null;
    setBank((prev) => ({
      ...prev,
      [group]: [...prev[group].filter((f) => !sameName(f.name, saved.name)), saved],
    }));
    return saved;
  }, []);

  const removeFood = useCallback((group, name) => {
    setBank((prev) => ({ ...prev, [group]: prev[group].filter((f) => f.name !== name) }));
  }, []);

  return { bank, saveFood, removeFood };
}
