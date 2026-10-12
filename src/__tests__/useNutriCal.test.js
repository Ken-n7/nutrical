import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNutriCal, fmtInt, fmt1, fmtValue } from '../hooks/useNutriCal';
import { defaultFood } from '../data/mealPlanData';

const defaultPatient = {
  name: 'Maria Dela Cruz',
  age: '45',
  sex: 'female',
  frame: '1',
  heightFt: '5',
  heightIn: '1',
  weight: '150',
  activity: '35',
  distribution: '65,15,20',
};

function fillPatient(result) {
  act(() => {
    Object.entries(defaultPatient).forEach(([k, v]) => {
      result.current.updatePatient(k, v);
    });
  });
}

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
    it('rounds to a whole number with commas', () => {
      expect(fmt1(28.34)).toBe('28');
      expect(fmt1(28.5)).toBe('29');
      expect(fmt1(1000)).toBe('1,000');
      expect(fmt1(0)).toBe('0');
      expect(fmt1(NaN)).toBe('0');
    });
  });

  describe('fmtValue', () => {
    it('returns int format for whole numbers', () => {
      expect(fmtValue(5)).toBe('5');
      expect(fmtValue(5.0)).toBe('5');
    });

    it('rounds fractional numbers to whole numbers', () => {
      expect(fmtValue(2.5)).toBe('3');
      expect(fmtValue(3.333)).toBe('3');
      expect(fmtValue(3.9)).toBe('4');
    });
  });
});

