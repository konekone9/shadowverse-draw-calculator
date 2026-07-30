import { describe, expect, it } from 'vitest';
import { decodeDeckPortalUrl } from './portal-codec';

const url = 'https://shadowverse-wb.com/ja/deck/detail/?hash=1.3.cH3E.cH3E.cH3E.cfTu.cfTu.cfTu.e4Gg.e4Gg.e4Gg.eB7k.eB7k.eB7k.eBKO.eBKO.eBKO.eBpU.eBpU.eBpU.eBpe.eBpe.eBpe.fDXk.fKZk.fKZk.fKZk.fKcs.fKcs.fKcs.fKpM.fKpM.fKpM.fKsU.fKsU.fKsU.fL2-.fL2-.fL2-.fL38.fL38.fL38&lang=ja';
const qrUrl = 'https://shadowverse-wb.com/ja/deck/detail/?hash=1.3.e4Gg.e4Gg.e4Gg.eBpU.eBpU.eBpU.cH3E.cH3E.cH3E.cfTu.cfTu.cfTu.fDXk.eB7k.eB7k.eB7k.fKcs.fKcs.fKcs.fKpM.fKpM.fKpM.fKsU.fKsU.fKsU.fKZk.fKZk.fKZk.eBKO.eBKO.eBKO.fL2-.fL2-.fL2-.fL38.fL38.fL38.eBpe.eBpe.eBpe';

describe('verified Deck Portal vector', () => {
  it('decodes the supplied URL into 40 cards', () => {
    const deck = decodeDeckPortalUrl(url);
    expect(deck.total).toBe(40);
    expect(deck.cards).toHaveLength(14);
    expect(deck.cards.find((card) => card.name === '相承の意思')?.quantity).toBe(1);
  });
  it('normalizes the QR URL despite a different card order', () => {
    expect(decodeDeckPortalUrl(qrUrl).cards).toEqual(decodeDeckPortalUrl(url).cards);
  });
});
