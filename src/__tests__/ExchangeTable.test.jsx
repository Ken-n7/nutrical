import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExchangeTable from '../components/ExchangeTable';

const defaultExchanges = {
  veg: 3, fruit: 5, milkWhole: 0, milk: 1, milkSkim: 0, sugar: 3,
  riceA: 1, riceB: 5, riceC: 1,
  meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2,
};

const defaultAssessment = {
  bmi: 28.3,
  ter: 1670,
  dist: [65, 15, 20],
  targetCho: 271.4,
  targetProtein: 62.6,
  targetFat: 37.1,
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
    { key: 'meatLow', count: 2, cho: 0, protein: 16, fat: 4, kcal: 100 },
    { key: 'meatMed', count: 2, cho: 0, protein: 16, fat: 14, kcal: 190 },
    { key: 'meatHigh', count: 0, cho: 0, protein: 0, fat: 0, kcal: 0 },
    { key: 'fat', count: 2, cho: 0, protein: 0, fat: 10, kcal: 90 },
  ],
  riceN: 7, riceCho: 161, riceProtein: 14, riceFat: 0, riceKcal: 692,
  meatN: 4, meatProtein: 32, meatFat: 18, meatKcal: 290,
  basicCho: 86, basicProtein: 11, basicFat: 5,
  totalCho: 247, totalProtein: 57, totalFat: 33, totalKcal: 1672, totalN: 24,
  choDiff: -24.4, proteinDiff: -5.6, fatDiff: -4.1, kcalDiff: 2, within: false,
};

function renderExchangeTable(overrides = {}) {
  const updateExchange = vi.fn();
  const defaultProps = {
    exchanges: defaultExchanges,
    updateExchange,
    exchangeData: defaultExchangeData,
    assessment: defaultAssessment,
    ...overrides,
  };
  return {
    ...render(<ExchangeTable {...defaultProps} />),
    updateExchange,
  };
}

