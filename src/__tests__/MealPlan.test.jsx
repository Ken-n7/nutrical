import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

function filledValidation() {
  const groups = {};
  for (const key of Object.keys(GROUP_LABELS)) {
    groups[key] = { exchangeTotal: exchanges[key] || 0, mealTotal: 0, diff: (exchanges[key] || 0), valid: false, over: false, under: true };
  }
  return { groups, allValid: true };
}

function emptyMealPlan() {
  const plan = {};
  for (const { key } of MEAL_PERIODS) plan[key] = [];
  return plan;
}

function filledMealPlan() {
  return {
    breakfast: [{ id: 1, group: 'veg', foodIndex: 0, n: 2 }],
    amSnack: [],
    lunch: [{ id: 2, group: 'meatMed', foodIndex: 0, n: 1 }],
    pmSnack: [],
    supper: [{ id: 3, group: 'riceB', foodIndex: 0, n: 3 }],
  };
}

function renderMealPlan(overrides = {}) {
  const clearMealPlan = vi.fn();
  const defaultProps = {
    mealPlan: filledMealPlan(),
    addMealRow: vi.fn(),
    removeMealRow: vi.fn(),
    updateMealRow: vi.fn(),
    moveMealRow: vi.fn(),
    generatePlan: vi.fn(),
    clearMealPlan,
    exchanges,
    mealPlanValidation: filledValidation(),
    ...overrides,
  };
  return {
    ...render(<MealPlan {...defaultProps} />),
    clearMealPlan,
  };
}

describe('MealPlan', () => {
  it('renders nothing when mealPlan is null', () => {
    const { container } = render(
      <MealPlan
        mealPlan={null}
        addMealRow={vi.fn()}
        clearMealPlan={vi.fn()}
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
        clearMealPlan={vi.fn()}
        exchanges={exchanges}
        mealPlanValidation={null}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('hides the clear button when the plan is empty', () => {
    renderMealPlan({ mealPlan: emptyMealPlan(), mealPlanValidation: emptyValidation() });
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  describe('clear all meals', () => {
    it('renders a clear all button when the plan has rows', () => {
      renderMealPlan();
      expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
    });

    it('opens a confirmation modal before clearing', async () => {
      const user = userEvent.setup();
      const { clearMealPlan } = renderMealPlan();
      await user.click(screen.getByRole('button', { name: 'Clear all' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Clear all meals?')).toBeInTheDocument();
      expect(clearMealPlan).not.toHaveBeenCalled();
    });

    it('does not clear when cancelled', async () => {
      const user = userEvent.setup();
      const { clearMealPlan } = renderMealPlan();
      await user.click(screen.getByRole('button', { name: 'Clear all' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitForElementToBeRemoved(screen.getByRole('dialog'));
      expect(clearMealPlan).not.toHaveBeenCalled();
    });

    it('clears all meals after confirming', async () => {
      const user = userEvent.setup();
      const { clearMealPlan } = renderMealPlan();
      await user.click(screen.getByRole('button', { name: 'Clear all' }));
      const dialog = screen.getByRole('dialog');
      await user.click(within(dialog).getByRole('button', { name: 'Clear all' }));
      expect(clearMealPlan).toHaveBeenCalledTimes(1);
      await waitForElementToBeRemoved(screen.getByRole('dialog'));
    });
  });
});