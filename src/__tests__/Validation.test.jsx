import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientForm from '../components/PatientForm';
import { useState } from 'react';

const defaultPatient = {
  name: 'Maria Dela Cruz',
  age: 45,
  sex: 'female',
  frame: '1',
  heightFt: 5,
  heightIn: 1,
  weight: 150,
  activity: '35',
  distribution: '65,15,20',
};

function PatientFormWrapper({ initialPatient = defaultPatient, onCompute: onComputeProp, error, onNext }) {
  const [patient, setPatient] = useState({ ...initialPatient });
  const updatePatient = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <PatientForm
      patient={patient}
      updatePatient={updatePatient}
      error={error}
      onCompute={onComputeProp}
      onNext={onNext}
    />
  );
}

describe('PatientForm validation', () => {
  describe('blur validation - age', () => {
    it('shows error for age below minimum', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '0');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 1–120 years')).toBeInTheDocument();
      });
    });

    it('shows error for age above maximum', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '150');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 1–120 years')).toBeInTheDocument();
      });
    });

    it('shows error for empty age', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument();
      });
    });

    it('no error for valid age', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '30');
      await user.tab();
      await waitFor(() => {
        expect(screen.queryByText('Must be 1–120 years')).not.toBeInTheDocument();
        expect(screen.queryByText('Required')).not.toBeInTheDocument();
      });
    });
  });

  describe('blur validation - weight', () => {
    it('shows error for weight below minimum', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const weightInput = screen.getByLabelText(/Weight/);
      await user.clear(weightInput);
      await user.type(weightInput, '20');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 30–500 lb')).toBeInTheDocument();
      });
    });

    it('shows error for weight above maximum', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const weightInput = screen.getByLabelText(/Weight/);
      await user.clear(weightInput);
      await user.type(weightInput, '600');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 30–500 lb')).toBeInTheDocument();
      });
    });

    it('no error for valid weight', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const weightInput = screen.getByLabelText(/Weight/);
      await user.clear(weightInput);
      await user.type(weightInput, '180');
      await user.tab();
      await waitFor(() => {
        expect(screen.queryByText('Must be 30–500 lb')).not.toBeInTheDocument();
      });
    });
  });

  describe('blur validation - height', () => {
    it('shows error for total height below 4ft', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ftInput = screen.getByLabelText('Height in feet');
      await user.clear(ftInput);
      await user.type(ftInput, '3');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Total height must be 4–8 ft')).toBeInTheDocument();
      });
    });

    it('shows error for inches above 11', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const inInput = screen.getByLabelText('Height in inches');
      await user.clear(inInput);
      await user.type(inInput, '12');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 0–11 inches')).toBeInTheDocument();
      });
    });
  });

  describe('visual error styling', () => {
    it('applies error class to invalid field on blur', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '0');
      await user.tab();
      await waitFor(() => {
        expect(ageInput.className).toContain('input-input-error');
      });
    });

    it('sets aria-invalid on error fields', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '0');
      await user.tab();
      await waitFor(() => {
        expect(ageInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('clears errors on change', () => {
    it('clears field error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<PatientFormWrapper />);
      const ageInput = screen.getByLabelText(/Age/);
      await user.clear(ageInput);
      await user.type(ageInput, '0');
      await user.tab();
      await waitFor(() => {
        expect(screen.getByText('Must be 1–120 years')).toBeInTheDocument();
      });
      await user.type(ageInput, '5');
      await waitFor(() => {
        expect(screen.queryByText('Must be 1–120 years')).not.toBeInTheDocument();
      });
    });
  });
});
