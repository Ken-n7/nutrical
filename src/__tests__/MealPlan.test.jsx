import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import MealPlan from '../components/MealPlan';
import { GROUP_LABELS, MEAL_PERIODS } from '../data/mealPlanData';

const exchanges = {
  veg: 3, fruit: 3, milkWhole: 0, milk: 1, milkSkim: 0, sugar: 2,
  riceA: 0, riceB: 5, riceC: 0,
  meatLow: 0, meatMed: 3, meatHigh: 0, fat: 2,
};

function emptyValidation() {
  const groups = {};
  for (const key of Object.keys(GROUP_LABELS)) {
    groups[key] = { exchangeTotal: 0, mealTotal: 0, diff: 0, valid: true, over: false, under: false };
  }
  return { groups, allValid: true };
}

function emptyMealPlan() {
  const plan = {};
  for (const { key } of MEAL_PERIODS) plan[key] = [];
  return plan;
}

describe('MealPlan', () => {
  it('renders nothing when mealPlan is null', () => {
    const { container } = render(
      <MealPlan
        mealPlan={null}
        addMealRow={vi.fn()}
        exchanges={exchanges}
        mealPlanValidation={emptyValidation()}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when mealPlanValidation is null', () => {
    const { container } = render(
      <MealPlan
        mealPlan={emptyMealPlan()}
        addMealRow={vi.fn()}
        exchanges={exchanges}
        mealPlanValidation={null}
      />
    );
    expect(container.innerHTML).toBe('');
  });
});