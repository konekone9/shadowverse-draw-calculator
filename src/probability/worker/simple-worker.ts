/// <reference lib="webworker" />
import { simulateSimpleDraw } from '../monte-carlo';

type Request = { deck: number; targets: number; draws: number; trials?: number; seed?: number };
self.onmessage = ({ data }: MessageEvent<Request>) => {
  try { self.postMessage({ ok: true, result: simulateSimpleDraw(data.deck, data.targets, data.draws, data.trials, data.seed) }); }
  catch (error) { self.postMessage({ ok: false, error: error instanceof Error ? error.message : 'monte_carlo_failed' }); }
};
