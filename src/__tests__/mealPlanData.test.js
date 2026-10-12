import { describe, it, expect } from 'vitest';
import {
  FOOD_ITEMS,
  GROUP_KEYS,
  DEFAULT_FOOD,
  foodLabel,
  defaultFood,
  fmtExchanges,
  generateMealPlan,
} from '../data/mealPlanData';

describe('food lists', () => {
  it('give every group at least one food, each with a name and a measure', () => {
    for (const group of GROUP_KEYS) {
      expect(FOOD_ITEMS[group].length, group).toBeGreaterThan(0);
      for (const food of FOOD_ITEMS[group]) {
        expect(food.name, `${group} name`).toBeTruthy();
        expect(food.measure, `${group} / ${food.name}`).toBeTruthy();
      }
    }
  });

  it('never repeat a food within a group', () => {
    for (const group of GROUP_KEYS) {
      const labels = FOOD_ITEMS[group].map(foodLabel);
      expect(new Set(labels).size, group).toBe(labels.length);
    }
  });

  it('point every default at a food that is actually listed', () => {
    for (const [group, name] of Object.entries(DEFAULT_FOOD)) {
      expect(FOOD_ITEMS[group].map((f) => f.name), group).toContain(name);
    }
    for (const group of GROUP_KEYS) {
      expect(FOOD_ITEMS[group].map(foodLabel)).toContain(defaultFood(group).name);
    }
  });

  it('label foods as Filipino (English), or one name when they match', () => {
    expect(foodLabel({ filipino: 'Gabi', name: 'Taro' })).toBe('Gabi (Taro)');
    expect(foodLabel({ filipino: 'Cornstarch', name: 'Cornstarch' })).toBe('Cornstarch');
    expect(foodLabel({ name: 'Honey' })).toBe('Honey');
    expect(foodLabel({ filipino: 'Asukal (pula, puti)', name: 'Sugar (brown, white)' })).toBe(
      'Asukal (pula, puti) – Sugar (brown, white)'
    );
  });
});

describe('fmtExchanges', () => {
  it('writes halves as fractions', () => {
    expect([0.5, 1, 1.5, 2, 2.5].map(fmtExchanges)).toEqual(['½', '1', '1½', '2', '2½']);
  });
});

describe('generateMealPlan', () => {
  it('gives every row its own food name and measure', () => {
    const plan = generateMealPlan({ veg: 3, fruit: 3, milk: 1, sugar: 3, riceA: 2, riceB: 6, meatMed: 4, fat: 2 });
    const rows = Object.values(plan).flat();
    expect(rows).toHaveLength(24);
    for (const row of rows) {
      expect(row.name).toBe(defaultFood(row.group).name);
      expect(row.measure).toBe(defaultFood(row.group).measure);
    }
  });
});
