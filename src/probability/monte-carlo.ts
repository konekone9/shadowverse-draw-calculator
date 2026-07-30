export type Interval = { low: number; high: number };
export type MonteCarloResult = { probability: number; expected: number; standardError: number; interval95: Interval; trials: number; seed: number };

export function wilsonInterval(successes: number, trials: number, z = 1.959963984540054): Interval {
  if (!Number.isInteger(successes) || !Number.isInteger(trials) || successes < 0 || trials <= 0 || successes > trials) throw new RangeError('Wilson区間の入力が不正です。');
  const p = successes / trials;
  const denominator = 1 + (z * z) / trials;
  const center = (p + (z * z) / (2 * trials)) / denominator;
  const radius = (z / denominator) * Math.sqrt((p * (1 - p)) / trials + (z * z) / (4 * trials * trials));
  return { low: successes === 0 ? 0 : Math.max(0, center - radius), high: successes === trials ? 1 : Math.min(1, center + radius) };
}

function next(seed: number) {
  let value = seed | 0;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  return value >>> 0;
}

export function simulateSimpleDraw(deck: number, targets: number, draws: number, trials = 100_000, seed = 0x5eed1234): MonteCarloResult {
  if (!Number.isInteger(deck) || !Number.isInteger(targets) || !Number.isInteger(draws) || !Number.isInteger(trials) || deck < 1 || targets < 0 || targets > deck || draws < 0 || draws > deck || trials < 1) throw new RangeError('モンテカルロ計算の入力が不正です。');
  let state = seed >>> 0; let successes = 0; let totalDrawnTargets = 0;
  for (let trial = 0; trial < trials; trial += 1) {
    let remainingDeck = deck; let remainingTargets = targets; let hit = 0;
    for (let draw = 0; draw < draws; draw += 1) {
      state = next(state);
      if ((state % remainingDeck) < remainingTargets) { hit += 1; remainingTargets -= 1; }
      remainingDeck -= 1;
    }
    if (hit > 0) successes += 1;
    totalDrawnTargets += hit;
  }
  const probability = successes / trials;
  return { probability, expected: totalDrawnTargets / trials, standardError: Math.sqrt((probability * (1 - probability)) / trials), interval95: wilsonInterval(successes, trials), trials, seed: seed >>> 0 };
}
