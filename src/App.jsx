import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
import { useNutriCal, validatePatient, resetSession } from './hooks/useNutriCal';
import { downloadMealPlanPdf } from './lib/mealPlanPdf';
import PatientForm from './components/PatientForm';
import AssessmentDisplay from './components/AssessmentDisplay';
import ExchangeTable from './components/ExchangeTable';
import MealPlan from './components/MealPlan';
import MealPlanPrint from './components/MealPlanPrint';
import Stepper from './components/Stepper';
import RecapSidebar from './components/RecapSidebar';
import PrescriptionCompare from './components/PrescriptionCompare';
import PlanCompare from './components/PlanCompare';
import StarBackground from './components/StarBackground';
import StepHeading from './components/StepHeading';
import ConfirmDialog from './components/ConfirmDialog';

const TRASH_ICON = (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const SPARKLE_ICON = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
  </svg>
);

const STEPS = [
  { id: 'patient', num: '1', name: 'Patient' },
  { id: 'assessment', num: '2', name: 'Assessment' },
  { id: 'prescription', num: '3', name: 'Exchanges' },
  { id: 'meal-plan', num: '4', name: 'Meal Plan' },
];

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
  // Dark only: the starfield is unreadable in light mode and the toggle is hidden.
  const [theme, setTheme] = useState('dark');
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [confirmClear, setConfirmClear] = useState(null);
  const savingRef = useRef(false);

  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveFailed(false);
    try {
      await downloadMealPlanPdf(patient);
    } catch (err) {
      console.error(err);
      setSaveFailed(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [patient]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.getElementById(`step-heading-${step}`)?.focus();
  }, [step]);

  const handleCompute = useCallback(
    (onValid) => {
      const err = validatePatient(patient);
      setError(err);
      if (!err) onValid?.();
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

      <header className="sticky top-0 z-30 bg-surface dark:bg-white/[0.06] dark:backdrop-blur-xl border-b border-border dark:border-white/[0.08] no-print">
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
              className="icon-btn hidden"
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
            {Object.values(mealPlan).some((rows) => rows.length > 0) && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                aria-busy={saving}
                className="btn btn-primary no-print text-xs h-9 px-3 gap-1.5 min-w-32 cursor-pointer disabled:cursor-wait"
                title="Save meal plan as PDF"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Save size={14} aria-hidden="true" />
                )}
                {/* A failed library download stays failed until reload; the session survives one. */}
                {saving ? 'Preparing PDF…' : saveFailed ? 'Failed · Reload page' : 'Save meal plan'}
                {saveFailed && (
                  <span role="alert" className="sr-only">
                    Could not create the PDF. Reload the page and try again.
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-border dark:border-white/[0.08]">
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
            <StepHeading
              idx={0}
              num="1"
              title="Patient Information"
              hint="Enter the patient details to start the prescription."
              actions={
                <button
                  type="button"
                  onClick={() => setConfirmClear('all')}
                  className="btn btn-ghost text-sm cursor-pointer"
                  title="Clear the patient, exchanges and meal plan"
                >
                  {TRASH_ICON}
                  New patient
                </button>
              }
            />
            <PatientForm
              patient={patient}
              updatePatient={updatePatient}
              error={error}
            />
            {nav(null, 1, 'Continue to Assessment', false, handlePatientNext)}
            <AnimatePresence>
              {confirmClear === 'all' && (
                <ConfirmDialog
                  title="Start a new patient?"
                  description="This will clear the patient details, exchanges and meal plan. This action cannot be undone."
                  confirmLabel="Start new"
                  icon={TRASH_ICON}
                  onCancel={() => setConfirmClear(null)}
                  onConfirm={resetSession}
                />
              )}
            </AnimatePresence>
          </>
        ))}

        {/* Step 2: Assessment */}
        {section('assessment', (
          <>
            <StepHeading idx={1} num="2" title="Energy Assessment" hint="Hamwi DBW × activity factor determines the total energy requirement." />
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
            <StepHeading
              idx={2}
              num="3"
              title="Exchange Distribution"
              hint="Enter the number of exchanges for each food group."
              actions={
                assessment && exchangeData ? (
                  <>
                    <button
                      type="button"
                      onClick={suggestExchanges}
                      className="btn btn-soft text-sm cursor-pointer"
                      title="Auto-fill exchanges using the official FEL method"
                    >
                      {SPARKLE_ICON}
                      Suggest from targets
                    </button>
                    {Object.values(exchanges).some((v) => v > 0) && (
                      <button
                        type="button"
                        onClick={() => setConfirmClear('exchanges')}
                        className="btn btn-ghost text-sm cursor-pointer"
                        title="Reset all exchange values to 0"
                      >
                        {TRASH_ICON}
                        Clear all
                      </button>
                    )}
                  </>
                ) : undefined
              }
            />
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
                />
              )
            ) : (
              <div className="empty-state">Assessment results are required before entering exchanges.</div>
            )}
            {nav(1, 3, 'Continue to Meal Plan')}
            <AnimatePresence>
              {confirmClear === 'exchanges' && (
                <ConfirmDialog
                  title="Clear all exchanges?"
                  description="This will reset every food group to 0. This action cannot be undone."
                  confirmLabel="Clear all"
                  icon={TRASH_ICON}
                  onCancel={() => setConfirmClear(null)}
                  onConfirm={() => {
                    clearExchanges();
                    setConfirmClear(null);
                  }}
                />
              )}
            </AnimatePresence>
          </>
        ))}

        {/* Step 4: Meal Plan */}
        {section('meal-plan', (
          <>
            <div className="meal-plan-screen">
              <StepHeading
                idx={3}
                num="4"
                title="One-Day Meal Plan"
                hint="Distribute exchanges across meals."
                actions={
                  <>
                    {Object.values(exchanges).some((v) => v > 0) && (
                      <button
                        type="button"
                        onClick={generatePlan}
                        className="btn btn-soft text-sm cursor-pointer"
                        title="Auto-distribute exchanges across the five meals"
                      >
                        {SPARKLE_ICON}
                        Generate Plan
                      </button>
                    )}
                    {Object.values(mealPlan).some((rows) => rows.length > 0) && (
                      <button
                        type="button"
                        onClick={() => setConfirmClear('meal-plan')}
                        className="btn btn-ghost text-sm cursor-pointer"
                        title="Remove all meal rows"
                      >
                        {TRASH_ICON}
                        Clear all
                      </button>
                    )}
                  </>
                }
              />
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
                  mealPlanValidation={mealPlanValidation}
                />
              )}
              {nav(2, null)}
            </div>
            <AnimatePresence>
              {confirmClear === 'meal-plan' && (
                <ConfirmDialog
                  title="Clear all meals?"
                  description="This will remove every row from all five meals. This action cannot be undone."
                  confirmLabel="Clear all"
                  icon={TRASH_ICON}
                  onCancel={() => setConfirmClear(null)}
                  onConfirm={() => {
                    clearMealPlan();
                    setConfirmClear(null);
                  }}
                />
              )}
            </AnimatePresence>
          </>
        ))}
      </main>

      <MealPlanPrint mealPlan={mealPlan} patient={patient} />
    </div>
  );
}