describe('useNutriCal hook', () => {
  it('initializes with default patient data', () => {
    const { result } = renderHook(() => useNutriCal());
    expect(result.current.patient.name).toBe('');
    expect(result.current.patient.sex).toBe('female');
    expect(result.current.patient.age).toBe('25');
    expect(result.current.patient.weight).toBe('150');
    expect(result.current.patient.heightFt).toBe('5');
    expect(result.current.patient.heightIn).toBe('1');
    expect(result.current.patient.activity).toBe('35');
    expect(result.current.patient.frame).toBe('1');
  });

  it('initializes with zero exchanges', () => {
    const { result } = renderHook(() => useNutriCal());
    expect(result.current.exchanges.veg).toBe(0);
    expect(result.current.exchanges.fruit).toBe(0);
    expect(result.current.exchanges.milk).toBe(0);
    expect(result.current.exchanges.riceB).toBe(0);
    expect(result.current.exchanges.meatLow).toBe(0);
    expect(result.current.exchanges.meatMed).toBe(0);
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

    it('rounds fractional exchanges to whole numbers', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('fruit', '2.5');
      });
      expect(result.current.exchanges.fruit).toBe(3);
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

  describe('clearExchanges', () => {
    it('resets all exchanges to zero', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updateExchange('veg', '5');
        result.current.updateExchange('fruit', '2');
        result.current.updateExchange('meatLow', '4');
        result.current.updateExchange('fat', '3');
      });
      expect(result.current.exchanges.veg).toBe(5);
      act(() => {
        result.current.clearExchanges();
      });
      expect(result.current.exchanges).toEqual({
        veg: 0,
        fruit: 0,
        milkWhole: 0,
        milk: 0,
        milkSkim: 0,
        sugar: 0,
        riceA: 0,
        riceB: 0,
        riceC: 0,
        meatLow: 0,
        meatMed: 0,
        meatHigh: 0,
        fat: 0,
      });
    });
  });

  describe('clearMealPlan', () => {
    it('removes all rows from every meal', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.addMealRow('breakfast');
        result.current.addMealRow('lunch');
        result.current.addMealRow('lunch');
        result.current.addMealRow('supper');
      });
      expect(result.current.mealPlan.breakfast).toHaveLength(1);
      expect(result.current.mealPlan.lunch).toHaveLength(2);
      act(() => {
        result.current.clearMealPlan();
      });
      expect(result.current.mealPlan).toEqual({
        breakfast: [],
        amSnack: [],
        lunch: [],
        pmSnack: [],
        supper: [],
      });
    });
  });

  describe('assessment calculations', () => {
    it('computes BMI correctly', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      const { assessment } = result.current;
      expect(assessment).not.toBeNull();
      // 150 lb / 2.2 = 68.18 kg, 61 in = 154.94 cm -> BMI = 28.4
      expect(assessment.bmi).toBeCloseTo(28.4, 1);
    });

    it('classifies BMI as Overweight', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      expect(result.current.assessment.bmiInfo.label).toBe('Overweight');
    });

    it('computes DBW using Hamwi formula for female', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      const { dbw } = result.current.assessment;
      // Female: 100 + (1 * 5) = 105 lb base
      // 105 / 2.2 = 47.73 kg -> rounded to 48 kg
      expect(dbw.kg).toBe(48);
    });

    it('computes DBW using Hamwi formula for male', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updatePatient('sex', 'male');
      });
      const { dbw } = result.current.assessment;
      // Male: 106 + (1 * 6) = 112 lb base
      // 112 / 2.2 = 50.91 kg -> rounded to 51 kg
      expect(dbw.kg).toBe(51);
    });

    it('adjusts DBW for small frame', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updatePatient('frame', '0.9');
      });
      const { dbw } = result.current.assessment;
      // 105 * 0.9 / 2.2 = 42.95 kg -> rounded to 43 kg
      expect(dbw.kg).toBe(43);
    });

    it('adjusts DBW for large frame', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updatePatient('frame', '1.1');
      });
      const { dbw } = result.current.assessment;
      // 105 * 1.1 / 2.2 = 52.5 kg -> rounded to 53 kg
      expect(dbw.kg).toBe(53);
    });

    it('computes TER correctly', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      const { ter, af } = result.current.assessment;
      // DBW = 48 kg, AF = 35
      // TER = 48 * 35 = 1680 -> rounded to nearest 50 = 1700
      expect(ter).toBe(1700);
      expect(af).toBe(35);
    });

    it('computes macronutrient targets with 65/15/20 distribution', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      const { targetCho, targetProtein, targetFat, dist } = result.current.assessment;
      expect(dist).toEqual([65, 15, 20]);
      // Grams round to the nearest 5 (FEL step 3c)
      // CHO: 1700 * 0.65 / 4 = 276.25 -> 275 g
      expect(targetCho).toBe(275);
      // PRO: 1700 * 0.15 / 4 = 63.75 -> 65 g
      expect(targetProtein).toBe(65);
      // Fat: 1700 * 0.20 / 9 = 37.8 -> 40 g
      expect(targetFat).toBe(40);
    });

    it('computes TER with different activity factor', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updatePatient('activity', '40');
      });
      const { ter, af } = result.current.assessment;
      // DBW = 48, AF = 40
      // 48 * 40 = 1920 -> rounded to nearest 50 = 1900
      expect(ter).toBe(1900);
      expect(af).toBe(40);
    });

    it('returns null assessment for incomplete data', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('age', '');
        result.current.updatePatient('weight', '');
      });
      expect(result.current.assessment).toBeNull();
    });

    it('returns null assessment for out-of-range data', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => result.current.updatePatient('weight', '5'));
      expect(result.current.assessment).toBeNull();
      act(() => {
        result.current.updatePatient('weight', '150');
        result.current.updatePatient('heightFt', '3');
      });
      expect(result.current.assessment).toBeNull();
    });
  });

  describe('meal row ids', () => {
    it('never reuses a generated row id for an added row', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => result.current.suggestExchanges());
      act(() => result.current.generatePlan());
      act(() => result.current.addMealRow('breakfast'));
      const ids = result.current.mealPlan.breakfast.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('exchangeData calculations', () => {
    it('computes row data correctly after filling exchanges', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updateExchange('veg', '3');
      });
      const { exchangeData } = result.current;
      expect(exchangeData).not.toBeNull();
      // veg: 3 exchanges * 3 CHO = 9 CHO
      const vegRow = exchangeData.rows.find(r => r.key === 'veg');
      expect(vegRow.cho).toBe(9);
      expect(vegRow.protein).toBe(3);
      expect(vegRow.fat).toBe(0);
      expect(vegRow.kcal).toBe(48);
    });

    it('computes rice subtotal after filling exchanges', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updateExchange('riceA', '1');
        result.current.updateExchange('riceB', '5');
        result.current.updateExchange('riceC', '1');
      });
      const { exchangeData } = result.current;
      expect(exchangeData.riceCho).toBe(161);
      expect(exchangeData.riceProtein).toBe(14);
      expect(exchangeData.riceKcal).toBe(700);
    });

    it('computes meat subtotal after filling exchanges', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updateExchange('meatLow', '2');
        result.current.updateExchange('meatMed', '2');
      });
      const { exchangeData } = result.current;
      expect(exchangeData.meatProtein).toBe(32);
      expect(exchangeData.meatFat).toBe(14);
    });

    it('computes grand totals after filling exchanges', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      act(() => {
        result.current.updateExchange('veg', '3');
        result.current.updateExchange('fruit', '5');
        result.current.updateExchange('milk', '1');
        result.current.updateExchange('sugar', '3');
        result.current.updateExchange('riceA', '1');
        result.current.updateExchange('riceB', '5');
        result.current.updateExchange('riceC', '1');
        result.current.updateExchange('meatLow', '2');
        result.current.updateExchange('meatMed', '2');
        result.current.updateExchange('fat', '2');
      });
      const { exchangeData } = result.current;
      expect(exchangeData.totalN).toBe(25);
      expect(exchangeData.totalKcal).toBeGreaterThan(0);
    });

    it('computes target differences', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);
      const { exchangeData } = result.current;
      expect(typeof exchangeData.choDiff).toBe('number');
      expect(typeof exchangeData.proteinDiff).toBe('number');
      expect(typeof exchangeData.fatDiff).toBe('number');
      expect(typeof exchangeData.kcalDiff).toBe('number');
    });

    it('returns null when assessment is null', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('age', '');
        result.current.updatePatient('weight', '');
      });
      expect(result.current.exchangeData).toBeNull();
    });
  });

  // FNRI Food Exchange Lists, Part 1 worked example
  describe('FEL worked example', () => {
    it('prescribes 1500 kcal, CHO 245 g, protein 55 g, fat 35 g for a 50 kg sedentary adult', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        // Hamwi: 100 lb + 2 x 5 lb = 110 lb = 50 kg
        result.current.updatePatient('sex', 'female');
        result.current.updatePatient('heightFt', '5');
        result.current.updatePatient('heightIn', '2');
        result.current.updatePatient('frame', '1');
        result.current.updatePatient('activity', '30');
        result.current.updatePatient('distribution', '65,15,20');
      });
      const { dbw, ter, afLabel, targetCho, targetProtein, targetFat } = result.current.assessment;
      expect(dbw.kg).toBe(50);
      expect(afLabel).toBe('Sedentary');
      expect([ter, targetCho, targetProtein, targetFat]).toEqual([1500, 245, 55, 35]);
    });

    it('totals the Table 1.5 exchanges to 247 g CHO, 57 g protein, 34 g fat, 1522 kcal', () => {
      const { result } = renderHook(() => useNutriCal());
      const table15 = { veg: 3, fruit: 5, milkWhole: 1, sugar: 3, riceA: 1, riceB: 5, riceC: 1, meatLow: 2, meatMed: 2, fat: 2 };
      act(() => {
        for (const [key, n] of Object.entries(table15)) result.current.updateExchange(key, n);
      });
      const { totalCho, totalProtein, totalFat, totalKcal } = result.current.exchangeData;
      expect([totalCho, totalProtein, totalFat, totalKcal]).toEqual([247, 57, 34, 1522]);
    });
  });

  describe('meal row foods', () => {
    it('resets the food when the group changes, and copies a picked food', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => result.current.addMealRow('lunch'));
      const { id } = result.current.mealPlan.lunch[0];

      act(() => result.current.updateMealRow('lunch', id, 'group', 'riceA'));
      expect(result.current.mealPlan.lunch[0]).toMatchObject({ group: 'riceA', ...defaultFood('riceA') });

      act(() => result.current.updateMealRow('lunch', id, 'food', { name: 'Gabi (Taro)', measure: '¾ cup, cubed' }));
      expect(result.current.mealPlan.lunch[0]).toMatchObject({ name: 'Gabi (Taro)', measure: '¾ cup, cubed', custom: false });
    });

    it('repairs rows saved by an older build or damaged in storage', () => {
      sessionStorage.setItem(
        'nutrical-session',
        JSON.stringify({ mealPlan: { breakfast: [{ id: 7, group: 'riceA', foodIndex: 2, n: 2 }, { group: 'nope' }], lunch: 'junk' } })
      );
      const { result } = renderHook(() => useNutriCal());
      const { breakfast, lunch, supper } = result.current.mealPlan;
      expect(breakfast[0]).toMatchObject({ id: 7, group: 'riceA', n: 2, ...defaultFood('riceA') });
      expect(breakfast[1]).toMatchObject({ group: '', n: 1, name: '', measure: '' });
      expect(lunch).toEqual([]);
      expect(supper).toEqual([]);
    });
  });

  describe('half exchanges in meal rows', () => {
    it('snaps a row count to the nearest half', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => result.current.addMealRow('lunch'));
      const { id } = result.current.mealPlan.lunch[0];
      const set = (value) => {
        act(() => result.current.updateMealRow('lunch', id, 'n', value));
        return result.current.mealPlan.lunch[0].n;
      };
      expect(['0.5', '1.5', '1.3', '0.2', '', '-2', '99'].map(set)).toEqual([0.5, 1.5, 1.5, 0, 0, 0, 20]);
    });

    it('matches the book: vegetables as 1 + ½ + 1½ make the 3 prescribed (Table 1.6)', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => result.current.updateExchange('veg', 3));
      const perMeal = { breakfast: 1, lunch: 0.5, supper: 1.5 };
      for (const meal of Object.keys(perMeal)) act(() => result.current.addMealRow(meal));
      for (const [meal, n] of Object.entries(perMeal)) {
        const { id } = result.current.mealPlan[meal][0];
        act(() => result.current.updateMealRow(meal, id, 'n', n));
      }
      expect(result.current.mealPlanValidation.groups.veg).toMatchObject({ mealTotal: 3, valid: true });
    });
  });

  describe('session restore', () => {
    it('restores state on remount and keeps new row ids unique', () => {
      const first = renderHook(() => useNutriCal());
      act(() => first.result.current.updatePatient('name', 'Juan'));
      act(() => first.result.current.suggestExchanges());
      act(() => first.result.current.generatePlan());
      const saved = first.result.current.mealPlan;
      first.unmount();

      const { result } = renderHook(() => useNutriCal());
      expect(result.current.patient.name).toBe('Juan');
      expect(result.current.exchanges.veg).toBe(3);
      expect(result.current.mealPlan).toEqual(saved);

      act(() => result.current.addMealRow('breakfast'));
      const ids = result.current.mealPlan.breakfast.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('suggestExchanges', () => {
    it('spills past the per-group cap instead of falling short', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('sex', 'male');
        result.current.updatePatient('heightFt', '6');
        result.current.updatePatient('heightIn', '4');
        result.current.updatePatient('activity', '45');
      });
      act(() => result.current.suggestExchanges());

      expect(result.current.exchanges.riceB).toBe(20);
      expect(result.current.exchanges.riceA).toBeGreaterThan(0);
      // within half a rice exchange of the CHO target
      expect(Math.abs(result.current.exchangeData.choDiff)).toBeLessThanOrEqual(12);
    });

    it('fills exchanges using the FEL method when an assessment exists', () => {
      const { result } = renderHook(() => useNutriCal());
      fillPatient(result);

      act(() => {
        result.current.suggestExchanges();
      });

      const ex = result.current.exchanges;
      expect(ex.veg).toBe(3);
      expect(ex.fruit).toBe(3);
      expect(ex.milk).toBe(1);
      expect(ex.sugar).toBe(3);
      expect(ex.riceA).toBe(0);
      expect(ex.riceC).toBe(0);
      expect(ex.meatLow).toBe(0);
      expect(ex.meatHigh).toBe(0);

      for (const v of Object.values(ex)) {
        expect(v * 2).toBe(Math.round(v * 2));
        expect(v).toBeLessThanOrEqual(20);
      }

      const { exchangeData } = result.current;
      expect(exchangeData.totalCho).toBeGreaterThan(0);
      expect(exchangeData.totalProtein).toBeGreaterThan(0);
      expect(exchangeData.totalFat).toBeGreaterThan(0);
      expect(Math.abs(exchangeData.choDiff)).toBeLessThan(15);
      expect(Math.abs(exchangeData.proteinDiff)).toBeLessThan(15);
      expect(Math.abs(exchangeData.fatDiff)).toBeLessThan(15);
    });

    it('does nothing when assessment is null', () => {
      const { result } = renderHook(() => useNutriCal());
      act(() => {
        result.current.updatePatient('age', '');
        result.current.updatePatient('weight', '');
      });
      act(() => {
        result.current.suggestExchanges();
      });
      expect(result.current.exchanges.veg).toBe(0);
    });
  });
});
