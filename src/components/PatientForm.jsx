import { useCallback, useState } from 'react';
import { ACTIVITY_LEVELS } from '../hooks/useNutriCal';

const VALIDATORS = {
  age: (v) => {
    const n = parseFloat(v);
    if (!Number.isFinite(n)) return 'Required';
    if (n < 1 || n > 120) return 'Must be 1–120 years';
    return null;
  },
  heightFt: (v, patient) => {
    const ft = parseInt(v, 10);
    const inches = parseInt(patient.heightIn, 10) || 0;
    const total = ft * 12 + inches;
    if (!Number.isFinite(total) || total === 0) return 'Required';
    if (total < 48 || total > 96) return 'Total height must be 4–8 ft';
    return null;
  },
  heightIn: (v, patient) => {
    const inches = parseInt(v, 10);
    if (!Number.isFinite(inches)) return null;
    if (inches < 0 || inches > 11) return 'Must be 0–11 inches';
    const ft = parseInt(patient.heightFt, 10) || 0;
    const total = ft * 12 + inches;
    if (total < 48 || total > 96) return 'Total height must be 4–8 ft';
    return null;
  },
  weight: (v) => {
    const n = parseFloat(v);
    if (!Number.isFinite(n)) return 'Required';
    if (n < 30 || n > 500) return 'Must be 30–500 lb';
    return null;
  },
};

function PatientForm({ patient, updatePatient, error }) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field) => (e) => {
    updatePatient(field, e.target.value);
    setFieldErrors((prev) => {
      if (prev[field]) return { ...prev, [field]: null };
      return prev;
    });
  }, [updatePatient]);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validator = VALIDATORS[field];
    if (validator) {
      const err = validator(patient[field], patient);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
  }, [patient]);

  const fieldClass = (field) => {
    const base = 'input';
    if (touched[field] && fieldErrors[field]) return `${base} input-input-error`;
    return base;
  };

  const unitBox = (field) =>
    `flex items-center border rounded-[10px] bg-surface overflow-hidden transition-colors ${
      touched[field] && fieldErrors[field]
        ? 'border-red-500'
        : 'border-border-strong focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]'
    }`;

  return (
    <form className="card p-5 sm:p-6" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-4">
        {/* Name */}
        <div className="col-span-2 xl:col-span-2">
          <label htmlFor="f-name" className="field-label">
            Patient Name
          </label>
          <input
            type="text"
            id="f-name"
            value={patient.name}
            onChange={handleChange('name')}
            autoComplete="off"
            className={fieldClass('name')}
            placeholder="Enter patient name"
          />
          <p className="help-text">Optional — for identification purposes</p>
        </div>

        {/* Age */}
        <div>
          <label htmlFor="f-age" className="field-label">
            Age <span className="font-normal text-muted">(years)</span>
          </label>
          <input
            type="number"
            id="f-age"
            value={patient.age}
            min="1"
            max="120"
            inputMode="numeric"
            onChange={handleChange('age')}
            onBlur={handleBlur('age')}
            className={fieldClass('age')}
            aria-invalid={!!fieldErrors.age}
            aria-describedby={fieldErrors.age ? 'f-age-error' : undefined}
          />
          {touched.age && fieldErrors.age && (
            <p id="f-age-error" className="error-text">{fieldErrors.age}</p>
          )}
        </div>

        {/* Sex */}
        <div>
          <label htmlFor="f-sex" className="field-label">Sex</label>
          <select id="f-sex" value={patient.sex} onChange={handleChange('sex')} className="select">
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        {/* Height */}
        <div className="col-span-2 xl:col-span-2">
          <label className="field-label">Height</label>
          <div className="flex gap-2">
            <div className={unitBox('heightFt')}>
              <input
                type="number"
                value={patient.heightFt}
                min="4"
                max="8"
                inputMode="numeric"
                aria-label="Height in feet"
                aria-invalid={!!fieldErrors.heightFt}
                onChange={handleChange('heightFt')}
                onBlur={handleBlur('heightFt')}
                className="w-full h-10 border-0 px-3 text-sm text-center outline-none bg-transparent"
              />
              <span className="text-sm text-muted font-semibold pr-3">ft</span>
            </div>
            <div className={unitBox('heightIn')}>
              <input
                type="number"
                value={patient.heightIn}
                min="0"
                max="11"
                inputMode="numeric"
                aria-label="Height in inches"
                aria-invalid={!!fieldErrors.heightIn}
                onChange={handleChange('heightIn')}
                onBlur={handleBlur('heightIn')}
                className="w-full h-10 border-0 px-3 text-sm text-center outline-none bg-transparent"
              />
              <span className="text-sm text-muted font-semibold pr-3">in</span>
            </div>
          </div>
          {(touched.heightFt || touched.heightIn) && (fieldErrors.heightFt || fieldErrors.heightIn) && (
            <p className="error-text">{fieldErrors.heightFt || fieldErrors.heightIn}</p>
          )}
          <p className="help-text">Used for Hamwi DBW calculation</p>
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="f-weight" className="field-label">
            Weight <span className="font-normal text-muted">(lb)</span>
          </label>
          <input
            type="number"
            id="f-weight"
            value={patient.weight}
            min="30"
            max="500"
            step="0.1"
            inputMode="decimal"
            onChange={handleChange('weight')}
            onBlur={handleBlur('weight')}
            className={fieldClass('weight')}
            aria-invalid={!!fieldErrors.weight}
            aria-describedby={fieldErrors.weight ? 'f-weight-error' : undefined}
          />
          {touched.weight && fieldErrors.weight && (
            <p id="f-weight-error" className="error-text">{fieldErrors.weight}</p>
          )}
          {!fieldErrors.weight && <p className="help-text">Actual body weight</p>}
        </div>

        {/* Body Frame */}
        <div>
          <label htmlFor="f-frame" className="field-label">Body Frame</label>
          <select id="f-frame" value={patient.frame} onChange={handleChange('frame')} className="select">
            <option value="0.9">Small (-10%)</option>
            <option value="1">Medium (standard)</option>
            <option value="1.1">Large (+10%)</option>
          </select>
          <p className="help-text">Adjusts DBW calculation</p>
        </div>

        {/* Activity Factor */}
        <div>
          <label htmlFor="f-activity" className="field-label">Activity Factor</label>
          <select id="f-activity" value={patient.activity} onChange={handleChange('activity')} className="select">
            {Object.entries(ACTIVITY_LEVELS).map(([kcal, label]) => (
              <option key={kcal} value={kcal}>{label} ({kcal} kcal/kg)</option>
            ))}
          </select>
          <p className="help-text">kcal per kg DBW per day</p>
        </div>

        {/* Macronutrient Distribution */}
        <div className="col-span-2 xl:col-span-2">
          <label htmlFor="f-distribution" className="field-label">Macronutrient Distribution</label>
          <select id="f-distribution" value={patient.distribution} onChange={handleChange('distribution')} className="select">
            <option value="65,15,20">CHO 65% / Protein 15% / Fat 20%</option>
            <option value="55,15,30">CHO 55% / Protein 15% / Fat 30%</option>
            <option value="50,20,30">CHO 50% / Protein 20% / Fat 30%</option>
            <option value="60,15,25">CHO 60% / Protein 15% / Fat 25%</option>
          </select>
          <p className="help-text">Percentage split for TER calculation</p>
        </div>
      </div>

      {error && (
        <div className="mt-5 p-3 rounded-[10px] border border-red-200 bg-red-50" role="alert" aria-live="assertive">
          <p className="text-sm text-red-700 font-semibold m-0">{error}</p>
        </div>
      )}
    </form>
  );
}

export default PatientForm;