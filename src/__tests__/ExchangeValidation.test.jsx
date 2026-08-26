import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNutriCal } from '../hooks/useNutriCal';
import ExchangeTable from '../components/ExchangeTable';

const defaultAssessment = {
  bmi: 28.3, ter: 1670, dist: [65, 15, 20],
  targetCho: 271.4, targetChon: 62.6, targetFat: 37.1,
};

const defaultExchangeData = {
  rows: [
    { key: 'veg', count: 3, cho: 9, chon: 3, fat: 0, kcal: 48 },
    { key: 'fruit', count: 5, cho: 50, chon: 0, fat: 0, kcal: 200 },
    { key: 'milk', count: 1, cho: 12, chon: 8, fat: 5, kcal: 125 },
    { key: 'sugar', count: 3, cho: 15, chon: 0, fat: 0, kcal: 60 },
    { key: 'riceA', count: 1, cho: 23, chon: 0, fat: 0, kcal: 92 },
    { key: 'riceB', count: 5, cho: 115, chon: 10, fat: 0, kcal: 500 },
    { key: 'riceC', count: 1, cho: 23, chon: 4, fat: 0, kcal: 108 },
    { key: 'meatLow', count: 2, cho: 0, chon: 16, fat: 2, kcal: 82 },
    { key: 'meatMed', count: 2, cho: 0, chon: 16, fat: 12, kcal: 172 },
    { key: 'meatHigh', count: 0, cho: 0, chon: 0, fat: 0, kcal: 0 },
    { key: 'fat', count: 2, cho: 0, chon: 0, fat: 10, kcal: 90 },
  ],
  riceN: 7, riceCho: 161, riceChon: 14, riceFat: 0, riceKcal: 700,
  meatN: 4, meatChon: 32, meatFat: 14, meatKcal: 254,
  basicCho: 86, basicChon: 11, basicFat: 5,
  totalCho: 247, totalChon: 57, totalFat: 29, totalKcal: 1529, totalN: 25,
  choDiff: -24.4, chonDiff: -5.6, fatDiff: -8.1, kcalDiff: -141, within: false,
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
          exchanges={{ veg: 3, fruit: 5, milk: 1, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2 }}
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

describe('Error display', () => {
  it('shows error alert when error prop is set', () => {
    render(
      <ExchangeTable
        exchanges={{ veg: 3, fruit: 5, milk: 1, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2 }}
        updateExchange={vi.fn()}
        exchangeData={defaultExchangeData}
        assessment={defaultAssessment}
      />
    );
    expect(screen.getByText('Review needed')).toBeInTheDocument();
  });

  it('shows Within tolerance badge when within range', () => {
    const withinData = { ...defaultExchangeData, within: true };
    render(
      <ExchangeTable
        exchanges={{ veg: 3, fruit: 5, milk: 1, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2 }}
        updateExchange={vi.fn()}
        exchangeData={withinData}
        assessment={defaultAssessment}
      />
    );
    expect(screen.getByText('Within tolerance')).toBeInTheDocument();
  });
});
