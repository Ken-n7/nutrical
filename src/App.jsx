import { useNutriCal } from './hooks/useNutriCal';
import PatientForm from './components/PatientForm';
import AssessmentDisplay from './components/AssessmentDisplay';
import ExchangeTable from './components/ExchangeTable';
import MealPlan from './components/MealPlan';

export default function App() {
  const {
    patient,
    updatePatient,
    exchanges,
    updateExchange,
    mealPlan,
    addMealRow,
    removeMealRow,
    updateMealRow,
    moveMealRow,
    generatePlan,
    mealPlanValidation,
    assessment,
    exchangeData,
    error,
    setError,
  } = useNutriCal();

  const handleCompute = () => {
    const { age, heightFt, heightIn, weight, frame, activity, distribution } = patient;
    const totalInches = (parseInt(heightFt, 10) || 0) * 12 + (parseInt(heightIn, 10) || 0);
    const wtLbs = parseFloat(weight) || 0;
    const af = parseFloat(activity) || 35;
    const dist = (distribution || '65,15,20').split(',').map(Number);

    if (![parseFloat(age), totalInches, wtLbs, frame, af].every(Number.isFinite)) {
      setError('Please complete all patient assessment fields.');
      return;
    }
    if (parseFloat(age) < 1 || parseFloat(age) > 120) {
      setError('Age must be between 1 and 120 years.');
      return;
    }
    if (totalInches < 36 || totalInches > 96) {
      setError('Height must be between 3 and 8 feet.');
      return;
    }
    if (wtLbs < 30 || wtLbs > 500) {
      setError('Weight must be between 30 and 500 lb.');
      return;
    }
    if (
      dist.length !== 3 ||
      dist.some((n) => !Number.isFinite(n)) ||
      Math.abs(dist.reduce((a, b) => a + b, 0) - 100) > 0.001
    ) {
      setError('Macronutrient distribution must total 100%.');
      return;
    }
    setError(null);
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      {/* Skip link */}
      <a
        href="#assessment"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to assessment
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-teal-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-teal-700 text-white rounded flex items-center justify-center text-sm font-extrabold">
              N
            </span>
            <div className="leading-tight">
              <strong className="text-sm font-bold text-gray-900">NutriCal</strong>
              <span className="block text-[11px] text-teal-600">FEL Exchange Calculator</span>
            </div>
          </div>

          <nav className="ml-auto hidden sm:flex items-center gap-1" aria-label="Primary">
            <a href="#patient" className="px-3 py-1.5 text-xs font-semibold text-teal-700 rounded hover:bg-teal-50">
              1. Patient
            </a>
            <a href="#assessment" className="px-3 py-1.5 text-xs font-semibold text-teal-700 rounded hover:bg-teal-50">
              2. Assessment
            </a>
            <a href="#prescription" className="px-3 py-1.5 text-xs font-semibold text-teal-700 rounded hover:bg-teal-50">
              3. Exchanges
            </a>
            <a href="#meal-plan" className="px-3 py-1.5 text-xs font-semibold text-teal-700 rounded hover:bg-teal-50">
              4. Meal Plan
            </a>
          </nav>

          <button type="button" onClick={() => window.print()} className="btn-secondary no-print text-xs h-9 px-3">
            Print
          </button>
        </div>
      </header>

      {/* Main – single column, clear steps */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Step 1: Patient */}
        <section id="patient" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-gray-800 m-0">Patient Information</h2>
          </div>
          <PatientForm
            patient={patient}
            updatePatient={updatePatient}
            error={error}
            onCompute={handleCompute}
          />
        </section>

        {/* Step 2: Assessment */}
        <section id="assessment" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-gray-800 m-0">Energy Assessment</h2>
          </div>
          {assessment ? (
            <AssessmentDisplay assessment={assessment} />
          ) : (
            <div className="card-traditional p-6 text-center text-sm text-gray-500">
              Complete patient information above to see BMI, DBW, and energy targets.
            </div>
          )}
        </section>

        {/* Step 3: Exchanges */}
        <section id="prescription" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-gray-800 m-0">Exchange Distribution</h2>
          </div>
          {assessment && exchangeData ? (
            <ExchangeTable
              exchanges={exchanges}
              updateExchange={updateExchange}
              exchangeData={exchangeData}
              assessment={assessment}
            />
          ) : (
            <div className="card-traditional p-6 text-center text-sm text-gray-500">
              Assessment results are required before entering exchanges.
            </div>
          )}
        </section>

        {/* Step 4: Meal Plan */}
        <section id="meal-plan" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-base font-bold text-gray-800 m-0">One-Day Meal Plan</h2>
          </div>
          <MealPlan
            mealPlan={mealPlan}
            addMealRow={addMealRow}
            removeMealRow={removeMealRow}
            updateMealRow={updateMealRow}
            moveMealRow={moveMealRow}
            generatePlan={generatePlan}
            exchanges={exchanges}
            mealPlanValidation={mealPlanValidation}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 bg-white py-5 mt-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 m-0">
            <strong>NutriCal</strong> · FEL Exchange Calculator
          </p>
          <p className="text-xs text-gray-400 m-0 mt-1">
            DOST-FNRI Food Exchange Lists for Meal Planning, 4th Ed. (2019) · Hamwi DBW · Activity factors 30–45 kcal/kg
          </p>
        </div>
      </footer>
    </div>
  );
}