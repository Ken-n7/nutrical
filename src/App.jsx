import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNutriCal, DEFAULT_DISTRIBUTION } from './hooks/useNutriCal';
import PatientForm from './components/PatientForm';
import AssessmentDisplay from './components/AssessmentDisplay';
import ExchangeTable from './components/ExchangeTable';
import MealPlan from './components/MealPlan';
import Stepper from './components/Stepper';
import RecapSidebar from './components/RecapSidebar';
import PrescriptionCompare from './components/PrescriptionCompare';
import PlanCompare from './components/PlanCompare';
import StarBackground from './components/StarBackground';

const STEPS = [
  { id: 'patient', num: '1', name: 'Patient' },
  { id: 'assessment', num: '2', name: 'Assessment' },
  { id: 'prescription', num: '3', name: 'Exchanges' },
  { id: 'meal-plan', num: '4', name: 'Meal Plan' },
];

const THEME_KEY = 'nutrical-theme';

function getInitialTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY) || 'null');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export default function App() {
  const {
    patient,
    updatePatient,
    exchanges,
    updateExchange,
    clearExchanges,
    mealPlan,
    addMealRow,
    removeMealRow,
    updateMealRow,
    moveMealRow,
    clearMealPlan,
    generatePlan,
    suggestExchanges,
    mealPlanValidation,
    assessment,
    exchangeData,
    error,
    setError,
  } = useNutriCal();

  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  useEffect(() => {
    document.getElementById(`step-heading-${step}`)?.focus();
  }, [step]);

  const handleCompute = useCallback(
    (onValid) => {
      const { age, heightFt, heightIn, weight, frame, activity, distribution } = patient;
      const totalInches = (parseInt(heightFt, 10) || 0) * 12 + (parseInt(heightIn, 10) || 0);
      const wtLbs = parseFloat(weight) || 0;
      const af = parseFloat(activity) || 35;
      const dist = (distribution || DEFAULT_DISTRIBUTION).split(',').map(Number);

      if (![parseFloat(age), totalInches, wtLbs, parseFloat(frame), af].every(Number.isFinite)) {
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
      onValid?.();
    },
    [patient, setError]
  );

  // Step gating: assessment unlocks everything after Patient.
  const unlockedIdx = { 0: true, 1: !!assessment, 2: !!assessment, 3: !!assessment };
  const locked = (i) => i > 0 && !assessment;

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const handlePatientNext = useCallback(() => {
    handleCompute(() => goNext());
  }, [handleCompute, goNext]);

  const section = (id, children) => (
    <section
      id={id}
      className={`wizard-step scroll-mt-20 ${step === STEPS.findIndex((s) => s.id === id) ? '' : 'hidden'}`}
      aria-hidden={step !== STEPS.findIndex((s) => s.id === id)}
    >
      {children}
    </section>
  );

  const stepHeading = (idx, num, title, hint) => (
    <div className="flex items-center gap-3 mb-4">
      <span className="stepper-dot stepper-dot--done">{num}</span>
      <div>
        <h2
          id={`step-heading-${idx}`}
          tabIndex={-1}
          className="text-lg font-bold text-gray-900 dark:text-white m-0 leading-tight outline-none"
        >
          {title}
        </h2>
        {hint && <p className="text-sm text-muted m-0">{hint}</p>}
      </div>
    </div>
  );

  const twoCol = (left, right) => (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
      <div className="min-w-0 space-y-4">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  );

  const nav = (backTo, nextTo, nextLabel, nextDisabled = false, onNext) => (
    <div className="flex justify-between items-center gap-3 mt-6 pt-5 border-t border-border no-print">
      {backTo != null ? (
        <button
          type="button"
          className="btn btn-ghost btn-nav-back"
          onClick={() => setStep(backTo)}
        >
          <ArrowLeft size={16} strokeWidth={2.5} aria-hidden="true" />
          Back
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
      {nextTo != null ? (
        <button
          type="button"
          className="btn btn-primary btn-continue"
          disabled={nextDisabled}
          onClick={() => (onNext ? onNext() : setStep(nextTo))}
        >
          {nextLabel}
          <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen text-text antialiased">
      <StarBackground />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only no-print focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 bg-surface border-b border-border no-print">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-extrabold">
              N
            </span>
            <div className="leading-tight">
              <strong className="text-sm font-bold text-gray-900 dark:text-white">NutriCal</strong>
              <span className="block text-[11px] text-primary">FEL Exchange Calculator</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="icon-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                </svg>
              )}
            </button>
            <button type="button" onClick={() => window.print()} className="btn-ghost no-print text-xs h-9 px-3">
              Print
            </button>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-1.5">
            <Stepper
              steps={STEPS}
              current={step}
              unlocked={unlockedIdx}
              onSelect={setStep}
              ariaBusy={locked(step + 1)}
            />
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-4 pt-6 pb-28 lg:pb-6">
        {/* Step 1: Patient */}
        {section('patient', (
          <>
            {stepHeading(0, '1', 'Patient Information', 'Enter the patient details to start the prescription.')}
            <PatientForm
              patient={patient}
              updatePatient={updatePatient}
              error={error}
            />
            {nav(null, 1, 'Continue to Assessment', false, handlePatientNext)}
          </>
        ))}

        {/* Step 2: Assessment */}
        {section('assessment', (
          <>
            {stepHeading(1, '2', 'Energy Assessment', 'Hamwi DBW × activity factor determines the total energy requirement.')}
            {twoCol(
              <RecapSidebar patient={patient} />,
              assessment && exchangeData ? (
                <AssessmentDisplay assessment={assessment} />
              ) : (
                <div className="empty-state">
                  Complete and validate patient information above to see BMI, DBW, and energy targets.
                </div>
              )
            )}
            {nav(0, 2, 'Continue to Exchanges', !assessment)}
          </>
        ))}

        {/* Step 3: Exchanges */}
        {section('prescription', (
          <>
            {stepHeading(2, '3', 'Exchange Distribution', 'Enter the number of exchanges for each food group.')}
            {assessment && exchangeData ? (
              twoCol(
                <RecapSidebar patient={patient} assessment={assessment}>
                  <PrescriptionCompare exchangeData={exchangeData} assessment={assessment} />
                </RecapSidebar>,
                <ExchangeTable
                  exchanges={exchanges}
                  updateExchange={updateExchange}
                  exchangeData={exchangeData}
                  assessment={assessment}
                  suggestExchanges={suggestExchanges}
                  clearExchanges={clearExchanges}
                />
              )
            ) : (
              <div className="empty-state">Assessment results are required before entering exchanges.</div>
            )}
            {nav(1, 3, 'Continue to Meal Plan')}
          </>
        ))}

        {/* Step 4: Meal Plan */}
        {section('meal-plan', (
          <>
            {stepHeading(3, '4', 'One-Day Meal Plan', 'Distribute exchanges across meals.')}
            {twoCol(
              <RecapSidebar patient={patient} assessment={assessment}>
                <PrescriptionCompare exchangeData={exchangeData} assessment={assessment} />
                <PlanCompare validation={mealPlanValidation} exchanges={exchanges} />
              </RecapSidebar>,
              <MealPlan
                mealPlan={mealPlan}
                addMealRow={addMealRow}
                removeMealRow={removeMealRow}
                updateMealRow={updateMealRow}
                moveMealRow={moveMealRow}
                generatePlan={generatePlan}
                clearMealPlan={clearMealPlan}
                exchanges={exchanges}
                mealPlanValidation={mealPlanValidation}
              />
            )}
            {nav(2, null)}
          </>
        ))}
      </main>
    </div>
  );
}