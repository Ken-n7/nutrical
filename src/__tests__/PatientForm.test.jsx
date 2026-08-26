import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientForm from '../components/PatientForm';

const defaultPatient = {
  name: 'Maria Dela Cruz',
  age: 45,
  sex: 'female',
  frame: 1,
  heightFt: 5,
  heightIn: 1,
  weight: 150,
  activity: 35,
  distribution: '65,15,20',
};

function renderPatientForm(overrides = {}) {
  const updatePatient = vi.fn();
  const onCompute = vi.fn();
  const defaultProps = {
    patient: defaultPatient,
    updatePatient,
    error: null,
    onCompute,
    ...overrides,
  };
  return {
    ...render(<PatientForm {...defaultProps} />),
    updatePatient,
    onCompute,
  };
}

describe('PatientForm', () => {
  it('renders all form fields', () => {
    renderPatientForm();
    expect(screen.getByLabelText('Patient Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/)).toBeInTheDocument();
    expect(screen.getByLabelText('Sex')).toBeInTheDocument();
    expect(screen.getByLabelText('Body Frame')).toBeInTheDocument();
    expect(screen.getByLabelText('Height in feet')).toBeInTheDocument();
    expect(screen.getByLabelText('Height in inches')).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight/)).toBeInTheDocument();
    expect(screen.getByLabelText('Activity Factor')).toBeInTheDocument();
    expect(screen.getByLabelText('Macronutrient Distribution')).toBeInTheDocument();
  });

  it('renders with pre-filled patient values', () => {
    renderPatientForm();
    expect(screen.getByLabelText('Patient Name')).toHaveValue('Maria Dela Cruz');
    expect(screen.getByLabelText(/Age/)).toHaveValue(45);
    expect(screen.getByLabelText('Sex')).toHaveValue('female');
    expect(screen.getByLabelText('Height in feet')).toHaveValue(5);
    expect(screen.getByLabelText('Height in inches')).toHaveValue(1);
    expect(screen.getByLabelText(/Weight/)).toHaveValue(150);
  });

  it('renders the Calculate button', () => {
    renderPatientForm();
    expect(screen.getByRole('button', { name: /Calculate Prescription/ })).toBeInTheDocument();
  });

  it('renders fieldset with Patient Information legend', () => {
    renderPatientForm();
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
  });

  it('shows help text for weight', () => {
    renderPatientForm();
    expect(screen.getByText('Actual body weight')).toBeInTheDocument();
  });

  it('shows help text for body frame', () => {
    renderPatientForm();
    expect(screen.getByText('Adjusts DBW calculation')).toBeInTheDocument();
  });

  describe('field interactions', () => {
    it('calls updatePatient when name changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.clear(screen.getByLabelText('Patient Name'));
      await user.type(screen.getByLabelText('Patient Name'), 'Juan');
      const nameCalls = updatePatient.mock.calls.filter(c => c[0] === 'name');
      expect(nameCalls.length).toBeGreaterThan(0);
      const lastCall = nameCalls[nameCalls.length - 1];
      expect(lastCall[1]).toContain('n');
    });

    it('calls updatePatient when age changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.clear(screen.getByLabelText(/Age/));
      await user.type(screen.getByLabelText(/Age/), '30');
      const lastCall = updatePatient.mock.calls[updatePatient.mock.calls.length - 1];
      expect(lastCall[0]).toBe('age');
    });

    it('calls updatePatient when sex changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.selectOptions(screen.getByLabelText('Sex'), 'male');
      expect(updatePatient).toHaveBeenCalledWith('sex', 'male');
    });

    it('calls updatePatient when frame changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.selectOptions(screen.getByLabelText('Body Frame'), '0.9');
      expect(updatePatient).toHaveBeenCalledWith('frame', '0.9');
    });

    it('calls updatePatient when height changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.clear(screen.getByLabelText('Height in feet'));
      await user.type(screen.getByLabelText('Height in feet'), '6');
      const lastCall = updatePatient.mock.calls[updatePatient.mock.calls.length - 1];
      expect(lastCall[0]).toBe('heightFt');
    });

    it('calls updatePatient when weight changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.clear(screen.getByLabelText(/Weight/));
      await user.type(screen.getByLabelText(/Weight/), '180');
      const lastCall = updatePatient.mock.calls[updatePatient.mock.calls.length - 1];
      expect(lastCall[0]).toBe('weight');
    });

    it('calls updatePatient when activity factor changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.selectOptions(screen.getByLabelText('Activity Factor'), '40');
      expect(updatePatient).toHaveBeenCalledWith('activity', '40');
    });

    it('calls updatePatient when distribution changes', async () => {
      const user = userEvent.setup();
      const { updatePatient } = renderPatientForm();
      await user.selectOptions(screen.getByLabelText('Macronutrient Distribution'), '55,15,30');
      expect(updatePatient).toHaveBeenCalledWith('distribution', '55,15,30');
    });
  });

  describe('error display', () => {
    it('shows error message when error prop is set', () => {
      renderPatientForm({ error: 'Age must be between 1 and 120 years.' });
      expect(screen.getByRole('alert')).toHaveTextContent('Age must be between 1 and 120 years.');
    });

    it('does not show error when error prop is null', () => {
      renderPatientForm({ error: null });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('calculate button', () => {
    it('calls onCompute when clicked', async () => {
      const user = userEvent.setup();
      const { onCompute } = renderPatientForm();
      await user.click(screen.getByRole('button', { name: /Calculate Prescription/ }));
      expect(onCompute).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has proper label associations', () => {
      renderPatientForm();
      const nameInput = screen.getByLabelText('Patient Name');
      expect(nameInput).toHaveAttribute('id', 'f-name');
      const sexSelect = screen.getByLabelText('Sex');
      expect(sexSelect).toHaveAttribute('id', 'f-sex');
    });

    it('has autocomplete off for name', () => {
      renderPatientForm();
      expect(screen.getByLabelText('Patient Name')).toHaveAttribute('autocomplete', 'off');
    });
  });
});
