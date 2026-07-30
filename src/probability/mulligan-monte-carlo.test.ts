import { describe, expect, it } from 'vitest';
import { simulateMulligan } from './mulligan-monte-carlo';

const cards = Array.from({ length: 20 }, (_, index) => ({ id: index + 1, quantity: 2 }));
describe('simulateMulligan', () => {
  it('is deterministic and reports a Wilson interval', () => {
    const input = { cardCounts: cards, targets: [1], keep: [1], keepLimit: 4, trials: 10_000, seed: 7 };
    const first = simulateMulligan(input); const second = simulateMulligan(input);
    expect(first).toEqual(second);
    expect(first.interval95.low).toBeLessThanOrEqual(first.probability);
    expect(first.interval95.high).toBeGreaterThanOrEqual(first.probability);
  });
  it('uses OR or AND target conditions as requested', () => {
    const base = { cardCounts: cards, targets: [1, 2], keep: [], keepLimit: 0, trials: 20_000, seed: 8 };
    expect(simulateMulligan({ ...base, requireAll: false }).probability).toBeGreaterThan(simulateMulligan({ ...base, requireAll: true }).probability);
  });
});
