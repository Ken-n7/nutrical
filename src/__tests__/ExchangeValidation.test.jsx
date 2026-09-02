import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { useNutriCal } from '../hooks/useNutriCal';
import ExchangeTable from '../components/ExchangeTable';

const defaultAssessment = {
  bmi: 28.3, ter: 1670, dist: [65, 15, 20],
  targetCho: 271.4, targetProtein: 62.6, targetFat: 37.1,
};

const defaultExchangeData = {
  rows: [
    { key: 'veg', count: 3, cho: 9, protein: 3, fat: 0, kcal: 48 },
    { key: 'fruit', count: 5, cho: 50, protein: 0, fat: 0, kcal: 200 },
    { key: 'milkWhole', count: 0, cho: 0, protein: 0, fat: 0, kcal: 0 },
    { key: 'milk', count: 1, cho: 12, protein: 8, fat: 5, kcal: 125 },
    { key: 'milkSkim', count: 0, cho: 0, protein: 0, fat: 0, kcal: 0 },
    { key: 'sugar', count: 3, cho: 15, protein: 0, fat: 0, kcal: 60 },
    { key: 'riceA', count: 1, cho: 23, protein: 0, fat: 0, kcal: 92 },
    { key: 'riceB', count: 5, cho: 115, protein: 10, fat: 0, kcal: 500 },
    { key: 'riceC', count: 1, cho: 23, protein: 4, fat: 0, kcal: 108 },
    { key: 'meatLow', count: 2, cho: 0, protein: 16, fat: 2, kcal: 82 },
    { key: 'meatMed', count: 2, cho: 0, protein: 16, fat: 12, kcal: 172 },
    { key: 'meatHigh', count: 0, cho: 0, protein: 0, fat: 0, kcal: 0 },
    { key: 'fat', count: 2, cho: 0, protein: 0, fat: 10, kcal: 90 },
  ],
  riceN: 7, riceCho: 161, riceProtein: 14, riceFat: 0, riceKcal: 700,
  meatN: 4, meatProtein: 32, meatFat: 14, meatKcal: 254,
  basicCho: 86, basicProtein: 11, basicFat: 5,
  totalCho: 247, totalProtein: 57, totalFat: 29, totalKcal: 1529, totalN: 25,
  choDiff: -24.4, proteinDiff: -5.6, fatDiff: -8.1, kcalDiff: -141, within: false,
};

describe('Exchange max limit', () => {
  it('caps exchange value at 20 via hook', () => {
    const { result } = renderHook(() => useNutriCal());
    act(() => {
      result.current.updateExchange('veg', '25');
    });
    expect(result.current.exchanges.veg).toBe(20);
  });

  it('allows exchange value of 20', () => {
    const { result } = renderHook(() => useNutriCal());
    act(() => {
      result.current.updateExchange('veg', '20');
    });
    expect(result.current.exchanges.veg).toBe(20);
  });

  it('clamps negative to 0', () => {
    const { result } = renderHook(() => useNutriCal());
    act(() => {
      result.current.updateExchange('veg', '-5');
    });
    expect(result.current.exchanges.veg).toBe(0);
  });

  it('clamps non-numeric to 0', () => {
    const { result } = renderHook(() => useNutriCal());
    act(() => {
      result.current.updateExchange('veg', 'abc');
    });
    expect(result.current.exchanges.veg).toBe(0);
  });
});

describe('ExchangeInput max attribute', () => {
  it('sets max attribute on exchange inputs', () => {
    render(
      <table><tbody>
        <ExchangeTable
          exchanges={{ veg: 3, fruit: 5, milkWhole: 0, milk: 1, milkSkim: 0, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2 }}
          updateExchange={vi.fn()}
          exchangeData={defaultExchangeData}
          assessment={defaultAssessment}
        />
      </tbody></table>
    );
    const vegInput = screen.getByLabelText('Vegetable exchanges');
    expect(vegInput).toHaveAttribute('max', '20');
  });
});

describe('Exchange table render', () => {
  it('renders the exchange table with comparison moved to sidebar', () => {
    render(
      <ExchangeTable
        exchanges={{ veg: 3, fruit: 5, milkWhole: 0, milk: 1, milkSkim: 0, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2 }}
        updateExchange={vi.fn()}
        exchangeData={defaultExchangeData}
        assessment={defaultAssessment}
      />
    );
    expect(screen.getByText('Food Group')).toBeInTheDocument();
    expect(screen.queryByText('Review needed')).not.toBeInTheDocument();
    expect(screen.queryByText('Within tolerance')).not.toBeInTheDocument();
  });
});
