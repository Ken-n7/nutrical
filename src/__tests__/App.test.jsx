import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App integration', () => {
  it('renders the full application shell', () => {
    render(<App />);
    expect(screen.getAllByText('NutriCal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('FEL Exchange Calculator')).toBeInTheDocument();
  });

  it('renders stepper navigation to all steps', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Step 1: Patient' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Step 2: Assessment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Step 3: Exchanges' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Step 4: Meal Plan' })).toBeInTheDocument();
  });

  it('renders skip link for accessibility', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('hides the save button when the meal plan is empty', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Save meal plan' })).not.toBeInTheDocument();
  });

  it('shows meal plan section', () => {
    render(<App />);
    expect(screen.getAllByText('One-Day Meal Plan').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the printable meal plan at the app root, always visible for capture', () => {
    const { container } = render(<App />);
    const printBlock = container.querySelector('.meal-plan-print');
    expect(printBlock).not.toBeNull();
    expect(printBlock.closest('section#meal-plan')).toBeNull();
    expect(printBlock.querySelector('table')).not.toBeNull();
    expect(getComputedStyle(printBlock).display).not.toBe('none');
  });

  it('renders patient information section', () => {
    render(<App />);
    expect(screen.getAllByText('Patient Information').length).toBeGreaterThanOrEqual(1);
  });

  it('renders assessment section', () => {
    render(<App />);
    expect(screen.getAllByText('Energy Assessment').length).toBeGreaterThanOrEqual(1);
  });
});