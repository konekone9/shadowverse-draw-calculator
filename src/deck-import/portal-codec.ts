import { validateDeckPortalUrl } from './portal-url';

export type DeckCard = { id: number; name: string; quantity: number; cost: number | null; type: number | null; class: number | null };
export type DecodedDeck = { format: 'rotation' | 'unlimited' | 'infinity' | 'starter'; classId: number; cards: DeckCard[]; total: number };

const proxyUrl = 'https://shadowverse-draw-deck-proxy.komekome1048576.workers.dev/deck';
const formats: Record<number, DecodedDeck['format']> = { 1: 'rotation', 2: 'unlimited', 3: 'infinity', 4: 'starter' };
type ProxyDeck = { classId: number; battleFormat: number; cards: DeckCard[] };

export async function decodeDeckPortalUrl(input: string, request: typeof fetch = fetch): Promise<DecodedDeck> {
  const { hash } = validateDeckPortalUrl(input);
  const response = await request(`${proxyUrl}?hash=${encodeURIComponent(hash)}`);
  if (!response.ok) throw new Error('公式Deck Portalからデッキを取得できませんでした。URLを確認して再試行してください。');
  const data = await response.json() as ProxyDeck;
  if (!Array.isArray(data.cards) || !Number.isInteger(data.classId) || !formats[data.battleFormat]) throw new Error('Deck Portalの応答を検証できませんでした。');
  const total = data.cards.reduce((sum, card) => sum + card.quantity, 0);
  if (total !== 40 || data.cards.some((card) => !Number.isInteger(card.id) || !Number.isInteger(card.quantity) || card.quantity < 1 || typeof card.name !== 'string')) throw new Error('40枚の有効なデッキではありません。');
  return { classId: data.classId, format: formats[data.battleFormat], cards: [...data.cards].sort((a, b) => a.name.localeCompare(b.name, 'ja')), total };
}
