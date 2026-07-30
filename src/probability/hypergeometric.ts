export type Distribution = { exact: number[]; atLeastOne: number; expected: number };

export function combination(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= r; i += 1) result = (result * (n - r + i)) / i;
  return result;
}

export function hypergeometric(deck: number, targets: number, draws: number): Distribution {
  if (!Number.isInteger(deck) || !Number.isInteger(targets) || !Number.isInteger(draws) || deck < 1 || targets < 0 || targets > deck || draws < 0 || draws > deck) {
    throw new RangeError('山札・対象・掘る枚数の組合せが不正です。');
  }
  const denominator = combination(deck, draws);
  const exact = Array.from({ length: Math.min(targets, draws) + 1 }, (_, count) =>
    (combination(targets, count) * combination(deck - targets, draws - count)) / denominator,
  );
  return { exact, atLeastOne: 1 - (exact[0] ?? 1), expected: (draws * targets) / deck };
}

export function drawsToReach(deck: number, targets: number, threshold: number): number | null {
  for (let draws = 0; draws <= deck; draws += 1) if (hypergeometric(deck, targets, draws).atLeastOne >= threshold) return draws;
  return null;
}

export function filteredSearchSuccess(candidates: number, targetCandidates: number, count: number): number {
  if (candidates <= 0 || targetCandidates <= 0 || count <= 0) return 0;
  return hypergeometric(candidates, targetCandidates, Math.min(candidates, count)).atLeastOne;
}

/** それぞれ別の目的グループを1枚以上引く確率（包含排除）。 */
export function allGroupsSuccess(deck: number, groupCounts: number[], draws: number): number {
  if (!Number.isInteger(deck) || !Number.isInteger(draws) || deck < 1 || draws < 0 || draws > deck || !groupCounts.length || groupCounts.some((count) => !Number.isInteger(count) || count < 1) || groupCounts.reduce((sum, count) => sum + count, 0) > deck) throw new RangeError('複数目的の入力が不正です。');
  const denominator = combination(deck, draws);
  let probability = 0;
  const subsets = 1 << groupCounts.length;
  for (let mask = 0; mask < subsets; mask += 1) {
    let absent = 0; let bits = 0;
    for (let index = 0; index < groupCounts.length; index += 1) if (mask & (1 << index)) { absent += groupCounts[index]; bits += 1; }
    const term = combination(deck - absent, draws) / denominator;
    probability += bits % 2 === 0 ? term : -term;
  }
  return Math.max(0, Math.min(1, probability));
}

/** 初手4枚から目的カードだけをキープして引き直した後に通常ドローする分布。 */
export function targetOnlyKeepMulligan(deck: number, targets: number, draws: number): Distribution {
  if (!Number.isInteger(deck) || !Number.isInteger(targets) || !Number.isInteger(draws) || deck < 4 || targets < 0 || targets > deck || draws < 0 || draws > deck - 4) {
    throw new RangeError('マリガン計算の入力が不正です。');
  }
  const exact = Array.from({ length: Math.min(targets, 4 + draws) + 1 }, () => 0);
  const initial = hypergeometric(deck, targets, 4).exact;
  for (let kept = 0; kept < initial.length; kept += 1) {
    const redrawCount = 4 - kept;
    const redraw = hypergeometric(deck - 4, targets - kept, redrawCount).exact;
    for (let redrawnTargets = 0; redrawnTargets < redraw.length; redrawnTargets += 1) {
      const later = hypergeometric(deck - 4, targets - kept - redrawnTargets, draws).exact;
      for (let laterTargets = 0; laterTargets < later.length; laterTargets += 1) {
        exact[kept + redrawnTargets + laterTargets] += initial[kept] * redraw[redrawnTargets] * later[laterTargets];
      }
    }
  }
  return { exact, atLeastOne: 1 - (exact[0] ?? 1), expected: exact.reduce((total, probability, count) => total + probability * count, 0) };
}
