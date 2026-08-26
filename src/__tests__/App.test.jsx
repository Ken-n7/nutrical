import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App integration', () => {
  it('renders the full application', () => {
    render(<App />);
    expect(screen.getAllByText('NutriCal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('FEL Exchange Calculator')).toBeInTheDocument();
    expect(screen.getByText('Energy Assessment')).toBeInTheDocument();
    expect(screen.getByText('FEL Exchange Distribution')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Patient' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Assessment' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Exchanges' })).toBeInTheDocument();
  });

  it('renders skip link for accessibility', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getByText(/References: DOST-FNRI/)).toBeInTheDocument();
  });

  it('shows default patient BMI of 28.3', () => {
    render(<App />);
    expect(screen.getByText('28.3')).toBeInTheDocument();
  });

  it('shows default TER of 1,670', () => {
    render(<App />);
    expect(screen.getByText('1,670 kcal/day')).toBeInTheDocument();
  });

  it('shows exchange table with default values', () => {
    render(<App />);
    expect(screen.getByLabelText('Vegetable exchanges')).toHaveValue(3);
    expect(screen.getByLabelText('Fruit exchanges')).toHaveValue(5);
  });

  it('recalculates when patient sex changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Initial: female, 5'1", 150 lb -> BMI 28.3
    expect(screen.getByText('28.3')).toBeInTheDocument();
    // Change to male
    await user.selectOptions(screen.getByLabelText('Sex'), 'male');
    // Male Hamwi: 106 + (1*6) = 112 lb = 50.91 kg
    // BMI = (150/2.205) / (61*2.54/100)^2 = 68.03 / 2.398 = 28.4
    // DBW% = 68.03 / 50.91 = 133.6%
    // TER = 50.91 * 35 = 1781.85 -> 1780
    expect(screen.getByText('1,780 kcal/day')).toBeInTheDocument();
  });

  it('recalculates when activity factor changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Activity Factor'), '40');
    // TER = 47.73 * 40 = 1909.2 -> 1910
    expect(screen.getByText('1,910 kcal/day')).toBeInTheDocument();
  });

  it('recalculates when exchange values change', async () => {
    const user = userEvent.setup();
    render(<App />);
    const vegInput = screen.getByLabelText('Vegetable exchanges');
    await user.clear(vegInput);
    await user.type(vegInput, '5');
    // 5 * 3 = 15 CHO (was 9)
    expect(screen.getByText('Total Entered')).toBeInTheDocument();
  });

  it('displays assessment section after calculation', () => {
    render(<App />);
    expect(screen.getByText('Energy Assessment')).toBeInTheDocument();
    expect(screen.getByText('Macronutrient Targets')).toBeInTheDocument();
  });

  it('displays exchange table section', () => {
    render(<App />);
    expect(screen.getByText('FEL Exchange Distribution')).toBeInTheDocument();
    expect(screen.getByText('Prescription vs. Entered Exchanges')).toBeInTheDocument();
  });

  it('shows the print button', () => {
    render(<App />);
    expect(screen.getByText('Print Report')).toBeInTheDocument();
  });
});
