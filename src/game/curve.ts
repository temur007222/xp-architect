import type { PlacedEvent, Archetype, Difficulty } from '../types';
import { EVENT_TYPES } from './eventTypes';
import { TARGETS } from './archetypes';

// Baseline starting satisfaction at round 0
const BASELINE = 50;

/**
 * Compute the 9-point satisfaction curve from a list of placed events.
 * Curve index 0 = baseline; indices 1..8 = satisfaction after each placement.
 *
 * Each placed event contributes deltas (some affecting the current round, some
 * the next). Values are clamped to [0, 100].
 */
export function computeCurve(events: PlacedEvent[]): number[] {
  const curve = new Array(9).fill(BASELINE);
  // Carry-forward: each curve point starts at the previous one, then deltas apply.
  // We accumulate by walking left-to-right, applying baseline carry then deltas.
  const deltaSum = new Array(9).fill(0);

  for (const placed of events) {
    const type = EVENT_TYPES[placed.eventTypeId];
    const eff = type.effect(placed.round, events);
    for (let i = 0; i < eff.deltas.length; i++) {
      deltaSum[i] += eff.deltas[i];
    }
  }

  // Propagate: curve[i] = curve[i-1] + deltaSum[i] (i >= 1)
  for (let i = 1; i < 9; i++) {
    const value = curve[i - 1] + deltaSum[i];
    curve[i] = Math.max(0, Math.min(100, value));
  }
  return curve;
}

export function rmse(player: number[], target: number[]): number {
  if (player.length !== target.length) {
    throw new Error('rmse: arrays must have same length');
  }
  const sum = player.reduce(
    (acc, v, i) => acc + (v - target[i]) ** 2,
    0
  );
  return Math.sqrt(sum / player.length);
}

/**
 * Score 0–100 from RMSE per §3.4: score = max(0, round(100 - rmse * 1.5))
 * Difficulty adjusts the multiplier slightly so easy is more forgiving.
 */
export function score(
  player: number[],
  archetype: Archetype,
  difficulty: Difficulty = 'normal'
): number {
  const target = TARGETS[archetype];
  const err = rmse(player, target);
  const mult = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 1.8 : 1.5;
  return Math.max(0, Math.round(100 - err * mult));
}
