# NutriCal — Release Notes

**Version:** 1.0.0
**Release Date:** September 16, 2026

---

## What's New

### Meal Plans

- **Save as PDF** — export a formatted, patient-named meal plan file (`MealPlan-{Patient}-{Date}.pdf`) from any wizard step via the global save button.
- **Whole-exchange rounding** — daily exchange targets now round to whole servings for clarity.

### Experience

- **Starfield background** — a calm animated star canvas with a glass header that blends seamlessly behind app content.
- **Tooltips** — consistent hover tooltips across the app, replacing inline CSS variants.
- **Clear-all buttons** — one-tap reset for exchanges and meal plan, each guarded by a confirmation dialog that locks page scroll to prevent viewport shift.
- **Error boundary** — graceful crash recovery instead of a blank page.

### Layout & Mobile

- **Side-by-side layout** — meal plan and exchanges sit side by side on wide screens.
- **Mobile polish** — sidebar sheet peeks above the fold, swipe-to-open works on tall steps, page no longer overflows or drifts behind the sheet, touch devices hide tooltips.

## Fixes

- Resolved stale meal-plan state due to a scope-closure bug in exchange distribution.
- Guarded plan comparison against missing validation groups.
- Normalized activity/frame inputs to consistent string types.
- Hidden the theme toggle while the starfield only renders well in dark mode.

## Engineering

- Extracted shared constants (`EXCHANGE_MAX`, `DEFAULT_DISTRIBUTION`) and dedicated PDF, print, and tooltip modules so the main bundle stays lean with lazy-loaded PDF libraries.
- Expanded unit and end-to-end test coverage, including an eight-device mobile swipe QA suite asserting zero findings.