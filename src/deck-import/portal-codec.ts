import { validateDeckPortalUrl } from './portal-url';

export type DeckCard = { code: string; name: string; quantity: number };
export type DecodedDeck = { format: 'rotation'; className: 'witch'; cards: DeckCard[]; total: number };

// This registry is generated from the verified Deck Portal vector in the test suite.
// Unknown codes intentionally fail closed until card-master data adds them.
const knownCards: Record<string, string> = {
  cH3E: '大遊戯世界', cfTu: '知恵の輝き', e4Gg: '睦まやかな団欒', eB7k: '鋼鉄の微睡み',
  eBKO: '余情の俳人', eBpU: '笑いの雷霆・ジンジャー', eBpe: '歩む〈愚者〉・リンクル', fDXk: '相承の意思',
  fKZk: 'ストームブラスト', fKcs: '明越花の転変', fKpM: 'マナリアスクリプター・ティコ',
  fKsU: 'ハッピーフラワー・サミー＆マリー', 'fL2-': '恩愛の大地・チトラ＆ティカ', fL38: '明滅花・アラ',
};

export function decodeDeckPortalUrl(input: string): DecodedDeck {
  const { hash } = validateDeckPortalUrl(input);
  const [format, classCode, ...codes] = hash.split('.');
  if (format !== '1') throw new Error('未知のフォーマットです。');
  if (classCode !== '3') throw new Error('この初期カードマスターではウィッチ以外を復号できません。');
  if (codes.length !== 40 || codes.some((code) => !/^[0-9A-Za-z_-]{4}$/.test(code))) throw new Error('40枚のDeck Portal hashではありません。');
  const unknown = codes.find((code) => !knownCards[code]);
  if (unknown) throw new Error(`未登録のカードコードです: ${unknown}`);
  const quantities = new Map<string, number>();
  codes.forEach((code) => quantities.set(code, (quantities.get(code) ?? 0) + 1));
  return {
    format: 'rotation', className: 'witch', total: codes.length,
    cards: [...quantities.entries()].map(([code, quantity]) => ({ code, name: knownCards[code], quantity })).sort((a, b) => a.name.localeCompare(b.name, 'ja')),
  };
}
