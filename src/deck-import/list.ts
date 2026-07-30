import type { DecodedDeck, DeckCard } from './portal-codec';

/** カード名と枚数の貼り付けを、詳細版で使えるローカルデッキへ正規化する。 */
export function decodeDeckList(input: string): DecodedDeck {
  const rows = input.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
  if (!rows.length) throw new Error('カード名と枚数を1行ずつ貼り付けてください。');
  const merged = new Map<string, number>();
  for (const row of rows) {
    const match = row.match(/^(.+?)(?:\s*[x×*]\s*|\s+)(\d+)\s*$/i);
    if (!match) throw new Error(`「${row}」を読めません。例: カード名 3`);
    const name = match[1].trim(); const quantity = Number(match[2]);
    if (!name || !Number.isInteger(quantity) || quantity < 1 || quantity > 3) throw new Error(`「${row}」の枚数は1〜3で入力してください。`);
    merged.set(name, (merged.get(name) ?? 0) + quantity);
  }
  const cards: DeckCard[] = [...merged.entries()].sort(([a], [b]) => a.localeCompare(b, 'ja')).map(([name, quantity], index) => ({ id: -(index + 1), name, quantity, cost: null, type: null, class: null }));
  if (cards.some((card) => card.quantity > 3)) throw new Error('同名カードは3枚までです。');
  const total = cards.reduce((sum, card) => sum + card.quantity, 0);
  if (total !== 40) throw new Error(`合計${total}枚です。詳細版では40枚のデッキを入力してください。`);
  return { format: 'rotation', classId: 0, cards, total };
}
