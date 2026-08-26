import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExchangeTable from '../components/ExchangeTable';

const defaultExchanges = {
  veg: 3, fruit: 5, milk: 1, sugar: 3,
  riceA: 1, riceB: 5, riceC: 1,
  meatLow: 2, meatMed: 2, meatHigh: 0, fat: 2,
};

const defaultAssessment = {
  bmi: 28.3,
  ter: 1670,
  dist: [65, 15, 20],
  targetCho: 271.4,
  targetChon: 62.6,
  targetFat: 37.1,
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
  riceN: 7, riceCho: 161, riceChon: 14, riceFat: 0, riceKcal: 692,
  meatN: 4, meatChon: 32, meatFat: 14, meatKcal: 254,
  basicCho: 86, basicChon: 11, basicFat: 5,
  totalCho: 247, totalChon: 57, totalFat: 29, totalKcal: 1529, totalN: 24,
  choDiff: -24.4, chonDiff: -5.6, fatDiff: -8.1, kcalDiff: -141, within: false,
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
      expect(screen.getAllByText('CHON').length).toBeGreaterThanOrEqual(1);
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
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Sugar')).toBeInTheDocument();
      expect(screen.getByText('Rice A')).toBeInTheDocument();
      expect(screen.getByText('Rice B')).toBeInTheDocument();
      expect(screen.getByText('Rice C')).toBeInTheDocument();
      expect(screen.getByText('LF Meat')).toBeInTheDocument();
      expect(screen.getByText('MF Meat')).toBeInTheDocument();
      expect(screen.getByText('HF Meat')).toBeInTheDocument();
      expect(screen.getAllByText('Fat').length).toBeGreaterThanOrEqual(1);
    });

    it('renders table headers', () => {
      renderExchangeTable();
      expect(screen.getByText('Food Group')).toBeInTheDocument();
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
      expect(screen.getByText('CHO (g)')).toBeInTheDocument();
      expect(screen.getByText('CHON (g)')).toBeInTheDocument();
      expect(screen.getByText('Fat (g)')).toBeInTheDocument();
      expect(screen.getByText('Energy (kcal)')).toBeInTheDocument();
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
    it('displays CHO partial sum', () => {
      renderExchangeTable();
      expect(screen.getByText('CHO Partial Sum')).toBeInTheDocument();
    });

    it('displays Rice subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Rice Subtotal')).toBeInTheDocument();
    });

    it('displays CHON partial sum', () => {
      renderExchangeTable();
      expect(screen.getByText('CHON Partial Sum')).toBeInTheDocument();
    });

    it('displays Meat subtotal', () => {
      renderExchangeTable();
      expect(screen.getByText('Meat Subtotal')).toBeInTheDocument();
    });

    it('displays Fat partial sum', () => {
      renderExchangeTable();
      expect(screen.getByText('Fat Partial Sum')).toBeInTheDocument();
    });

    it('displays grand total', () => {
      renderExchangeTable();
      expect(screen.getByText('Total Entered')).toBeInTheDocument();
    });
  });

  describe('target differences', () => {
    it('displays CHO target difference', () => {
      renderExchangeTable();
      expect(screen.getByText(/Entered 247.0 g · target 271.4 g/)).toBeInTheDocument();
    });

    it('displays CHON target difference', () => {
      renderExchangeTable();
      expect(screen.getByText(/Entered 57.0 g · target 62.6 g/)).toBeInTheDocument();
    });

    it('displays Fat target difference', () => {
      renderExchangeTable();
      expect(screen.getByText(/Entered 29.0 g · target 37.1 g/)).toBeInTheDocument();
    });
  });

  describe('comparison review', () => {
    it('renders comparison section', () => {
      renderExchangeTable();
      expect(screen.getByText('Prescription vs. Entered Exchanges')).toBeInTheDocument();
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
      expect(screen.getByText('1,529 / 1,670 kcal')).toBeInTheDocument();
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
      expect(screen.getByLabelText('Milk exchanges')).toBeInTheDocument();
    });

    it('has aria-live on comparison section', () => {
      renderExchangeTable();
      const comparison = screen.getByText('Prescription vs. Entered Exchanges').closest('[aria-live]');
      expect(comparison).toHaveAttribute('aria-live', 'polite');
    });
  });
});
