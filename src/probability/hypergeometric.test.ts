import { describe, expect, it } from 'vitest';
import { filteredSearchSuccess, hypergeometric, targetOnlyKeepMulligan } from './hypergeometric';

describe('hypergeometric', () => {
  it('calculates the specified 30 / 3 / 10 example', () => {
    expect(hypergeometric(30, 3, 10).atLeastOne * 100).toBeCloseTo(71.921182266, 8);
  });
  it('handles edge cases', () => {
    expect(hypergeometric(30, 0, 10).atLeastOne).toBe(0);
    expect(hypergeometric(30, 3, 0).atLeastOne).toBe(0);
    expect(hypergeometric(30, 1, 30).atLeastOne).toBe(1);
    expect(filteredSearchSuccess(0, 0, 2)).toBe(0);
  });

  it('calculates target-only keep mulligans as a normalized distribution', () => {
    const result = targetOnlyKeepMulligan(30, 3, 10);
    expect(result.exact.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(result.atLeastOne).toBeGreaterThan(hypergeometric(30, 3, 10).atLeastOne);
    expect(targetOnlyKeepMulligan(30, 0, 10).atLeastOne).toBe(0);
  });
});
