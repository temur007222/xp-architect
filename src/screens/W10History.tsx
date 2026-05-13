import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useStore } from '../store/useStore';
import { EVENT_TYPES } from '../game/eventTypes';
import { ARCHETYPE_META } from '../game/archetypes';
import { RANK_META } from '../game/scoring';
import { ChevronRight } from 'lucide-react';

/**
 * W10 — Player History. FIX C3: each row opens a detail view (W10HistoryDetail)
 * showing that specific session's timeline and curve — not a navigate-back loop
 * to the generic Summary screen.
 */
export function W10History() {
  const navigate = useNavigate();
  const sessions = useStore((s) => s.sessions).filter((s) => s.completedAt);

  return (
    <Layout title="Player History" onBack={() => navigate('/')}>
      <div className="p-4">
        {sessions.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-[28px] mb-2">📭</div>
            <div className="text-[13px] font-bold text-dark mb-1">No sessions yet</div>
            <div className="muted mb-3">Play your first round to populate history.</div>
            <button onClick={() => navigate('/play/setup')} className="btn-primary">
              ▶ Start a session
            </button>
          </div>
        ) : (
          sessions.map((s) => {
            const date = s.completedAt
              ? new Date(s.completedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—';
            const rank = RANK_META[s.rank];
            const preview = s.events.slice(0, 4);
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/history/${s.id}`)}
                className="w-full text-left card mb-2 hover:border-teal transition-colors flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[12px] font-bold text-dark">
                      {ARCHETYPE_META[s.archetype].icon} {ARCHETYPE_META[s.archetype].name}
                    </div>
                    <div className="text-[10px] text-gray">{date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {preview.map((e) => (
                        <span
                          key={e.round}
                          className="w-4 h-4 rounded text-white text-[8px] flex items-center justify-center"
                          style={{ backgroundColor: EVENT_TYPES[e.eventTypeId].color }}
                        >
                          {EVENT_TYPES[e.eventTypeId].icon}
                        </span>
                      ))}
                      {s.events.length > 4 && (
                        <span className="text-[9px] text-gray ml-1 self-center">
                          +{s.events.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-extrabold text-teal leading-none">{s.score}</div>
                  <div className="text-[9px] font-bold" style={{ color: rank.color }}>
                    {rank.emoji} {rank.label}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </Layout>
  );
}
