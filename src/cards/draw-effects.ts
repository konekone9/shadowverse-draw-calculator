export type CardFilter = { type?: 1|3|4; classId?: number; minCost?: number; cost?: number; cardId?: number };
export type Effect = { id: string; cardId: number; name: string; description: string; representative?: number; distinct?: boolean; count: number; filter: CardFilter };

export const drawEffects: Effect[] = [
  { id: '10632310:base', cardId: 10632310, name: '正常の侵食', description: 'ウィッチ・フォロワー2枚', representative: 1, count: 2, filter: { classId: 3, type: 1 } },
  { id: '10403120:enhance8', cardId: 10403120, name: '空の命運を握る少女・ルリア', description: 'コスト7以上のフォロワー1枚', representative: 2, count: 1, filter: { minCost: 7, type: 1 } },
  { id: '10403110:mode2', cardId: 10403110, name: '蒼い空を征く騎空士・グラン＆ジータ', description: 'フォロワー2枚', representative: 3, count: 2, filter: { type: 1 } },
  { id: '10353310:mode2', cardId: 10353310, name: '叫喚と憎悪 モード2（フォロワーサーチ）', description: 'フォロワー1枚', representative: 4, count: 1, filter: { type: 1 } },
  { id: '10353310:mode3', cardId: 10353310, name: '叫喚と憎悪 モード3（3コストスペルサーチ）', description: 'コスト3のスペル1枚', representative: 5, count: 1, filter: { cost: 3, type: 4 } },
  { id: '10002210:fanfare', cardId: 10002210, name: '冒険者のギルド', description: 'フォロワー1枚', count: 1, filter: { type: 1 } },
  { id: '10021310:base', cardId: 10021310, name: 'メイドの作法', description: 'ロイヤル・フォロワー2枚', count: 2, filter: { classId: 2, type: 1 } },
  { id: '10022120:super-evolve', cardId: 10022120, name: '魔煌のトリックスター・ラスティ', description: 'デッキ内の同名カードすべて', count: 40, filter: { cardId: 10022120 } },
  { id: '10051310:mode1', cardId: 10051310, name: 'カオティックカース', description: 'フォロワー1枚', count: 1, filter: { type: 1 } },
  { id: '10343310:awaken', cardId: 10343310, name: '蒼炎の猛威', description: 'ドラゴン・フォロワー1枚', count: 1, filter: { classId: 4, type: 1 } },
  { id: '10431110:fanfare', cardId: 10431110, name: '不可思議な哲学者・フィラソピラ', description: 'スペル1枚', count: 1, filter: { type: 4 } },
  { id: '10571120:fanfare', cardId: 10571120, name: '満開の技術屋', description: 'スペル1枚', count: 1, filter: { type: 4 } },
  { id: '10574120:fanfare', cardId: 10574120, name: '尽小花・イマリ ファンファーレ', description: 'スペル1枚', count: 1, filter: { type: 4 } },
  { id: '10574120:super-evolve', cardId: 10574120, name: '尽小花・イマリ 超進化', description: 'コスト1のスペル2種類', distinct: true, count: 2, filter: { cost: 1, type: 4 } },
  { id: '10621120:fanfare', cardId: 10621120, name: 'レイジーメイド', description: 'ロイヤル・フォロワー2枚', count: 2, filter: { classId: 2, type: 1 } },
  { id: '10701110:evolve', cardId: 10701110, name: 'ピュアリィキッズ', description: 'ニュートラル・カード1枚', count: 1, filter: { classId: 0 } },
  { id: '10761120:fanfare', cardId: 10761120, name: 'ブロードミッショナリー', description: 'アミュレット2枚', count: 2, filter: { type: 3 } },
];
