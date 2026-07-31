/// <reference lib="webworker" />
import { simulateSearchChain, type SearchChainInput } from '../search-chain';
self.onmessage = ({ data }: MessageEvent<SearchChainInput>) => {
  try { self.postMessage({ ok: true, result: simulateSearchChain(data) }); }
  catch (error) { self.postMessage({ ok: false, error: error instanceof Error ? error.message : 'search_chain_failed' }); }
};
