import { wilsonInterval, type MonteCarloResult } from './monte-carlo';

export type MulliganSimulationInput = { cardCounts: Array<{ id: number; quantity: number }>; targets: number[]; requireAll?: boolean; keep: number[]; keepLimit: number; trials?: number; seed?: number };

function next(seed: number) { let value = seed | 0; value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return value >>> 0; }

/** 任意キープ規則をカード実体単位で再現する。引き直し中は初手の同一実体を除外する。 */
export function simulateMulligan(input: MulliganSimulationInput): MonteCarloResult {
  const trials = input.trials ?? 100_000; const seed = input.seed ?? 0x5eed1234;
  if (!Number.isInteger(trials) || trials < 1 || !Number.isInteger(input.keepLimit) || input.keepLimit < 0 || input.cardCounts.some(card => !Number.isInteger(card.id) || !Number.isInteger(card.quantity) || card.quantity < 1)) throw new RangeError('マリガン近似計算の入力が不正です。');
  const deck = input.cardCounts.flatMap(card => Array.from({ length: card.quantity }, () => card.id));
  if (deck.length !== 40) throw new RangeError('マリガン近似計算は40枚デッキが必要です。');
  const targetSet = new Set(input.targets); const keepSet = new Set(input.keep);
  let state = seed >>> 0; let successes = 0; let total = 0;
  for (let trial = 0; trial < trials; trial += 1) {
    const remaining = [...deck]; const hand: number[] = [];
    for (let index = 0; index < 4; index += 1) { state = next(state); hand.push(remaining.splice(state % remaining.length, 1)[0]); }
    let kept = 0; const redraw = hand.map(card => keepSet.has(card) && kept++ < input.keepLimit ? card : null);
    for (let index = 0; index < redraw.filter((card) => card === null).length; index += 1) { state = next(state); const card = remaining.splice(state % remaining.length, 1)[0]; const slot = redraw.indexOf(null); redraw[slot] = card; }
    const hits = redraw.filter((card) => card !== null && targetSet.has(card)).length;
    if (input.requireAll ? hits === targetSet.size : hits > 0) successes += 1;
    total += hits;
  }
  const probability = successes / trials;
  return { probability, expected: total / trials, standardError: Math.sqrt(probability * (1 - probability) / trials), interval95: wilsonInterval(successes, trials), trials, seed: seed >>> 0 };
}
