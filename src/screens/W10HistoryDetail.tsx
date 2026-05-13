import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { SatisfactionChart } from '../components/SatisfactionChart';
import { useStore } from '../store/useStore';
import { TARGETS, ARCHETYPE_META } from '../game/archetypes';
import { EVENT_TYPES } from '../game/eventTypes';
import { RANK_META } from '../game/scoring';

export function W10HistoryDetail() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const session = useStore((s) => s.sessions.find((x) => x.id === sessionId));

  if (!session) {
    return (
      <Layout title="Session not found" onBack={() => navigate('/history')}>
        <div className="p-4">
          <div className="card text-center py-6">
            <div className="text-[28px] mb-2">❓</div>
            <div className="text-[13px] font-bold text-dark mb-1">Couldn't find that session</div>
            <button onClick={() => navigate('/history')} className="btn-primary mt-2">
              Back to history
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const target = TARGETS[session.archetype];
  const rank = RANK_META[session.rank];

  return (
    <Layout title="Session detail" onBack={() => navigate('/history')}>
      <div className="p-4 pb-6">
        <div className="card mb-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-gray uppercase tracking-wide">Archetype</div>
            <div className="text-[14px] font-bold text-dark">
              {ARCHETYPE_META[session.archetype].icon} {ARCHETYPE_META[session.archetype].name}
            </div>
            <div className="text-[10px] text-gray mt-0.5">
              {session.completedAt
                ? new Date(session.completedAt).toLocaleString()
                : 'In progress'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[26px] font-extrabold text-teal leading-none">{session.score}</div>
            <div className="text-[10px] font-bold" style={{ color: rank.color }}>
              {rank.emoji} {rank.label}
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="lbl">Curve vs target</div>
          <SatisfactionChart
            player={session.curve}
            target={target}
            height={170}
            showCaption={false}
          />
        </div>

        <div className="lbl">Placed events</div>
        <div className="card p-2">
          {session.events.map((e) => {
            const ev = EVENT_TYPES[e.eventTypeId];
            return (
              <div
                key={`${e.round}-${e.eventTypeId}`}
                className="flex items-center gap-3 py-1.5 border-b border-gray-line last:border-b-0"
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-white text-[14px]"
                  style={{ backgroundColor: ev.color }}
                >
                  {ev.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold text-dark">
                    Round {e.round + 1} · {ev.name}
                  </div>
                  <div className="text-[10px] text-gray leading-tight">{ev.description}</div>
                </div>
                {e.eventTypeId === 'secret' && e.secretBonus !== undefined && (
                  <div className="text-[10px] text-teal font-bold">
                    +{e.secretBonus} bonus
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={() => navigate('/play/setup')} className="btn-primary w-full mt-4">
          ▶ Play again
        </button>
      </div>
    </Layout>
  );
}
