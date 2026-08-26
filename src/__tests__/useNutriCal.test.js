import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNutriCal, fmtInt, fmt1, fmtValue } from '../hooks/useNutriCal';

describe('Formatter utilities', () => {
  describe('fmtInt', () => {
    it('rounds and formats integers with commas', () => {
      expect(fmtInt(1670)).toBe('1,670');
      expect(fmtInt(1670.4)).toBe('1,670');
      expect(fmtInt(1670.6)).toBe('1,671');
      expect(fmtInt(0)).toBe('0');
      expect(fmtInt(NaN)).toBe('0');
    });
  });

  describe('fmt1', () => {
    it('formats to 1 decimal place with commas', () => {
      expect(fmt1(28.34)).toBe('28.3');
      expect(fmt1(28.36)).toBe('28.4');
      expect(fmt1(1000)).toBe('1,000.0');
      expect(fmt1(0)).toBe('0.0');
      expect(fmt1(NaN)).toBe('0.0');
    });
  });

  describe('fmtValue', () => {
    it('returns int format for whole numbers', () => {
      expect(fmtValue(5)).toBe('5');
      expect(fmtValue(5.0)).toBe('5');
    });

    it('returns decimal format for fractional numbers', () => {
      expect(fmtValue(2.5)).toBe('2.5');
      expect(fmtValue(3.333)).toBe('3.3');
    });
  });
});

