import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodBank } from '../hooks/useFoodBank';

describe('useFoodBank', () => {
  it('saves, replaces by name, removes, and survives a remount', () => {
    const first = renderHook(() => useFoodBank());
    let stored;
    act(() => {
      stored = first.result.current.saveFood('riceB', { name: '  Champorado ', measure: ' 1 cup ' });
    });
    expect(stored).toEqual({ name: 'Champorado', measure: '1 cup' });
    act(() => first.result.current.saveFood('riceB', { name: 'champorado', measure: '½ cup' }));
    act(() => first.result.current.saveFood('fat', { name: 'Gata', measure: '1 Tbsp' }));
    expect(first.result.current.bank.riceB).toEqual([{ name: 'champorado', measure: '½ cup' }]);
    first.unmount();

    const { result } = renderHook(() => useFoodBank());
    expect(result.current.bank.fat).toEqual([{ name: 'Gata', measure: '1 Tbsp' }]);
    act(() => result.current.removeFood('fat', 'Gata'));
    expect(result.current.bank.fat).toEqual([]);
    expect(result.current.bank.riceB).toHaveLength(1);
  });

  it('refuses a food without a name, a measure, or a known group', () => {
    const { result } = renderHook(() => useFoodBank());
    act(() => {
      expect(result.current.saveFood('veg', { name: ' ', measure: '1 cup' })).toBeNull();
      expect(result.current.saveFood('veg', { name: 'Okra', measure: '' })).toBeNull();
      expect(result.current.saveFood('nope', { name: 'Okra', measure: '1 cup' })).toBeNull();
    });
    expect(result.current.bank.veg).toEqual([]);
  });

  it('keeps only well-formed foods from storage, and survives garbage', () => {
    localStorage.setItem(
      'nutrical-my-foods',
      JSON.stringify({ veg: [{ name: 5 }, 'x', null, { name: 'Okra', measure: '1 cup' }], fruit: 'junk', nope: [{ name: 'A', measure: 'B' }] })
    );
    expect(renderHook(() => useFoodBank()).result.current.bank).toMatchObject({
      veg: [{ name: 'Okra', measure: '1 cup' }],
      fruit: [],
    });

    localStorage.setItem('nutrical-my-foods', '{not json');
    expect(renderHook(() => useFoodBank()).result.current.bank.veg).toEqual([]);
  });
});
