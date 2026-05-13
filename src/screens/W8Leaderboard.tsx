import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useStore } from '../store/useStore';
import { seedLeaderboard } from '../lib/seed';

type Period = 'weekly' | 'monthly' | 'allTime';

export function W8Leaderboard() {
  const navigate = useNavigate();
  const player = useStore((s) => s.player);
  const sessions = useStore((s) => s.sessions);
  const [period, setPeriod] = useState<Period>('weekly');

  const bestScore = useMemo(
    () => sessions.reduce((m, s) => Math.max(m, s.score), 0),
    [sessions]
  );
  const rows = useMemo(
    () => seedLeaderboard(player?.name ?? 'You', bestScore, period),
    [player?.name, bestScore, period]
  );

  return (
    <Layout title="Leaderboard" onBack={() => navigate('/')}>
      <div className="p-4">
        <div className="flex gap-1 bg-gray-light/30 rounded-lg p-1 mb-3">
          {(['weekly', 'monthly', 'allTime'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[
                'flex-1 py-2 rounded-md text-[12px] font-semibold transition-all',
                period === p ? 'bg-teal text-white shadow' : 'text-gray hover:text-dark',
              ].join(' ')}
            >
              {p === 'allTime' ? 'All time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="card p-0 overflow-hidden">
          {rows.map((row) => (
            <div
              key={row.rank + row.name}
              className={[
                'flex items-center gap-3 px-3 py-2.5 border-b border-gray-line last:border-b-0',
                row.isYou ? 'bg-teal-light' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold',
                  row.rank === 1
                    ? 'bg-yellow-100 text-yellow-700'
                    : row.rank === 2
                      ? 'bg-gray-light/40 text-gray'
                      : row.rank === 3
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-light/30 text-gray',
                ].join(' ')}
              >
                {row.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[12px] text-dark truncate">
                  {row.name}
                  {row.isYou && <span className="ml-1 text-[10px] text-teal">(you)</span>}
                </div>
                <div className="text-[10px] text-gray">{row.archetype}</div>
              </div>
              <div className="text-[15px] font-extrabold text-teal">{row.score}</div>
            </div>
          ))}
        </div>

        <p className="muted text-center mt-3">
          Leaderboard is seeded with fictional players for the prototype.
        </p>
      </div>
    </Layout>
  );
}
