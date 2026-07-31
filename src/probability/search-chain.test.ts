import { describe, expect, it } from 'vitest';
import type { Effect } from '../cards/draw-effects';
import { simulateSearchChain } from './search-chain';

const first: Effect = { id: 'first', cardId: 1, name: 'first', description: '', count: 1, filter: { cardId: 2 } };
const second: Effect = { id: 'second', cardId: 2, name: 'second', description: '', count: 1, filter: { cardId: 3 } };
const filler = (id: number) => ({ id, name: `X${id}`, quantity: 1, cost: 1, type: 1, class: 1 });
// xorshift seed=1 の最初の抽選は 40枚中 index=9 なので、そこへ first を置く。
const cards = [...Array.from({ length: 9 }, (_, index) => filler(index + 10)), { id: 1, name: 'A', quantity: 1, cost: 1, type: 1, class: 1 }, { id: 2, name: 'B', quantity: 1, cost: 1, type: 1, class: 1 }, { id: 3, name: 'C', quantity: 1, cost: 1, type: 1, class: 1 }, ...Array.from({ length: 28 }, (_, index) => filler(index + 30))];
describe('simulateSearchChain', () => {
  it('uses a newly searched effect card when chaining is enabled', () => {
    const input = { cards, targets: [3], requireAll: false, openingDraws: 1, plan: [{ effect: first, maxUses: 1 }, { effect: second, maxUses: 1 }], trials: 1, seed: 1 };
    expect(simulateSearchChain({ ...input, allowChain: true }).probability).toBe(1);
    expect(simulateSearchChain({ ...input, allowChain: false }).probability).toBe(0);
  });
});
