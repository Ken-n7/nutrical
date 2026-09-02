import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrescriptionCompare from '../components/PrescriptionCompare';

const defaultAssessment = {
  bmi: 28.3,
  ter: 1670,
  dist: [65, 15, 20],
  targetCho: 271.4,
  targetProtein: 62.6,
  targetFat: 37.1,
};

const defaultExchangeData = {
  totalCho: 247,
  totalProtein: 57,
  totalFat: 33,
  totalKcal: 1672,
  choDiff: -24.4,
  proteinDiff: -5.6,
  fatDiff: -4.1,
  kcalDiff: 2,
  within: false,
};

function renderCompare(overrides = {}) {
  return render(
    <PrescriptionCompare exchangeData={defaultExchangeData} assessment={defaultAssessment} {...overrides} />
  );
}

describe('PrescriptionCompare', () => {
  it('renders nothing when exchangeData is null', () => {
    const { container } = render(<PrescriptionCompare exchangeData={null} assessment={defaultAssessment} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when assessment is null', () => {
    const { container } = render(<PrescriptionCompare exchangeData={defaultExchangeData} assessment={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders comparison section', () => {
    renderCompare();
    expect(screen.getByText('Prescription vs Entered')).toBeInTheDocument();
  });

  it('shows warning badge when outside tolerance', () => {
    renderCompare();
    expect(screen.getByLabelText('Review needed')).toBeInTheDocument();
  });

  it('shows normal badge when within tolerance', () => {
    renderCompare({ exchangeData: { ...defaultExchangeData, within: true } });
    expect(screen.getByText('Within tolerance')).toBeInTheDocument();
  });

  it('displays CHO comparison', () => {
    renderCompare();
    expect(screen.getByText('247 / 271 g')).toBeInTheDocument();
  });

  it('displays Energy comparison', () => {
    renderCompare();
    expect(screen.getByText('1,672 / 1,670 kcal')).toBeInTheDocument();
  });

  it('has aria-live on comparison section', () => {
    renderCompare();
    const comparison = screen.getByText('Prescription vs Entered').closest('[aria-live]');
    expect(comparison).toHaveAttribute('aria-live', 'polite');
  });
});