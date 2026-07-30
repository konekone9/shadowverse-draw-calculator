/// <reference lib="webworker" />
import { simulateMulligan, type MulliganSimulationInput } from '../mulligan-monte-carlo';
self.onmessage = ({ data }: MessageEvent<MulliganSimulationInput>) => {
  try { self.postMessage({ ok: true, result: simulateMulligan(data) }); }
  catch (error) { self.postMessage({ ok: false, error: error instanceof Error ? error.message : 'mulligan_simulation_failed' }); }
};