describe('useNutriCal hook', () => {
  it('initializes with default patient data', () => {
    const { result } = renderHook(() => useNutriCal());
    expect(result.current.patient.name).toBe('Maria Dela Cruz');
    expect(result.current.patient.sex).toBe('female');
    expect(result.current.patient.age).toBe(45);
    expect(result.current.patient.heightFt).toBe(5);
    expect(result.current.patient.heightIn).toBe(1);
    expect(result.current.patient.weight).toBe(150);
    expect(result.current.patient.activity).toBe(35);
    expect(result.current.patient.frame).toBe(1);
  });

  it('initializes with default exchanges', () => {
    const { result } = renderHook(() => useNutriCal());
    expect(result.current.exchanges.veg).toBe(3);
    expect(result.current.exchanges.fruit).toBe(5);
    expect(result.current.exchanges.milk).toBe(1);
    expect(result.current.exchanges.riceB).toBe(5);
    expect(result.current.exchanges.meatLow).toBe(2);
    expect(result.current.exchanges.meatMed).toBe(2);
    expect(result.current.exchanges.meatHigh).toBe(0);
  });

  describe('updatePatient', () => {
    it('updates a single patient field', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('sex', 'male');
      });
      expect(result.current.patient.sex).toBe('male');
    });

    it('clears error when patient is updated', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.setError('test error');
      });
      expect(result.current.error).toBe('test error');
      act(() => {
        result.current.updatePatient('age', 30);
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('updateExchange', () => {
    it('updates an exchange value', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('veg', '5');
      });
      expect(result.current.exchanges.veg).toBe(5);
    });

    it('handles fractional exchanges', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('fruit', '2.5');
      });
      expect(result.current.exchanges.fruit).toBe(2.5);
    });

    it('defaults to 0 for invalid values', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('veg', '');
      });
      expect(result.current.exchanges.veg).toBe(0);
    });

    it('defaults to 0 for negative values', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('veg', '-3');
      });
      expect(result.current.exchanges.veg).toBe(0);
    });
  });

  describe('assessment calculations', () => {
    it('computes BMI correctly for default patient', () => {
      const { result } = renderHook(() => useNutriCal());
      const { assessment } = result.current;
      expect(assessment).not.toBeNull();
      // 150 lb = 68.03 kg, 61 in = 154.94 cm -> BMI = 68.03 / (1.5494^2) = 28.3
      expect(assessment.bmi).toBeCloseTo(28.3, 1);
    });

    it('classifies BMI as Overweight for default patient', () => {
      const { result } = renderHook(() => useNutriCal());
      expect(result.current.assessment.bmiInfo.label).toBe('Overweight');
    });

    it('computes DBW using Hamwi formula for female', () => {
      const { result } = renderHook(() => useNutriCal());
      const { dbw } = result.current.assessment;
      // Female: 100 + (1 * 5) = 105 lb base
      // 105 / 2.2 = 47.73 kg (frame=1)
      expect(dbw.kg).toBeCloseTo(47.73, 0);
    });

    it('computes DBW using Hamwi formula for male', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('sex', 'male');
      });
      const { dbw } = result.current.assessment;
      // Male: 106 + (1 * 6) = 112 lb base
      // 112 / 2.2 = 50.91 kg (frame=1)
      expect(dbw.kg).toBeCloseTo(50.91, 0);
    });

    it('adjusts DBW for small frame', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('frame', '0.9');
      });
      const { dbw } = result.current.assessment;
      // 105 * 0.9 / 2.2 = 42.95 kg
      expect(dbw.kg).toBeCloseTo(42.95, 0);
    });

    it('adjusts DBW for large frame', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('frame', '1.1');
      });
      const { dbw } = result.current.assessment;
      // 105 * 1.1 / 2.2 = 52.5 kg
      expect(dbw.kg).toBeCloseTo(52.5, 0);
    });

    it('computes TER correctly', () => {
      const { result } = renderHook(() => useNutriCal());
      const { ter, dbw, af } = result.current.assessment;
      // DBW = 47.73 kg, AF = 35
      // TER raw = 47.73 * 35 = 1670.5 -> rounded = 1670
      expect(ter).toBe(1670);
      expect(af).toBe(35);
    });

    it('computes macronutrient targets with 65/15/20 distribution', () => {
      const { result } = renderHook(() => useNutriCal());
      const { ter, targetCho, targetChon, targetFat, dist } = result.current.assessment;
      expect(dist).toEqual([65, 15, 20]);
      // CHO: 1670 * 0.65 / 4 = 271.4 g
      expect(targetCho).toBeCloseTo(271.4, 0);
      // CHON: 1670 * 0.15 / 4 = 62.6 g
      expect(targetChon).toBeCloseTo(62.6, 0);
      // Fat: 1670 * 0.20 / 9 = 37.1 g
      expect(targetFat).toBeCloseTo(37.1, 0);
    });

    it('computes TER with different activity factor', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('activity', '40');
      });
      const { ter, af } = result.current.assessment;
      // DBW = 47.73, AF = 40
      // 47.73 * 40 = 1909.2 -> rounded = 1910
      expect(ter).toBe(1910);
      expect(af).toBe(40);
    });

    it('returns null assessment for incomplete data', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('age', '');
      });
      expect(result.current.assessment).toBeNull();
    });
  });

  describe('exchangeData calculations', () => {
    it('computes row data correctly', () => {
      const { result } = renderHook(() => useNutriCal());
      const { exchangeData } = result.current;
      expect(exchangeData).not.toBeNull();
      // veg: 3 exchanges * 3 CHO = 9 CHO
      const vegRow = exchangeData.rows.find(r => r.key === 'veg');
      expect(vegRow.cho).toBe(9);
      expect(vegRow.chon).toBe(3);
      expect(vegRow.fat).toBe(0);
      expect(vegRow.kcal).toBe(48);
    });

    it('computes rice subtotal', () => {
      const { result } = renderHook(() => useNutriCal());
      const { exchangeData } = result.current;
      // riceA: 1 * 23 = 23 CHO, riceB: 5 * 23 = 115 CHO, riceC: 1 * 23 = 23 CHO
      expect(exchangeData.riceCho).toBe(161); // 23 + 115 + 23
      expect(exchangeData.riceChon).toBe(14); // 0 + 10 + 4
      expect(exchangeData.riceKcal).toBe(700); // 92 + 500 + 108
    });

    it('computes meat subtotal', () => {
      const { result } = renderHook(() => useNutriCal());
      const { exchangeData } = result.current;
      // meatLow: 2 * 8 = 16 CHON, 2 * 1 = 2 fat
      // meatMed: 2 * 8 = 16 CHON, 2 * 6 = 12 fat
      expect(exchangeData.meatChon).toBe(32);
      expect(exchangeData.meatFat).toBe(14);
    });

    it('computes grand totals', () => {
      const { result } = renderHook(() => useNutriCal());
      const { exchangeData } = result.current;
      expect(exchangeData.totalN).toBe(25); // sum of all exchanges: 3+5+1+3+1+5+1+2+2+0+2
      expect(exchangeData.totalKcal).toBeGreaterThan(0);
    });

    it('computes target differences', () => {
      const { result } = renderHook(() => useNutriCal());
      const { exchangeData } = result.current;
      expect(typeof exchangeData.choDiff).toBe('number');
      expect(typeof exchangeData.chonDiff).toBe('number');
      expect(typeof exchangeData.fatDiff).toBe('number');
      expect(typeof exchangeData.kcalDiff).toBe('number');
    });

    it('returns null when assessment is null', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('age', '');
      });
      expect(result.current.exchangeData).toBeNull();
    });
  });
});
