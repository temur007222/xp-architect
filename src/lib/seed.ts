// Fake leaderboard data — mixed with the player's best score on render.

export interface LeaderRow {
  rank: number;
  name: string;
  score: number;
  archetype: string;
  isYou?: boolean;
}

const FICTIONAL_NAMES = [
  'Ava Lindholm',
  'Marek Voss',
  'Iida Sten',
  'Luca Vasiliu',
  'Kris Rinta',
  'Noor Ahmadi',
  'Sami Lindberg',
  'Elia Marchetti',
  'Petr Novak',
];

const ARCHETYPES = ['Casual', 'Hardcore', 'Completionist'];

function seededInt(seed: number, mod: number): number {
  // tiny LCG so leaderboard is deterministic per period
  let x = seed * 9301 + 49297;
  x = (x % 233280 + 233280) % 233280;
  return x % mod;
}

export function seedLeaderboard(
  playerName: string,
  playerBest: number,
  period: 'weekly' | 'monthly' | 'allTime' = 'weekly'
): LeaderRow[] {
  const periodSeed = period === 'weekly' ? 11 : period === 'monthly' ? 23 : 53;
  const fakes = FICTIONAL_NAMES.map((name, i) => ({
    rank: 0,
    name,
    score: 60 + seededInt(periodSeed * (i + 1), 41), // 60..100
    archetype: ARCHETYPES[seededInt(periodSeed * (i + 7), 3)],
  }));

  const all = [
    ...fakes,
    {
      rank: 0,
      name: playerName || 'You',
      score: playerBest,
      archetype: 'You',
      isYou: true,
    },
  ];
  all.sort((a, b) => b.score - a.score);
  all.forEach((r, i) => (r.rank = i + 1));
  return all.slice(0, 10);
}
