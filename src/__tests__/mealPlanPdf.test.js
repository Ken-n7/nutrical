import { describe, it, expect } from 'vitest';
import { buildPdfFilename, localDateStamp } from '../lib/mealPlanPdf';

const FIXED_DATE = new Date('2026-09-16T12:00:00');
const STAMP = localDateStamp(FIXED_DATE);

describe('buildPdfFilename', () => {
  it('includes the patient name and today local date', () => {
    expect(buildPdfFilename('Juan Dela Cruz', FIXED_DATE)).toBe(
      `MealPlan-Juan-Dela-Cruz-${STAMP}.pdf`
    );
  });

  it('strips special characters and collapses dashes', () => {
    expect(buildPdfFilename("O'Brien, Jr. & Co.", FIXED_DATE)).toMatch(
      /MealPlan-O-Brien-Jr-Co-/
    );
  });

  it('falls back to MealPlan when name is empty', () => {
    expect(buildPdfFilename('', FIXED_DATE)).toBe(`MealPlan-${STAMP}.pdf`);
    expect(buildPdfFilename(null, FIXED_DATE)).toBe(`MealPlan-${STAMP}.pdf`);
    expect(buildPdfFilename(undefined, FIXED_DATE)).toBe(`MealPlan-${STAMP}.pdf`);
  });

  it('truncates long names to 50 characters', () => {
    const long = 'A'.repeat(100);
    const filename = buildPdfFilename(long, FIXED_DATE);
    const expectedLength = 'MealPlan-'.length + 50 + '-'.length + 'yyyy-mm-dd'.length + '.pdf'.length;
    expect(filename.length).toBe(expectedLength);
  });
});

describe('localDateStamp', () => {
  it('returns a zero-padded YYYY-MM-DD stamp', () => {
    expect(localDateStamp(FIXED_DATE)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('uses the supplied date, not the current date', () => {
    const local = localDateStamp(FIXED_DATE);
    const isoDate = FIXED_DATE.toISOString().slice(0, 10);
    expect(local).toBe(isoDate);
  });
});