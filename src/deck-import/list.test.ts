import { describe, expect, it } from 'vitest';
import { decodeDeckList } from './list';

describe('decodeDeckList', () => {
  it('merges names and validates a 40-card list', () => {
    const input = Array.from({ length: 20 }, (_, index) => `カード${index + 1} 2`).join('\n');
    const deck = decodeDeckList(input);
    expect(deck.total).toBe(40);
    expect(deck.cards).toHaveLength(20);
  });
  it('rejects invalid quantities and non-40-card lists', () => {
    expect(() => decodeDeckList('カードA 4')).toThrow('1〜3');
    expect(() => decodeDeckList('カードA 3')).toThrow('合計3枚');
  });
});
