import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { drawEffects } from './cards/draw-effects';
import { decodeDeckPortalUrl, type DecodedDeck } from './deck-import/portal-codec';
import { drawsToReach, filteredSearchSuccess, hypergeometric } from './probability/hypergeometric';
import './styles.css';

const percent = (value: number) => `${(value * 100).toFixed(4)}%`;
const number = (value: number) => Number.isFinite(value) ? value : 0;

function NumericInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange(value: number): void }) {
  return <label className="field"><span>{label}</span><input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(min, number(e.currentTarget.valueAsNumber))))} /></label>;
}

function Simple() {
  const [deck, setDeck] = useState(30); const [targets, setTargets] = useState(3); const [draws, setDraws] = useState(10);
  const [openSearch, setOpenSearch] = useState(false); const [candidates, setCandidates] = useState(10); const [searchTargets, setSearchTargets] = useState(3); const [searchDraws, setSearchDraws] = useState(1);
  const result = useMemo(() => hypergeometric(deck, Math.min(targets, deck), Math.min(draws, deck)), [deck, targets, draws]);
  const curve = useMemo(() => Array.from({ length: deck + 1 }, (_, x) => hypergeometric(deck, Math.min(targets, deck), x).atLeastOne), [deck, targets]);
  return <main><section className="hero"><p className="eyebrow">SIMPLE</p><h1>すぐにドロー確率を計算</h1><p>現在の山札から、目的カードに到達する確率を厳密計算します。</p></section>
    <section className="panel inputs"><NumericInput label="現在の山札枚数" value={deck} min={1} max={40} onChange={setDeck}/><NumericInput label="目的カード残存枚数" value={Math.min(targets, deck)} min={0} max={deck} onChange={setTargets}/><NumericInput label="掘る枚数" value={Math.min(draws, deck)} min={0} max={deck} onChange={setDraws}/></section>
    <section className="result" aria-live="polite"><div><span>1枚以上引く確率</span><strong>{percent(result.atLeastOne)}</strong></div><div><span>期待枚数</span><strong>{result.expected.toFixed(3)} 枚</strong></div><div><span>計算方式</span><strong>厳密計算</strong></div></section>
    <details className="panel"><summary>分布・到達曲線・計算根拠</summary><div className="detail-grid"><div><h2>引ける枚数の分布</h2>{result.exact.map((p, x) => <p key={x}>{x === 3 ? '3枚以上を含む' : `${x}枚`}: <b>{percent(x < 3 ? p : result.exact.slice(3).reduce((a, b) => a + b, 0))}</b></p>)}</div><div><h2>必要な掘る枚数</h2>{[.5,.8,.9].map(t => <p key={t}>{t * 100}% 到達: <b>{drawsToReach(deck, Math.min(targets, deck), t) ?? '到達不可'} 枚</b></p>)}<div className="curve" aria-label="到達曲線">{curve.map((p, i) => <i key={i} style={{ height: `${p * 100}%` }} title={`${i}枚: ${percent(p)}`}/>)}</div></div></div><p className="assumption">通常ドローは非復元抽出として超幾何分布で計算しています。</p></details>
    <details className="panel" open={openSearch} onToggle={(e) => setOpenSearch(e.currentTarget.open)}><summary>サーチ設定（任意）</summary><div className="inputs"><NumericInput label="サーチ候補総数" value={candidates} min={0} max={40} onChange={setCandidates}/><NumericInput label="候補内の目的カード数" value={Math.min(searchTargets,candidates)} min={0} max={candidates} onChange={setSearchTargets}/><NumericInput label="1回で引く枚数" value={searchDraws} min={1} max={40} onChange={setSearchDraws}/></div><p>このサーチで1枚以上目的カードを引く確率: <b>{percent(filteredSearchSuccess(candidates, Math.min(searchTargets,candidates), searchDraws))}</b></p><p className="assumption">条件付きサーチは、対象カードを引いた時点で使用可能として計算しています。PP、盤面、進化、カード固有の発動条件を実戦で満たせない場合があるため、実際の到達確率とは異なる可能性があります。</p></details>
  </main>;
}

