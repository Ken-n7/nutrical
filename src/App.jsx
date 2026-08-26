import { useNutriCal } from './hooks/useNutriCal';
import PatientForm from './components/PatientForm';
import AssessmentDisplay from './components/AssessmentDisplay';
import ExchangeTable from './components/ExchangeTable';

export default function App() {
  const {
    patient, updatePatient,
    exchanges, updateExchange,
    assessment, exchangeData, error, setError,
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
    if (dist.length !== 3 || dist.some((n) => !Number.isFinite(n)) || Math.abs(dist.reduce((a, b) => a + b, 0) - 100) > 0.001) {
      setError('Macronutrient distribution must total 100%.');
      return;
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 antialiased">
      {/* Skip link for keyboard navigation */}
      <a href="#patient" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none">
        Skip to main content
      </a>

      {/* Header - traditional with clear branding */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-teal-700 text-white rounded flex items-center justify-center text-lg font-extrabold">N</span>
            <div className="leading-tight">
              <strong className="text-base font-bold text-gray-900">NutriCal</strong>
              <span className="block text-xs text-teal-600">FEL Exchange Calculator</span>
            </div>
          </div>

          <nav className="ml-auto flex items-center gap-1" aria-label="Primary navigation">
            <a href="#patient" className="px-3 py-2 text-sm font-semibold text-teal-700 rounded hover:bg-teal-50 transition-colors">Patient</a>
            <a href="#assessment" className="px-3 py-2 text-sm font-semibold text-teal-700 rounded hover:bg-teal-50 transition-colors">Assessment</a>
            <a href="#prescription" className="px-3 py-2 text-sm font-semibold text-teal-700 rounded hover:bg-teal-50 transition-colors">Exchanges</a>
          </nav>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary no-print ml-2"
          >
            Print Report
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-5 py-8 pb-16">
        <PatientForm
          patient={patient}
          updatePatient={updatePatient}
          error={error}
          onCompute={handleCompute}
        />
        <AssessmentDisplay assessment={assessment} />
        <ExchangeTable
          exchanges={exchanges}
          updateExchange={updateExchange}
          exchangeData={exchangeData}
          assessment={assessment}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="text-sm text-gray-600 m-0">
            <strong>NutriCal</strong> · FEL Exchange Calculator
          </p>
          <p className="text-xs text-gray-400 m-0 mt-2">
            References: DOST-FNRI Food Exchange Lists for Meal Planning, 4th Ed. (2019) · Hamwi DBW method · kcal/kg energy factors (30–45)
          </p>
        </div>
      </footer>
    </div>
  );
}
