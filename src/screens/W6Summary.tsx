import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { SatisfactionChart } from '../components/SatisfactionChart';
import { useStore } from '../store/useStore';
import { TARGETS, ARCHETYPE_META } from '../game/archetypes';
import { curveFitPercent, generateInsights, RANK_META } from '../game/scoring';
import { Play, Trophy, History } from 'lucide-react';

export function W6Summary() {
  const navigate = useNavigate();
  const sessions = useStore((s) => s.sessions);
  const last = sessions[0];

  if (!last) {
    return (
      <Layout title="Summary" onBack={() => navigate('/')}>
        <div className="p-4">
          <p className="muted">No completed session yet. Start a game first.</p>
          <button onClick={() => navigate('/play/setup')} className="btn-primary w-full mt-3">
            ▶ Start designing
          </button>
        </div>
      </Layout>
    );
  }

  const target = TARGETS[last.archetype];
  const fit = curveFitPercent(last.curve, target);
  const insights = generateInsights(last.curve, target);
  const rankMeta = RANK_META[last.rank];
  const durationMs = last.completedAt
    ? new Date(last.completedAt).getTime() - new Date(last.startedAt).getTime()
    : 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  return (
    <Layout title="Summary" onBack={() => navigate('/')}>
      <div className="p-4 pb-6">
        <div
          className="rounded-2xl p-5 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${rankMeta.color} 0%, #006B5E 100%)`,
          }}
        >
          <div className="text-[11px] tracking-[2px] opacity-90 mb-1">FINAL SCORE</div>
          <div className="text-[64px] font-extrabold leading-none">{last.score}</div>
          <div className="text-[13px] opacity-90 mb-2">/ 100</div>
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <span>{rankMeta.emoji}</span>
            <span className="font-bold text-[12px]">{rankMeta.label} Rank</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
          <div className="card text-center py-2">
            <div className="text-[18px] font-extrabold text-teal">{last.events.length}</div>
            <div className="text-[10px] text-gray">Events placed</div>
          </div>
          <div className="card text-center py-2">
            <div className="text-[18px] font-extrabold text-teal">{fit}%</div>
            <div className="text-[10px] text-gray">Curve fit</div>
          </div>
          <div className="card text-center py-2">
            <div className="text-[18px] font-extrabold text-teal">
              {minutes}m {seconds}s
            </div>
            <div className="text-[10px] text-gray">Time taken</div>
          </div>
        </div>

        <div className="card p-3 mb-4">
          <div className="lbl">Your curve vs target ({ARCHETYPE_META[last.archetype].name})</div>
          <SatisfactionChart player={last.curve} target={target} height={160} showCaption={false} />
        </div>

        <div className="lbl">Insights</div>
        {insights.map((i) => (
          <div key={i.label} className="card mb-2 p-3">
            <div className="text-[12px] font-bold text-dark">{i.label}</div>
            <div className="text-[11px] text-gray leading-snug mt-0.5">{i.detail}</div>
          </div>
        ))}

        <div className="grid grid-cols-1 gap-2 mt-4">
          <button onClick={() => navigate('/play/setup')} className="btn-primary w-full">
            <Play size={14} /> Play again
          </button>
          <button onClick={() => navigate('/history')} className="btn-outline w-full">
            <History size={14} /> View all sessions
          </button>
          <button onClick={() => navigate('/leaderboard')} className="btn-outline w-full">
            <Trophy size={14} /> Compare on leaderboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
