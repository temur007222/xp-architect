import { describe, it, expect } from 'vitest';
import { computeCurve, rmse, score } from '../curve';
import { TARGETS } from '../archetypes';
import type { PlacedEvent } from '../../types';

const ts = '2026-01-01T00:00:00.000Z';

describe('computeCurve', () => {
  it('returns baseline 9-point curve when no events', () => {
    const curve = computeCurve([]);
    expect(curve).toHaveLength(9);
    curve.forEach((v) => expect(v).toBe(50));
  });

  it('applies a tutorial in round 0 (user round 1) as +8', () => {
    const events: PlacedEvent[] = [{ eventTypeId: 'tutorial', round: 0, placedAt: ts }];
    const curve = computeCurve(events);
    // baseline 50, then +8 at index 1, carry forward
    expect(curve[0]).toBe(50);
    expect(curve[1]).toBe(58);
  });

  it('reward diminishes by 3 per prior reward', () => {
    const events: PlacedEvent[] = [
      { eventTypeId: 'reward', round: 0, placedAt: ts },
      { eventTypeId: 'reward', round: 1, placedAt: ts },
    ];
    const curve = computeCurve(events);
    // first reward: +12 at idx 1; second reward: +9 at idx 2 (12 - 1*3)
    expect(curve[1]).toBe(62);
    expect(curve[2]).toBe(71);
  });

  it('clamps to [0,100]', () => {
    const events: PlacedEvent[] = Array.from({ length: 8 }, (_, i) => ({
      eventTypeId: 'reward' as const,
      round: i,
      placedAt: ts,
    }));
    const curve = computeCurve(events);
    curve.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });
  });
});

describe('rmse', () => {
  it('is zero for identical arrays', () => {
    expect(rmse([1, 2, 3], [1, 2, 3])).toBe(0);
  });

  it('matches spec formula', () => {
    const a = [50, 60, 70];
    const b = [50, 60, 70];
    expect(rmse(a, b)).toBe(0);
    const c = [60, 70, 80];
    expect(rmse(a, c)).toBeCloseTo(10, 5);
  });

  it('throws on mismatched lengths', () => {
    expect(() => rmse([1], [1, 2])).toThrow();
  });
});

describe('score', () => {
  it('returns 100 for a perfectly matching curve', () => {
    expect(score(TARGETS.casual, 'casual')).toBe(100);
  });

  it('returns >= 0', () => {
    expect(score([0, 0, 0, 0, 0, 0, 0, 0, 0], 'casual')).toBeGreaterThanOrEqual(0);
  });

  it('matches §3.4 formula: max(0, round(100 - rmse * 1.5))', () => {
    const player = [50, 60, 65, 70, 72, 75, 78, 80, 82]; // = TARGETS.casual
    const target = TARGETS.casual;
    const expected = Math.max(0, Math.round(100 - rmse(player, target) * 1.5));
    expect(score(player, 'casual')).toBe(expected);
  });

  it('easy difficulty is more forgiving than hard', () => {
    const player = [40, 50, 55, 60, 62, 65, 68, 70, 72];
    const easy = score(player, 'casual', 'easy');
    const hard = score(player, 'casual', 'hard');
    expect(easy).toBeGreaterThan(hard);
  });
});
