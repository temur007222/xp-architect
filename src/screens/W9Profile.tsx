import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon } from 'lucide-react';

export function W9Profile() {
  const navigate = useNavigate();
  const player = useStore((s) => s.player);
  const sessions = useStore((s) => s.sessions);

  if (!player) return null;
  const completed = sessions.filter((s) => s.completedAt);
  const totalSessions = completed.length;
  const best = completed.reduce((m, s) => Math.max(m, s.score), 0);
  const avg = totalSessions
    ? Math.round(completed.reduce((sum, s) => sum + s.score, 0) / totalSessions)
    : 0;
  const initials = player.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Layout
      title="Profile"
      onBack={() => navigate('/')}
      rightSlot={
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15"
          aria-label="Settings"
        >
          <SettingsIcon size={18} />
        </button>
      }
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-teal text-white flex items-center justify-center text-2xl font-extrabold">
            {initials || 'P'}
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-dark">{player.name}</div>
            <div className="text-[11px] text-gray">{player.email}</div>
            <div className="text-[11px] text-teal font-bold mt-0.5">
              Level {player.level} · {player.xp} XP
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="card text-center py-3">
            <div className="text-[18px] font-extrabold text-teal">{totalSessions}</div>
            <div className="text-[10px] text-gray">Sessions</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-[18px] font-extrabold text-teal">{best}</div>
            <div className="text-[10px] text-gray">Best score</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-[18px] font-extrabold text-teal">{avg}</div>
            <div className="text-[10px] text-gray">Avg score</div>
          </div>
        </div>

        <h2 className="h2">Badges</h2>
        {player.badges.length === 0 ? (
          <div className="card text-center py-4">
            <div className="text-[24px] mb-1">🔒</div>
            <div className="text-[12px] text-gray">No badges yet — play a session to earn your first.</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {player.badges.map((b) => (
              <div key={b.id} className="card text-center py-3">
                <div className="text-[24px] mb-1">{b.icon}</div>
                <div className="text-[11px] font-bold text-dark">{b.name}</div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/settings')} className="btn-outline w-full mt-4">
          <SettingsIcon size={14} /> Open settings
        </button>
      </div>
    </Layout>
  );
}
