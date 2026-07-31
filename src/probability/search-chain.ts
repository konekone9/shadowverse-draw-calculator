import type { Effect } from '../cards/draw-effects';
import type { DeckCard } from '../deck-import/portal-codec';
import { matchesEffectFilter } from './search-effect';
import { wilsonInterval, type MonteCarloResult } from './monte-carlo';

export type SearchPlan = { effect: Effect; maxUses: number };
export type SearchChainInput = { cards: DeckCard[]; targets: number[]; requireAll: boolean; openingDraws: number; plan: SearchPlan[]; allowChain: boolean; trials?: number; seed?: number };

function next(seed: number) { let value = seed | 0; value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return value >>> 0; }
function pick<T>(items: T[], state: { value: number }) { state.value = next(state.value); return items.splice(state.value % items.length, 1)[0]; }

/** 観測済みの手札だけを使い、サーチで新たに得た効果カードは連鎖可能として評価する。 */
export function simulateSearchChain(input: SearchChainInput): MonteCarloResult {
  const trials = input.trials ?? 100_000; const seed = input.seed ?? 0x5eed1234;
  if (!Number.isInteger(trials) || trials < 1 || !Number.isInteger(input.openingDraws) || input.openingDraws < 0 || input.openingDraws > 40 || input.cards.reduce((sum, card) => sum + card.quantity, 0) !== 40 || !input.targets.length) throw new RangeError('サーチ連鎖計算の入力が不正です。');
  let state = seed >>> 0; let successes = 0; let hitsTotal = 0;
  const targetSet = new Set(input.targets);
  for (let trial = 0; trial < trials; trial += 1) {
    const deck = input.cards.flatMap(card => Array.from({ length: card.quantity }, () => card));
    const hand: DeckCard[] = [];
    for (let draw = 0; draw < input.openingDraws; draw += 1) hand.push(pick(deck, { get value() { return state; }, set value(value) { state = value; } }));
    const uses = new Map(input.plan.map(step => [step.effect.id, 0]));
    let changed = true;
    while (changed) {
      changed = false;
      for (const step of input.plan) {
        if ((uses.get(step.effect.id) ?? 0) >= step.maxUses) continue;
        const handIndex = hand.findIndex(card => card.id === step.effect.cardId);
        if (handIndex < 0) continue;
        hand.splice(handIndex, 1); uses.set(step.effect.id, (uses.get(step.effect.id) ?? 0) + 1); changed = true;
        const candidates = deck.filter(card => matchesEffectFilter(card, step.effect));
        const names = new Set<number>();
        for (let draw = 0; draw < step.effect.count && candidates.length; draw += 1) {
          const eligible = step.effect.distinct ? candidates.filter(card => !names.has(card.id)) : candidates;
          if (!eligible.length) break;
          const card = pick(eligible, { get value() { return state; }, set value(value) { state = value; } });
          const index = deck.indexOf(card); deck.splice(index, 1); hand.push(card); names.add(card.id);
        }
        if (!input.allowChain) changed = false;
        break;
      }
    }
    const hits = hand.filter(card => targetSet.has(card.id)).length;
    if (input.requireAll ? [...targetSet].every(id => hand.some(card => card.id === id)) : hits > 0) successes += 1;
    hitsTotal += hits;
  }
  const probability = successes / trials;
  return { probability, expected: hitsTotal / trials, standardError: Math.sqrt(probability * (1 - probability) / trials), interval95: wilsonInterval(successes, trials), trials, seed: seed >>> 0 };
}
