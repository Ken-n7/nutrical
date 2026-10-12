import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import MealPlanPrint from '../components/MealPlanPrint';
import { MEAL_PERIODS } from '../data/mealPlanData';

function filledMealPlan() {
  return {
    breakfast: [
      { id: 1, group: 'veg', name: 'Malunggay (Horseradish tree, leaves)', measure: '1 cup', n: 2 },
      { id: 2, group: 'riceB', name: 'Boiled rice', measure: '½ cup', n: 1 },
    ],
    amSnack: [],
    lunch: [{ id: 3, group: 'meatMed', name: 'Chicken leg', measure: '1 pc', n: 1.5 }],
    pmSnack: [
      { id: 4, group: 'fruit', name: 'Pakwan (Watermelon)', measure: '1 cup', n: 0.5 },
      { id: 5, group: 'fat', name: '', measure: '', n: 1, custom: true },
    ],
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
    // each row prints its own name and measure, with the exchange count in front
    expect(screen.getByText('Malunggay (Horseradish tree, leaves)')).toBeInTheDocument();
    expect(screen.getByText('2 × 1 cup')).toBeInTheDocument();
    expect(screen.getByText('Boiled rice')).toBeInTheDocument();
    expect(screen.getByText('½ cup')).toBeInTheDocument();
    expect(screen.getByText('1½ × 1 pc')).toBeInTheDocument();
    expect(screen.getByText('½ × 1 cup')).toBeInTheDocument();
    // a typed row with no name yet is left out
    expect(screen.getByRole('rowheader', { name: 'PM Snack' })).toHaveAttribute('rowspan', '1');
  });

  it('renders placeholder cells for meals with no items', () => {
    renderPrint();
    const amSnack = screen.getByRole('rowheader', { name: 'AM Snack' });
    const row = amSnack.closest('tr');
    expect(within(row).getAllByText('—')).toHaveLength(2);
  });
});