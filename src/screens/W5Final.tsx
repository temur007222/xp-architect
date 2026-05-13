import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ConfirmModal } from '../components/ConfirmModal';
import { SatisfactionChart } from '../components/SatisfactionChart';
import { useStore } from '../store/useStore';
import { EVENT_TYPES } from '../game/eventTypes';
import { TARGETS } from '../game/archetypes';
import type { EventTypeId } from '../types';
import { AlertTriangle } from 'lucide-react';

// Climax-only event choices for the final round (round index 7)
const FINAL_CHOICES: EventTypeId[] = ['reward', 'boss', 'story'];
const FINAL_ROUND = 7;

/**
 * W5 — Final Round. FIX B3 applied:
 *  • Warning text lives in a banner (orange-on-light-orange) — NOT in the button.
 *  • Primary "Lock final event" button is teal (confirm-color, not warn-color).
 *  • On tap, opens a ConfirmModal explaining irreversibility.
 */
export function W5Final() {
  const navigate = useNavigate();
  const session = useStore((s) => s.currentSession);
  const placeEvent = useStore((s) => s.placeEvent);
  const finalizeSession = useStore((s) => s.finalizeSession);
  const [pick, setPick] = useState<EventTypeId | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!session) navigate('/play/setup', { replace: true });
  }, [session, navigate]);

  if (!session) return null;
  const target = TARGETS[session.archetype];
  const placedFinal = session.events.find((e) => e.round === FINAL_ROUND);

  const handlePick = (id: EventTypeId) => {
    setPick(id);
    placeEvent(id, FINAL_ROUND);
  };

  const handleLockTap = () => {
    if (!pick && !placedFinal) return;
    setConfirm(true);
  };

  const handleConfirmLock = () => {
    setConfirm(false);
    const finalized = finalizeSession();
    if (finalized) navigate('/play/summary', { replace: true });
  };

  return (
    <Layout title="Final round" onBack={() => navigate('/play')}>
      <div className="p-4 pb-6">
        {/* B3 fix: warning lives in a banner, NOT on the button */}
        <div
          className="rounded-lg p-3 mb-3 flex items-start gap-2"
          style={{ background: '#FFF1E6', border: '1px solid #F2C9A8' }}
          role="status"
        >
          <AlertTriangle size={16} className="text-warn shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-bold text-warn">Last placement</div>
            <div className="text-[11px] text-warn/90 leading-snug">
              Round 8 is the climax. You'll review your score after locking.
            </div>
          </div>
        </div>

        {/* Full timeline preview */}
        <div className="card mb-3 p-3">
          <SatisfactionChart player={session.curve} target={target} height={150} />
        </div>

        <h2 className="h2 mt-2">Choose the closing event</h2>
        <p className="muted mb-3">Climax-only event types are available for Round 8.</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FINAL_CHOICES.map((id) => {
            const ev = EVENT_TYPES[id];
            const isSelected = (pick ?? placedFinal?.eventTypeId) === id;
            return (
              <button
                key={id}
                onClick={() => handlePick(id)}
                className={[
                  'rounded-xl p-3 text-left transition-all border-2',
                  isSelected ? 'border-teal' : 'border-transparent opacity-90 hover:opacity-100',
                ].join(' ')}
                style={{ backgroundColor: ev.color, color: '#fff' }}
              >
                <div className="text-2xl mb-1">{ev.icon}</div>
                <div className="font-bold text-[12px]">{ev.name}</div>
                <div className="text-[10px] opacity-90 leading-tight mt-0.5">
                  {ev.description.split('.')[0]}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLockTap}
          disabled={!pick && !placedFinal}
          className="btn-primary w-full"
        >
          🔒 Lock final event
        </button>
        <p className="muted text-center mt-2">
          Locking computes your score and saves the session.
        </p>
      </div>

      <ConfirmModal
        open={confirm}
        title="Lock the satisfaction curve?"
        body="Once locked, the score is calculated and the session is saved. You can play again, but this run is final."
        cancelLabel="Cancel"
        confirmLabel="Yes, lock it"
        onCancel={() => setConfirm(false)}
        onConfirm={handleConfirmLock}
      />
    </Layout>
  );
}