describe('ExchangeTable', () => {
  it('renders nothing when exchangeData is null', () => {
    const { container } = render(<ExchangeTable exchanges={{}} updateExchange={vi.fn()} exchangeData={null} assessment={defaultAssessment} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when assessment is null', () => {
    const { container } = render(<ExchangeTable exchanges={{}} updateExchange={vi.fn()} exchangeData={defaultExchangeData} assessment={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the FEL Exchange Distribution heading', () => {
    renderExchangeTable();
    expect(screen.getByText('FEL Exchange Distribution')).toBeInTheDocument();
  });

  describe('prescription badges', () => {
    it('displays current prescription targets', () => {
      renderExchangeTable();
      expect(screen.getByText('Current Prescription')).toBeInTheDocument();
      expect(screen.getAllByText('CHO').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('271.4 g')).toBeInTheDocument();
      expect(screen.getAllByText('PRO').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('62.6 g')).toBeInTheDocument();
      expect(screen.getByText('TER')).toBeInTheDocument();
      expect(screen.getByText('1,670 kcal')).toBeInTheDocument();
    });
  });

  describe('exchange table rows', () => {
    it('renders all food group rows', () => {
      renderExchangeTable();
      expect(screen.getByText('Vegetable')).toBeInTheDocument();
      expect(screen.getByText('Fruit')).toBeInTheDocument();
      expect(screen.getByText('Whole Milk')).toBeInTheDocument();
      expect(screen.getByText('Low-Fat Milk')).toBeInTheDocument();
      expect(screen.getByText('Skim Milk')).toBeInTheDocument();
      expect(screen.getByText('Sugar')).toBeInTheDocument();
      expect(screen.getByText(/Rice A/)).toBeInTheDocument();
      expect(screen.getByText(/Rice B/)).toBeInTheDocument();
      expect(screen.getByText(/Rice C/)).toBeInTheDocument();
      expect(screen.getByText(/Low-Fat Meat/)).toBeInTheDocument();
      expect(screen.getByText(/Med-Fat Meat/)).toBeInTheDocument();
      expect(screen.getByText(/High-Fat Meat/)).toBeInTheDocument();
      expect(screen.getAllByText('Fat').length).toBeGreaterThanOrEqual(1);
    });

    it('renders table headers', () => {
      renderExchangeTable();
      expect(screen.getByText('Food Group')).toBeInTheDocument();
      expect(screen.getByText('Exchange')).toBeInTheDocument();
      expect(screen.getByText('CHO (g)')).toBeInTheDocument();
      expect(screen.getByText('PRO (g)')).toBeInTheDocument();
      expect(screen.getByText('Fat (g)')).toBeInTheDocument();
      expect(screen.getByText('kcal')).toBeInTheDocument();
    });

    it('displays exchange values for each row', () => {
      renderExchangeTable();
      const vegInput = screen.getByLabelText('Vegetable exchanges');
      expect(vegInput).toHaveValue(3);
      const fruitInput = screen.getByLabelText('Fruit exchanges');
      expect(fruitInput).toHaveValue(5);
    });
  });

  describe('subtotals', () => {
    it('displays CHO subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('CHO Subtotal')).toBeInTheDocument();
    });

    it('displays Rice subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Rice Subtotal')).toBeInTheDocument();
    });

    it('displays PRO subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Protein so far')).toBeInTheDocument();
    });

    it('displays Meat subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Meat Subtotal')).toBeInTheDocument();
    });

    it('displays Fat subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Fat so far (before Fat exchanges)')).toBeInTheDocument();
    });

    it('displays grand total', () => {
      renderExchangeTable();
      expect(screen.getByText('TOTAL')).toBeInTheDocument();
    });
  });

  describe('target differences', () => {
    it('displays CHO target', () => {
      renderExchangeTable();
      expect(screen.getByText(/Target 271.4 g/)).toBeInTheDocument();
    });

    it('displays PRO target', () => {
      renderExchangeTable();
      expect(screen.getByText(/Target 62.6 g/)).toBeInTheDocument();
    });

    it('displays Fat target', () => {
      renderExchangeTable();
      expect(screen.getByText(/Target 37.1 g/)).toBeInTheDocument();
    });
  });

  describe('comparison review', () => {
    it('renders comparison section', () => {
      renderExchangeTable();
      expect(screen.getByText('Prescription vs Entered Exchanges')).toBeInTheDocument();
    });

    it('shows warning badge when outside tolerance', () => {
      renderExchangeTable();
      expect(screen.getByText('Review needed')).toBeInTheDocument();
    });

    it('shows normal badge when within tolerance', () => {
      const withinData = { ...defaultExchangeData, within: true };
      renderExchangeTable({ exchangeData: withinData });
      expect(screen.getByText('Within tolerance')).toBeInTheDocument();
    });

    it('displays CHO comparison', () => {
      renderExchangeTable();
      expect(screen.getByText('247.0 / 271.4 g')).toBeInTheDocument();
    });

    it('displays Energy comparison', () => {
      renderExchangeTable();
      expect(screen.getByText('1,672 / 1,670 kcal')).toBeInTheDocument();
    });
  });

  describe('exchange input interactions', () => {
    it('calls updateExchange when exchange value changes', async () => {
      const user = userEvent.setup();
      const { updateExchange } = renderExchangeTable();
      const vegInput = screen.getByLabelText('Vegetable exchanges');
      await user.clear(vegInput);
      await user.type(vegInput, '5');
      expect(updateExchange).toHaveBeenCalled();
    });

    it('accepts fractional exchange values', async () => {
      const user = userEvent.setup();
      const { updateExchange } = renderExchangeTable();
      const vegInput = screen.getByLabelText('Vegetable exchanges');
      await user.clear(vegInput);
      await user.type(vegInput, '2.5');
      expect(updateExchange).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has aria-labels on exchange inputs', () => {
      renderExchangeTable();
      expect(screen.getByLabelText('Vegetable exchanges')).toBeInTheDocument();
      expect(screen.getByLabelText('Fruit exchanges')).toBeInTheDocument();
      expect(screen.getByLabelText('Low-Fat Milk exchanges')).toBeInTheDocument();
    });

    it('has aria-live on comparison section', () => {
      renderExchangeTable();
      const comparison = screen.getByText('Prescription vs Entered Exchanges').closest('[aria-live]');
      expect(comparison).toHaveAttribute('aria-live', 'polite');
    });
  });
});
