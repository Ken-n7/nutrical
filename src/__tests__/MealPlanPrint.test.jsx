import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import MealPlanPrint from '../components/MealPlanPrint';
import { FOOD_ITEMS, MEAL_PERIODS } from '../data/mealPlanData';

function filledMealPlan() {
  return {
    breakfast: [
      { id: 1, group: 'veg', foodIndex: 0, n: 2 },
      { id: 2, group: 'riceB', foodIndex: 0, n: 1 },
    ],
    amSnack: [],
    lunch: [{ id: 3, group: 'meatMed', foodIndex: 0, n: 1 }],
    pmSnack: [{ id: 4, group: 'fruit', foodIndex: 0, n: 1 }],
    supper: [],
  };
}

function renderPrint(overrides = {}) {
  const props = {
    mealPlan: filledMealPlan(),
    patient: { name: 'Juan Dela Cruz' },
    ...overrides,
  };
  return render(<MealPlanPrint {...props} />);
}

describe('MealPlanPrint', () => {
  it('renders nothing when mealPlan is null', () => {
    const { container } = render(<MealPlanPrint mealPlan={null} patient={{ name: 'J' }} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the off-screen capture block styled by .meal-plan-print', () => {
    const { container } = renderPrint();
    const root = container.querySelector('.meal-plan-print');
    expect(root).not.toBeNull();
    expect(root.querySelector('table')).not.toBeNull();
  });

  it('shows the patient name in the header', () => {
    renderPrint();
    expect(screen.getByText(/Juan Dela Cruz/)).toBeInTheDocument();
  });

  it('falls back to an em dash when the patient has no name', () => {
    renderPrint({ patient: { name: '   ' } });
    expect(screen.getByText(/Patient: —/)).toBeInTheDocument();
  });

  it('includes a date in the header', () => {
    renderPrint();
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
  });

  it('renders all five meal labels as row headers', () => {
    renderPrint();
    for (const { label } of MEAL_PERIODS) {
      expect(screen.getByRole('rowheader', { name: label })).toBeInTheDocument();
    }
  });

  it('merges the meal cell with a rowspan across its items', () => {
    renderPrint();
    const breakfast = screen.getByRole('rowheader', { name: 'Breakfast' });
    expect(breakfast).toHaveAttribute('rowspan', '2');
    const lunch = screen.getByRole('rowheader', { name: 'Lunch' });
    expect(lunch).toHaveAttribute('rowspan', '1');
  });

  it('resolves sample menu and household measure from the data', () => {
    renderPrint();
    const malunggay = FOOD_ITEMS.veg[0];
    const rice = FOOD_ITEMS.riceB[0];
    expect(screen.getByText(malunggay.name)).toBeInTheDocument();
    expect(screen.getAllByText(malunggay.measure)).toHaveLength(2);
    expect(screen.getByText(rice.name)).toBeInTheDocument();
    expect(screen.getAllByText(rice.measure)).toHaveLength(2);
  });

  it('renders placeholder cells for meals with no items', () => {
    renderPrint();
    const amSnack = screen.getByRole('rowheader', { name: 'AM Snack' });
    const row = amSnack.closest('tr');
    expect(within(row).getAllByText('—')).toHaveLength(2);
  });
});