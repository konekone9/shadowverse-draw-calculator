import { describe, expect, it } from 'vitest';
import { drawEffects } from '../cards/draw-effects';
import { searchEffectChance } from './search-effect';

const cards = [
  { id: 1, name: '目的フォロワー', quantity: 3, cost: 2, type: 1, class: 3 },
  { id: 2, name: '対象外', quantity: 7, cost: 2, type: 4, class: 3 },
];
describe('searchEffectChance', () => {
  it('uses the structured filter and repeated search count', () => {
    const effect = drawEffects.find(effect => effect.id === '10632310:base')!;
    expect(searchEffectChance(cards, [1], effect, 1)).toMatchObject({ candidates: 3, targetCandidates: 3, cardsDrawn: 2, probability: 1 });
  });
});