function Advanced() {
  const [method, setMethod] = useState<'url'|'list'>('url'); const [text, setText] = useState(''); const [message, setMessage] = useState(''); const [deck, setDeck] = useState<DecodedDeck | null>(null);
  const [step, setStep] = useState(1);
  const importDeck = () => { try { if (method === 'url') { const decoded = decodeDeckPortalUrl(text); setDeck(decoded); setMessage(`${decoded.className}・${decoded.total}枚のデッキを読み込みました。`); } else { const lines = text.trim().split(/\n+/).filter(Boolean); if (!lines.length) throw new Error('カード名と枚数を貼り付けてください。'); setMessage(`${lines.length}行を読み込みました。カードマスター照合は公開データ更新後に行います。`); } setStep(2); } catch (error) { setDeck(null); setMessage(error instanceof Error ? error.message : '読み込みに失敗しました。'); } };
  return <main><section className="hero"><p className="eyebrow">ADVANCED</p><h1>デッキから詳細に計算</h1><p>複数目的、マリガン、条件付きサーチを段階的に設定します。</p></section><ol className="steps">{['デッキ入力','開始状態','目的条件','マリガン','サーチ設定'].map((x,i)=><li className={step===i+1?'active':''} key={x}>{i+1}. {x}</li>)}</ol>
    <section className="panel"><h2>1. デッキ入力</h2><div className="tabs"><button className={method==='url'?'selected':''} onClick={()=>setMethod('url')}>Deck Portal URL</button><button className={method==='list'?'selected':''} onClick={()=>setMethod('list')}>カード名と枚数</button></div>{method==='url'?<><label className="field"><span>完全な Deck Portal URL</span><input value={text} placeholder="https://shadowverse-wb.com/ja/deck/detail/?hash=..." onChange={e=>setText(e.target.value)}/></label><p className="hint">生のhash文字列は受け付けません。</p></>:<label className="field"><span>カード名と枚数（1行ずつ）</span><textarea value={text} placeholder={'カード名 3\n別のカード 3'} onChange={e=>setText(e.target.value)}/></label>}<button className="primary" onClick={importDeck}>読み込む</button>{message && <p role="status" className="message">{message}</p>}{deck && <ul className="deck-list">{deck.cards.map(card => <li key={card.code}><span>{card.name}</span><b>×{card.quantity}</b></li>)}</ul>}</section>
    <section className="panel"><h2>対応済みサーチ効果（17件）</h2><p className="hint">カードごとではなく効果ごとに表示します。利用時は前提条件が成立済みとして計算されます。</p><div className="effects">{drawEffects.map(effect=><article key={effect.id}><b>{effect.representative ? `代表${effect.representative} ` : ''}{effect.name}</b><span>{effect.description}</span><label><input type="checkbox"/> 有効にする</label></article>)}</div></section>
    <section className="panel"><h2>マリガン</h2><div className="tabs">{['全キープ','全返し','目的カードだけキープ','目的カードとサーチカードをキープ'].map(x=><button key={x}>{x}</button>)}</div><p className="hint">カスタムのカテゴリ上限、セット条件、ユーザー定義条件はカード実体単位の状態エンジンとともに提供します。</p></section>
  </main>;
}

function App() { const [page, setPage] = useState<'home'|'simple'|'advanced'|'cards'|'guide'>('home'); return <><header><button className="brand" onClick={()=>setPage('home')}>ドロー確率計算機</button><nav><button onClick={()=>setPage('simple')}>簡易版</button><button onClick={()=>setPage('advanced')}>詳細版</button><button onClick={()=>setPage('cards')}>対応カード</button><button onClick={()=>setPage('guide')}>使い方</button></nav></header>{page==='home'&&<main><section className="hero home"><p className="eyebrow">SHADOWVERSE: WORLDS BEYOND</p><h1>欲しいカードを、引ける確率。</h1><p>同じ正確な計算基盤で、すぐ答えを知る簡易版と、デッキを深く検証する詳細版を用意しました。</p><div className="choices"><button onClick={()=>setPage('simple')}><b>簡易版</b><span>残り山札・対象・掘る枚数だけで即計算</span></button><button onClick={()=>setPage('advanced')}><b>詳細版</b><span>デッキ、マリガン、サーチ連鎖を設定</span></button></div></section></main>}{page==='simple'&&<Simple/>}{page==='advanced'&&<Advanced/>}{page==='cards'&&<main><section className="hero"><p className="eyebrow">SUPPORTED EFFECTS</p><h1>対応カード一覧</h1><p>レビュー済みの15枚・17効果だけを対象にします。</p></section><section className="panel effects">{drawEffects.map(e=><article key={e.id}><b>{e.representative ? `代表${e.representative} ` : ''}{e.name}</b><span>{e.description}</span><code>{e.id}</code></article>)}</section></main>}{page==='guide'&&<main><section className="hero"><p className="eyebrow">GUIDE</p><h1>使い方・計算上の仮定</h1></section><section className="panel"><h2>計算について</h2><p>通常ドローと条件付きサーチは、山札を戻さない抽選として計算します。厳密計算が100msを超える複雑な条件では、Web Workerでモンテカルロ近似へ切り替え、試行回数・シード・95%信頼区間を表示します。</p><h2>サーチについて</h2><p>PP、盤面、進化、覚醒などは成立済みと仮定します。未対応カードや未確認ルールは自動適用しません。</p></section></main>}<footer>{import.meta.env.VITE_X_URL ? <a href={import.meta.env.VITE_X_URL} target="_blank" rel="noreferrer">X</a> : null}</footer></> }

createRoot(document.getElementById('root')!).render(<App/>);
