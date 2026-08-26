import { useCallback } from 'react';

export default function PatientForm({ patient, updatePatient, error, onCompute }) {
  const handleChange = useCallback((field) => (e) => {
    updatePatient(field, e.target.value);
  }, [updatePatient]);

  const handleCompute = useCallback(() => {
    onCompute();
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [onCompute]);

  return (
    <section id="patient" className="scroll-mt-20 mb-8">
      <form className="card-traditional p-6" onSubmit={(e) => e.preventDefault()} noValidate>
        <fieldset className="form-fieldset">
          <legend>Patient Information</legend>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {/* Name - spans full width on mobile, 2 cols on desktop */}
            <div className="md:col-span-2">
              <label htmlFor="f-name" className="block text-sm font-semibold text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                id="f-name"
                value={patient.name}
                onChange={handleChange('name')}
                autoComplete="off"
                className="input-traditional"
                placeholder="Enter patient name"
              />
              <p className="help-text">Optional - for identification purposes</p>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="f-age" className="block text-sm font-semibold text-gray-700 mb-1">
                Age <span className="text-gray-400 font-normal">(years)</span>
              </label>
              <input
                type="number"
                id="f-age"
                value={patient.age}
                min="1"
                max="120"
                inputMode="numeric"
                onChange={handleChange('age')}
                className="input-traditional"
              />
            </div>

            {/* Sex */}
            <div>
              <label htmlFor="f-sex" className="block text-sm font-semibold text-gray-700 mb-1">
                Sex
              </label>
              <select
                id="f-sex"
                value={patient.sex}
                onChange={handleChange('sex')}
                className="input-traditional"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            {/* Body Frame */}
            <div>
              <label htmlFor="f-frame" className="block text-sm font-semibold text-gray-700 mb-1">
                Body Frame
              </label>
              <select
                id="f-frame"
                value={patient.frame}
                onChange={handleChange('frame')}
                className="input-traditional"
              >
                <option value="0.9">Small (-10%)</option>
                <option value="1">Medium (standard)</option>
                <option value="1.1">Large (+10%)</option>
              </select>
              <p className="help-text">Adjusts DBW calculation</p>
            </div>

            {/* Height - two inputs in one field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Height
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center border-2 border-gray-300 rounded focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]">
                    <input
                      type="number"
                      value={patient.heightFt}
                      min="3"
                      max="8"
                      inputMode="numeric"
                      aria-label="Height in feet"
                      onChange={handleChange('heightFt')}
                      className="w-full h-10 border-0 px-3 text-sm text-center text-gray-900 outline-none bg-white"
                    />
                    <span className="text-sm text-gray-500 font-semibold pr-3">ft</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center border-2 border-gray-300 rounded focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]">
                    <input
                      type="number"
                      value={patient.heightIn}
                      min="0"
                      max="11"
                      inputMode="numeric"
                      aria-label="Height in inches"
                      onChange={handleChange('heightIn')}
                      className="w-full h-10 border-0 px-3 text-sm text-center text-gray-900 outline-none bg-white"
                    />
                    <span className="text-sm text-gray-500 font-semibold pr-3">in</span>
                  </div>
                </div>
              </div>
              <p className="help-text">Used for Hamwi DBW calculation</p>
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="f-weight" className="block text-sm font-semibold text-gray-700 mb-1">
                Weight <span className="text-gray-400 font-normal">(lb)</span>
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
                className="input-traditional"
              />
              <p className="help-text">Actual body weight</p>
            </div>

            {/* Activity Factor */}
            <div>
              <label htmlFor="f-activity" className="block text-sm font-semibold text-gray-700 mb-1">
                Activity Factor
              </label>
              <select
                id="f-activity"
                value={patient.activity}
                onChange={handleChange('activity')}
                className="input-traditional"
              >
                <option value="30">Light (30 kcal/kg)</option>
                <option value="35">Moderate (35 kcal/kg)</option>
                <option value="40">Active (40 kcal/kg)</option>
                <option value="45">Very Active (45 kcal/kg)</option>
              </select>
              <p className="help-text">kcal per kg DBW per day</p>
            </div>

            {/* Macronutrient Distribution */}
            <div className="md:col-span-2">
              <label htmlFor="f-distribution" className="block text-sm font-semibold text-gray-700 mb-1">
                Macronutrient Distribution
              </label>
              <select
                id="f-distribution"
                value={patient.distribution}
                onChange={handleChange('distribution')}
                className="input-traditional"
              >
                <option value="65,15,20">CHO 65% / CHON 15% / Fat 20%</option>
                <option value="55,15,30">CHO 55% / CHON 15% / Fat 30%</option>
                <option value="50,20,30">CHO 50% / CHON 20% / Fat 30%</option>
                <option value="60,15,25">CHO 60% / CHON 15% / Fat 25%</option>
              </select>
              <p className="help-text">Percentage split for TER calculation</p>
            </div>
          </div>
        </fieldset>

        {/* Error display - visible when present */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded" role="alert" aria-live="assertive">
            <p className="text-sm text-red-700 font-semibold m-0">{error}</p>
          </div>
        )}

        {/* Action area */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-100">
          <p className="text-sm text-gray-500 m-0">
            Calculations update as you type. Click Calculate to scroll to results.
          </p>
          <button
            type="button"
            onClick={handleCompute}
            className="btn-primary no-print"
          >
            Calculate Prescription
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>
    </section>
  );
}
