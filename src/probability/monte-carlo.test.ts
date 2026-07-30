import { describe, expect, it } from 'vitest';
import { simulateSimpleDraw, wilsonInterval } from './monte-carlo';
import { hypergeometric } from './hypergeometric';

describe('Monte Carlo probability', () => {
  it('is reproducible for a seed and contains the exact probability', () => {
    const first = simulateSimpleDraw(30, 3, 10, 100_000, 1234);
    const second = simulateSimpleDraw(30, 3, 10, 100_000, 1234);
    expect(first).toEqual(second);
    expect(first.interval95.low).toBeLessThan(hypergeometric(30, 3, 10).atLeastOne);
    expect(first.interval95.high).toBeGreaterThan(hypergeometric(30, 3, 10).atLeastOne);
  });
  it('calculates bounded Wilson intervals', () => {
    expect(wilsonInterval(0, 100).low).toBe(0);
    expect(wilsonInterval(100, 100).high).toBe(1);
  });
});
