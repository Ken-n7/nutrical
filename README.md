# NutriCal

A four-step diet calculator for nutritionist-dietitians, following the FNRI
*Food Exchange Lists for Meal Planning*:

1. **Patient** – age, sex, height, weight, body frame, activity level
2. **Assessment** – BMI, desirable body weight (Hamwi), total energy
   requirement (DBW × kcal/kg), macronutrient targets
3. **Exchanges** – food exchanges per group, checked against the targets
4. **Meal Plan** – exchanges spread over five meals, saved as a PDF

Everything runs in the browser. The current session is kept in
`sessionStorage`, so it survives a reload and is cleared when the tab closes.

## Commands

```sh
npm install
npm run dev        # local dev server
npm run build      # production build into dist/
npm run lint
npm test           # unit tests
npm run test:e2e   # browser tests; run `npm run build` first
```

## Where things live

- `src/hooks/useNutriCal.js` – all calculations and app state
- `src/data/mealPlanData.js` – food lists and meal-plan generation
- `src/components/` – one component per step, plus the summary sidebar
- `tests/` – Playwright end-to-end tests against the built app
