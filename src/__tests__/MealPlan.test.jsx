import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MealPlan from '../components/MealPlan';
import MealPlanPrint from '../components/MealPlanPrint';
import { useNutriCal } from '../hooks/useNutriCal';
import { useFoodBank } from '../hooks/useFoodBank';
import { GROUP_LABELS, MEAL_PERIODS } from '../data/mealPlanData';

function Harness() {
  const cal = useNutriCal();
  const { bank, saveFood, removeFood } = useFoodBank();
  return (
    <>
      <MealPlan {...cal} foodBank={bank} saveFood={saveFood} removeFood={removeFood} />
      <MealPlanPrint mealPlan={cal.mealPlan} patient={cal.patient} />
    </>
  );
}

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

  it('lets a typed food be used, saved, reused and removed', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const print = within(container.querySelector('.meal-plan-print'));

    await user.click(screen.getAllByRole('button', { name: '+ Add' })[0]);
    await user.selectOptions(screen.getByLabelText('Food item'), 'other');
    await user.type(screen.getByLabelText('Food name'), 'Champorado');
    expect(screen.queryByRole('button', { name: 'Save to my foods' })).toBeNull();
    await user.type(screen.getByLabelText('Household measure'), '1 cup');
    expect(print.getByText('Champorado')).toBeInTheDocument();
    expect(print.getByText('1 cup')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save to my foods' }));
    expect(screen.queryByLabelText('Food name')).toBeNull();
    expect(screen.getByLabelText('Food item')).toHaveDisplayValue('Champorado');
    expect(JSON.parse(localStorage.getItem('nutrical-my-foods')).veg).toEqual([{ name: 'Champorado', measure: '1 cup' }]);

    // a second row can pick it from "My foods"
    await user.click(screen.getAllByRole('button', { name: '+ Add' })[0]);
    await user.selectOptions(screen.getAllByLabelText('Food item')[1], 'Champorado');
    expect(print.getAllByText('Champorado')).toHaveLength(2);

    // removing it from the bank leaves rows that use it intact, as typed foods
    await user.click(screen.getByText(/^My foods/));
    await user.click(screen.getByRole('button', { name: 'Remove Champorado from my foods' }));
    expect(screen.getAllByLabelText('Food name')[0]).toHaveValue('Champorado');
    expect(print.getAllByText('Champorado')).toHaveLength(2);
  });

  it('does not offer to save a typed food that is already in the book list', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getAllByRole('button', { name: '+ Add' })[0]);
    const listed = screen.getByLabelText('Food item').options[0].textContent;
    await user.selectOptions(screen.getByLabelText('Food item'), 'other');
    await user.type(screen.getByLabelText('Food name'), listed.toUpperCase());
    await user.type(screen.getByLabelText('Household measure'), '2 cups');
    expect(screen.queryByRole('button', { name: 'Save to my foods' })).toBeNull();
  });

  it('takes half exchanges as typed and snaps them when the box is left', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const print = container.querySelector('.meal-plan-print tbody');
    await user.click(screen.getAllByRole('button', { name: '+ Add' })[0]);
    const count = screen.getByLabelText('Exchange count');
    const typeCount = async (text) => {
      await user.clear(count);
      if (text) await user.type(count, text);
      await user.tab();
      return Number(count.value);
    };

    expect(await typeCount('1.5')).toBe(1.5);
    expect(print.textContent).toContain('1½ × ');
    expect(await typeCount('.5')).toBe(0.5);
    expect(await typeCount('1.25')).toBe(1.5);
    expect(await typeCount('2.2')).toBe(2);
    expect(await typeCount('')).toBe(1);
  });
});

