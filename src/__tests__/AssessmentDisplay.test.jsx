import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssessmentDisplay from '../components/AssessmentDisplay';

const mockAssessment = {
  bmi: 28.3,
  bmiInfo: { label: 'Overweight', color: 'bg-amber-100 text-amber-700' },
  dbw: { kg: 47.73, formula: '100 + (1 × 5) lb ÷ 2.2' },
  dbwInfo: { label: '126% of DBW · Overweight', color: 'bg-amber-100 text-amber-700' },
  af: 35,
  afLabel: 'Moderately active',
  ter: 1670,
  terRaw: 1670.55,
  dist: [65, 15, 20],
  targetCho: 271.4,
  targetChon: 62.6,
  targetFat: 37.1,
};

describe('AssessmentDisplay', () => {
  it('renders nothing when assessment is null', () => {
    const { container } = render(<AssessmentDisplay assessment={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the Energy Assessment heading', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('Energy Assessment')).toBeInTheDocument();
  });

  it('displays BMI value', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('28.3')).toBeInTheDocument();
  });

  it('displays BMI classification badge', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('Overweight')).toBeInTheDocument();
  });

  it('displays DBW value in kg', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('47.7 kg')).toBeInTheDocument();
  });

  it('displays DBW formula', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('100 + (1 × 5) lb ÷ 2.2')).toBeInTheDocument();
  });

  it('displays activity factor', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('× 35')).toBeInTheDocument();
    expect(screen.getByText('Moderately active · kcal/kg DBW')).toBeInTheDocument();
  });

  it('displays TER value', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText('1,670 kcal/day')).toBeInTheDocument();
  });

  it('displays TER formula', () => {
    render(<AssessmentDisplay assessment={mockAssessment} />);
    expect(screen.getByText(/47\.7 × 35/)).toBeInTheDocument();
  });

  describe('macronutrient targets', () => {
    it('renders Macronutrient Targets section', () => {
      render(<AssessmentDisplay assessment={mockAssessment} />);
      expect(screen.getByText('Macronutrient Targets')).toBeInTheDocument();
    });

    it('displays CHO target', () => {
      render(<AssessmentDisplay assessment={mockAssessment} />);
      expect(screen.getByText('Carbohydrates')).toBeInTheDocument();
      expect(screen.getByText('271.4 g')).toBeInTheDocument();
      expect(screen.getByText(/65%/)).toBeInTheDocument();
    });

    it('displays CHON target', () => {
      render(<AssessmentDisplay assessment={mockAssessment} />);
      expect(screen.getByText('Protein (CHON)')).toBeInTheDocument();
      expect(screen.getByText('62.6 g')).toBeInTheDocument();
      expect(screen.getByText(/15%/)).toBeInTheDocument();
    });

    it('displays Fat target', () => {
      render(<AssessmentDisplay assessment={mockAssessment} />);
      expect(screen.getByText('Fat')).toBeInTheDocument();
      expect(screen.getByText('37.1 g')).toBeInTheDocument();
      expect(screen.getByText(/20%/)).toBeInTheDocument();
    });
  });
});
