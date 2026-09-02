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

  it('renders footer', () => {
    render(<App />);
    const footer = document.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('NutriCal');
  });

  it('shows the print button', () => {
    render(<App />);
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('shows meal plan section', () => {
    render(<App />);
    expect(screen.getAllByText('One-Day Meal Plan').length).toBeGreaterThanOrEqual(1);
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