import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ConfirmModal } from '../components/ConfirmModal';
import { useStore } from '../store/useStore';
import { EVENT_LIST } from '../game/eventTypes';
import type { Difficulty, EventTypeId } from '../types';
import { ChevronRight } from 'lucide-react';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy · forgiving scoring',
  normal: 'Normal · default tolerance',
  hard: 'Hard · strict scoring',
};

/**
 * W11 — Settings. FIX C2: every "pill" selector has a chevron and bordered
 * button style so it clearly reads as tappable, not as a decorative label.
 */
export function W11Settings() {
  const navigate = useNavigate();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [reset, setReset] = useState(false);
  const resetStore = useStore((s) => s.reset);

  function Row({
    label,
    value,
    onClick,
  }: {
    label: string;
    value: string;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-2 px-3 py-3 border border-gray-line rounded-lg bg-white hover:border-teal transition-colors"
      >
        <div className="text-[12px] font-bold text-dark">{label}</div>
        <div className="flex items-center gap-1">
          <span className="text-[12px] text-teal font-semibold">{value}</span>
          <ChevronRight size={14} className="text-teal" />
        </div>
      </button>
    );
  }

  function Toggle({
    label,
    on,
    onChange,
  }: {
    label: string;
    on: boolean;
    onChange: (v: boolean) => void;
  }) {
    return (
      <button
        onClick={() => onChange(!on)}
        className="w-full flex items-center justify-between gap-2 px-3 py-3 border border-gray-line rounded-lg bg-white hover:border-teal transition-colors"
      >
        <div className="text-[12px] font-bold text-dark">{label}</div>
        <div
          className={[
            'w-10 h-6 rounded-full p-0.5 transition-colors',
            on ? 'bg-teal' : 'bg-gray-light',
          ].join(' ')}
        >
          <div
            className={[
              'w-5 h-5 rounded-full bg-white shadow transform transition-transform',
              on ? 'translate-x-4' : 'translate-x-0',
            ].join(' ')}
          />
        </div>
      </button>
    );
  }

  return (
    <Layout title="Settings" onBack={() => navigate('/')}>
      <div className="p-4 pb-8">
        <h2 className="h2">Gameplay</h2>
        <div className="grid gap-2">
          <Row
            label="Difficulty"
            value={settings.difficulty[0].toUpperCase() + settings.difficulty.slice(1)}
            onClick={() => setShowDifficulty(true)}
          />
          <Row
            label="Event types enabled"
            value={`${settings.enabledEventTypes.length} of 8`}
            onClick={() => setShowEvents(true)}
          />
          <Toggle
            label="Hints during play"
            on={settings.hintsOn}
            onChange={(v) => updateSettings({ hintsOn: v })}
          />
        </div>

        <h2 className="h2">Account</h2>
        <div className="grid gap-2">
          <Toggle
            label="Notifications"
            on={settings.notificationsOn}
            onChange={(v) => updateSettings({ notificationsOn: v })}
          />
          <Toggle
            label="Sound effects"
            on={settings.soundOn}
            onChange={(v) => updateSettings({ soundOn: v })}
          />
          <Row label="Language" value="English" onClick={() => {}} />
        </div>

        <h2 className="h2">Data</h2>
        <button
          onClick={() => setReset(true)}
          className="w-full border border-bad text-bad text-[12px] font-bold py-3 rounded-lg hover:bg-bad/5 transition-colors"
        >
          Reset all data
        </button>

        <p className="muted text-center mt-4">
          Settings persist in localStorage. Sign Out from the menu to clear your profile.
        </p>
      </div>

      {/* Difficulty picker */}
      {showDifficulty && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center animate-fade-in">
          <div className="bg-white text-dark rounded-t-2xl w-full max-w-[440px] p-4">
            <div className="text-center pb-2">
              <div className="w-10 h-1 bg-gray-light rounded-full mx-auto mb-3" />
              <h2 className="h2 mt-0 mb-0">Choose difficulty</h2>
            </div>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  updateSettings({ difficulty: d });
                  setShowDifficulty(false);
                }}
                className={[
                  'w-full text-left border rounded-lg p-3 mb-2 transition-colors flex items-center justify-between',
                  settings.difficulty === d
                    ? 'border-teal bg-teal-light'
                    : 'border-gray-line bg-white hover:border-teal',
                ].join(' ')}
              >
                <div>
                  <div className="font-bold text-[13px] text-dark">
                    {d[0].toUpperCase() + d.slice(1)}
                  </div>
                  <div className="text-[10px] text-gray">{DIFFICULTY_LABELS[d]}</div>
                </div>
                {settings.difficulty === d && <span className="text-teal">✓</span>}
              </button>
            ))}
            <button
              onClick={() => setShowDifficulty(false)}
              className="btn-outline w-full mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Event types picker */}
      {showEvents && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center animate-fade-in">
          <div className="bg-white text-dark rounded-t-2xl w-full max-w-[440px] p-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center pb-2">
              <div className="w-10 h-1 bg-gray-light rounded-full mx-auto mb-3" />
              <h2 className="h2 mt-0 mb-0">Event types enabled</h2>
              <p className="muted">Disable any you don't want in the pool.</p>
            </div>
            {EVENT_LIST.map((ev) => {
              const on = settings.enabledEventTypes.includes(ev.id);
              return (
                <button
                  key={ev.id}
                  onClick={() => {
                    const next = on
                      ? settings.enabledEventTypes.filter((id) => id !== ev.id)
                      : ([...settings.enabledEventTypes, ev.id] as EventTypeId[]);
                    // Always keep at least one event type
                    if (next.length === 0) return;
                    updateSettings({ enabledEventTypes: next });
                  }}
                  className={[
                    'w-full text-left border rounded-lg p-3 mb-2 transition-colors flex items-center gap-3',
                    on ? 'border-teal bg-teal-light' : 'border-gray-line bg-white',
                  ].join(' ')}
                >
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center text-white text-lg shrink-0"
                    style={{ backgroundColor: ev.color }}
                  >
                    {ev.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[12px] text-dark">{ev.name}</div>
                    <div className="text-[10px] text-gray leading-tight">{ev.description}</div>
                  </div>
                  <div className="text-[16px]">{on ? '✅' : '⬜'}</div>
                </button>
              );
            })}
            <button onClick={() => setShowEvents(false)} className="btn-primary w-full mt-1">
              Done
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={reset}
        title="Reset all data?"
        body="This clears your profile, sessions, and settings. The app will return to the login screen."
        confirmLabel="Yes, reset"
        onCancel={() => setReset(false)}
        onConfirm={() => {
          setReset(false);
          resetStore();
          navigate('/login');
        }}
      />
    </Layout>
  );
}
