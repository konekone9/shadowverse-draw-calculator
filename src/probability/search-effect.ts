import type { Effect } from '../cards/draw-effects';
import type { DeckCard } from '../deck-import/portal-codec';
import { hypergeometric } from './hypergeometric';

export function matchesEffectFilter(card: DeckCard, effect: Effect) {
  const filter = effect.filter;
  return (filter.type === undefined || card.type === filter.type) && (filter.classId === undefined || card.class === filter.classId) && (filter.cost === undefined || card.cost === filter.cost) && (filter.minCost === undefined || (card.cost ?? -1) >= filter.minCost) && (filter.cardId === undefined || card.id === filter.cardId);
}

export type EffectChance = { candidates: number; targetCandidates: number; cardsDrawn: number; probability: number };
/** 効果がすでに使用可能な状態で、条件付きサーチを指定回数行った場合の到達率。 */
export function searchEffectChance(cards: DeckCard[], targetIds: number[], effect: Effect, uses: number): EffectChance {
  if (!Number.isInteger(uses) || uses < 0) throw new RangeError('使用回数が不正です。');
  const candidates = cards.filter(card => matchesEffectFilter(card, effect));
  const total = candidates.reduce((sum, card) => sum + card.quantity, 0);
  const targetCandidates = candidates.filter(card => targetIds.includes(card.id)).reduce((sum, card) => sum + card.quantity, 0);
  const cardsDrawn = Math.min(total, effect.count * uses);
  return { candidates: total, targetCandidates, cardsDrawn, probability: total && targetCandidates && cardsDrawn ? hypergeometric(total, targetCandidates, cardsDrawn).atLeastOne : 0 };
}
