import type { Rank } from '../types';

export function rankFor(score: number): Rank {
  if (score >= 81) return 'gold';
  if (score >= 61) return 'silver';
  return 'bronze';
}

export const RANK_META: Record<Rank, { label: string; color: string; emoji: string }> = {
  gold: { label: 'Gold', color: '#B79A5A', emoji: '🏆' },
  silver: { label: 'Silver', color: '#8C9A98', emoji: '🥈' },
  bronze: { label: 'Bronze', color: '#A36A3D', emoji: '🥉' },
};

export interface Insight {
  label: string;
  detail: string;
  round?: number;
}

export function generateInsights(player: number[], target: number[]): Insight[] {
  const insights: Insight[] = [];

  // Strongest: largest player - target (most over-target)
  let bestRound = -1;
  let bestDelta = -Infinity;
  for (let i = 1; i < player.length; i++) {
    const d = player[i] - target[i];
    if (d > bestDelta) {
      bestDelta = d;
      bestRound = i;
    }
  }
  insights.push({
    label: 'Strongest moment',
    detail:
      bestDelta > 0
        ? `Round ${bestRound}: peaked at ${Math.round(player[bestRound])} (target ${target[bestRound]}, +${Math.round(bestDelta)}).`
        : `Round ${bestRound}: closest to target at ${Math.round(player[bestRound])}.`,
    round: bestRound,
  });

  // Weakest: largest target - player (biggest shortfall)
  let worstRound = -1;
  let worstDelta = -Infinity;
  for (let i = 1; i < player.length; i++) {
    const d = target[i] - player[i];
    if (d > worstDelta) {
      worstDelta = d;
      worstRound = i;
    }
  }
  insights.push({
    label: 'Weakest moment',
    detail:
      worstDelta > 0
        ? `Round ${worstRound}: dipped to ${Math.round(player[worstRound])} (target ${target[worstRound]}, -${Math.round(worstDelta)}).`
        : `Round ${worstRound}: stayed close to target at ${Math.round(player[worstRound])}.`,
    round: worstRound,
  });

  // Closing: average of last 2 vs target
  const lastPlayer = (player[7] + player[8]) / 2;
  const lastTarget = (target[7] + target[8]) / 2;
  insights.push({
    label: 'Closing moment',
    detail:
      lastPlayer >= lastTarget
        ? `Finished strong — final 2 rounds averaged ${Math.round(lastPlayer)} vs target ${Math.round(lastTarget)}.`
        : `Finished soft — final 2 rounds averaged ${Math.round(lastPlayer)} vs target ${Math.round(lastTarget)}.`,
  });

  return insights;
}

export function curveFitPercent(player: number[], target: number[]): number {
  // 100% = perfect match; reduce by 100 - rmse * 1.5 idea but normalized to a percent
  const errs = player.map((v, i) => Math.abs(v - target[i]));
  const meanErr = errs.reduce((a, b) => a + b, 0) / errs.length;
  return Math.max(0, Math.round(100 - meanErr * 1.5));
}
