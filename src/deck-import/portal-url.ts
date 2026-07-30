const allowedHosts = new Set(['shadowverse-wb.com', 'www.shadowverse-wb.com']);
export function validateDeckPortalUrl(input: string): { hash: string } {
  let url: URL;
  try { url = new URL(input); } catch { throw new Error('Deck Portal URLの形式ではありません。'); }
  if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname) || !url.pathname.startsWith('/ja/deck/detail/')) throw new Error('許可されたDeck Portal URLではありません。');
  const hash = url.searchParams.get('hash');
  if (!hash) throw new Error('Deck Portal URLにhashがありません。');
  return { hash };
}
