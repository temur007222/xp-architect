import type { EventType, EventTypeId } from '../types';

// Each effect returns the deltas to apply to specific rounds in the 9-point curve.
// The curve array is indexed 0..8 where index 0 is the baseline (round 0 = start)
// and indices 1..8 are the satisfaction values AFTER each of the 8 placements.

function zeros(): number[] {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function addAt(arr: number[], idx: number, value: number): number[] {
  if (idx >= 0 && idx < arr.length) arr[idx] += value;
  return arr;
}

// Helpers: "round" parameter is 0–7 (placement slot). The placement affects
// curve index (round + 1), and "next round" affects curve index (round + 2).
export const EVENT_TYPES: Record<EventTypeId, EventType> = {
  tutorial: {
    id: 'tutorial',
    name: 'Tutorial',
    icon: '🎓',
    color: '#028090',
    description: 'Teaches mechanics. +8 in rounds 1–3, +2 otherwise (redundant late).',
    effect: (round) => {
      const deltas = zeros();
      // round 0 = "round 1" in user terms. Rounds 1–3 (user) = rounds 0,1,2 (idx).
      const boost = round <= 2 ? 8 : 2;
      addAt(deltas, round + 1, boost);
      return { deltas };
    },
  },
  reward: {
    id: 'reward',
    name: 'Reward',
    icon: '⭐',
    color: '#3FA068',
    description: '+12 flat boost. Diminishing returns: -3 per prior reward.',
    effect: (round, placed) => {
      const deltas = zeros();
      const priorRewards = placed.filter(
        (p) => p.eventTypeId === 'reward' && p.round < round
      ).length;
      addAt(deltas, round + 1, 12 - priorRewards * 3);
      return { deltas };
    },
  },
  spike: {
    id: 'spike',
    name: 'Spike',
    icon: '⚡',
    color: '#E07A3E',
    description: 'Difficulty spike. -8 now, +10 next round (tension-release).',
    effect: (round) => {
      const deltas = zeros();
      addAt(deltas, round + 1, -8);
      addAt(deltas, round + 2, 10);
      return { deltas };
    },
  },
  boss: {
    id: 'boss',
    name: 'Boss',
    icon: '👹',
    color: '#C04848',
    description: '-10 now, +20 next round. Best as final round.',
    effect: (round) => {
      const deltas = zeros();
      addAt(deltas, round + 1, -10);
      addAt(deltas, round + 2, 20);
      return { deltas };
    },
  },
  story: {
    id: 'story',
    name: 'Story beat',
    icon: '📜',
    color: '#8C5AB7',
    description: '+6 sustained on this and next round.',
    effect: (round) => {
      const deltas = zeros();
      addAt(deltas, round + 1, 6);
      addAt(deltas, round + 2, 6);
      return { deltas };
    },
  },
  rest: {
    id: 'rest',
    name: 'Rest',
    icon: '🌿',
    color: '#5A8FB7',
    description: '+3 after a negative event, -5 otherwise (boring).',
    effect: (round, placed) => {
      const deltas = zeros();
      const prev = placed.find((p) => p.round === round - 1);
      const prevIsNegative = prev
        ? prev.eventTypeId === 'spike' || prev.eventTypeId === 'boss'
        : false;
      addAt(deltas, round + 1, prevIsNegative ? 3 : -5);
      return { deltas };
    },
  },
  puzzle: {
    id: 'puzzle',
    name: 'Puzzle',
    icon: '🧩',
    color: '#B79A5A',
    description: '+9 flat. Steady satisfaction.',
    effect: (round) => {
      const deltas = zeros();
      addAt(deltas, round + 1, 9);
      return { deltas };
    },
  },
  secret: {
    id: 'secret',
    name: 'Secret',
    icon: '🗝️',
    color: '#5A6A68',
    description: '+5 plus a hidden bonus 0–10 (revealed at end).',
    effect: (round, placed) => {
      const deltas = zeros();
      const own = placed.find((p) => p.round === round);
      const bonus = own?.secretBonus ?? 0;
      addAt(deltas, round + 1, 5 + bonus);
      return { deltas };
    },
  },
};

export const EVENT_LIST: EventType[] = [
  EVENT_TYPES.tutorial,
  EVENT_TYPES.reward,
  EVENT_TYPES.spike,
  EVENT_TYPES.boss,
  EVENT_TYPES.story,
  EVENT_TYPES.rest,
  EVENT_TYPES.puzzle,
  EVENT_TYPES.secret,
];

export function rollSecretBonus(): number {
  return Math.floor(Math.random() * 11); // 0–10 inclusive
}

