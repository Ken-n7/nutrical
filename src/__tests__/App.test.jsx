import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App integration', () => {
  it('renders the full application shell', () => {
    render(<App />);
    expect(screen.getAllByText('NutriCal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('FEL Exchange Calculator')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Assessment' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Exchanges' })).toBeInTheDocument();
  });

  it('renders patient panel trigger', () => {
    render(<App />);
    expect(screen.getAllByLabelText('Open patient information').length).toBeGreaterThanOrEqual(1);
  });

  it('renders skip link for accessibility', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getByText(/References: DOST-FNRI/)).toBeInTheDocument();
  });

  it('shows the print button', () => {
    render(<App />);
    expect(screen.getByText('Print Report')).toBeInTheDocument();
  });

  it('shows meal plan section', () => {
    render(<App />);
    expect(screen.getByText('One-Day Meal Plan')).toBeInTheDocument();
  });
});
