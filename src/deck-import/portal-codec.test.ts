import { describe, expect, it } from 'vitest';
import { decodeDeckPortalUrl } from './portal-codec';

const url = 'https://shadowverse-wb.com/ja/deck/detail/?hash=1.3.cH3E.cH3E.cH3E.cfTu.cfTu.cfTu.e4Gg.e4Gg.e4Gg.eB7k.eB7k.eB7k.eBKO.eBKO.eBKO.eBpU.eBpU.eBpU.eBpe.eBpe.eBpe.fDXk.fKZk.fKZk.fKZk.fKcs.fKcs.fKcs.fKpM.fKpM.fKpM.fKsU.fKsU.fKsU.fL2-.fL2-.fL2-.fL38.fL38.fL38&lang=ja';
const qrUrl = 'https://shadowverse-wb.com/ja/deck/detail/?hash=1.3.e4Gg.e4Gg.e4Gg.eBpU.eBpU.eBpU.cH3E.cH3E.cH3E.cfTu.cfTu.cfTu.fDXk.eB7k.eB7k.eB7k.fKcs.fKcs.fKcs.fKpM.fKpM.fKpM.fKsU.fKsU.fKsU.fKZk.fKZk.fKZk.eBKO.eBKO.eBKO.fL2-.fL2-.fL2-.fL38.fL38.fL38.eBpe.eBpe.eBpe';
const sample = { classId: 3, battleFormat: 1, cards: [{ id: 10503210, name: '大遊戯世界', quantity: 3, cost: 1, type: 3, class: 3 }, { id: 999, name: '相承の意思', quantity: 1, cost: 2, type: 4, class: 3 }, ...Array.from({ length: 12 }, (_, index) => ({ id: index, name: `カード${index}`, quantity: 3, cost: 1, type: 1, class: 3 }))] };
const mockedFetch: typeof fetch = async () => new Response(JSON.stringify(sample), { status: 200 });

describe('Deck Portal proxy', () => {
  it('accepts the supplied 40-card URL', async () => {
    const deck = await decodeDeckPortalUrl(url, mockedFetch);
    expect(deck.total).toBe(40);
    expect(deck.cards).toHaveLength(14);
    expect(deck.cards.find((card) => card.name === '相承の意思')?.quantity).toBe(1);
  });
  it('normalizes QR and URL card order through the same resolver', async () => {
    expect((await decodeDeckPortalUrl(qrUrl, mockedFetch)).cards).toEqual((await decodeDeckPortalUrl(url, mockedFetch)).cards);
  });
});
