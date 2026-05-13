import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { OnboardingModal } from '../components/OnboardingModal';
import { useStore } from '../store/useStore';
import { Play, BookOpen, Trophy, History } from 'lucide-react';

/**
 * W2 — Home / About. FIX A2: on the very first launch (player has not seen the
 * onboarding), show a 3-step overlay before the home content becomes
 * interactive. The flag is persisted to localStorage so it never repeats.
 */
export function W2Home() {
  const navigate = useNavigate();
  const player = useStore((s) => s.player);
  const sessions = useStore((s) => s.sessions);
  const markOnboardingSeen = useStore((s) => s.markOnboardingSeen);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (player && !player.hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [player]);

  const dismiss = () => {
    markOnboardingSeen();
    setShowOnboarding(false);
  };

  const bestScore = sessions.reduce((m, s) => Math.max(m, s.score), 0);

  return (
    <Layout title="XP Architect">
      <div className="p-4 pb-8">
        <div className="h-[130px] rounded-xl bg-gradient-to-br from-pink to-teal-light flex items-center justify-center text-teal mb-4">
          <span className="text-[34px]">🎯</span>
          <span className="text-[34px] mx-2">📈</span>
          <span className="text-[34px]">🏆</span>
        </div>
        <h2 className="h1">Welcome{player?.name ? `, ${player.name}` : ''}</h2>
        <p className="text-[13px] text-gray leading-relaxed mb-3">
          XP Architect is a meta-game where you act as the designer. You place game
          events on a timeline and watch a satisfaction curve respond. Match the
          curve your chosen player archetype wants — Bronze, Silver, or Gold.
        </p>
        <button
          onClick={() => navigate('/play/setup')}
          className="w-full bg-teal hover:bg-teal-med transition-colors text-white p-4 rounded-xl text-left mt-3"
        >
          <div className="flex items-center gap-3">
            <Play size={22} className="shrink-0" />
            <div>
              <div className="font-extrabold text-[15px]">▶ Start Designing</div>
              <div className="text-[11px] opacity-90">Pick an archetype and place 8 events</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate('/tutorial')}
          className="w-full mt-3 border border-gray-line bg-white text-dark p-3 rounded-xl text-left hover:bg-teal-faint transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-teal shrink-0" />
            <div>
              <div className="font-bold text-[13px]">How to Play</div>
              <div className="muted">4-step guide · about 1 minute</div>
            </div>
          </div>
        </button>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => navigate('/leaderboard')}
            className="border border-gray-line bg-white p-3 rounded-xl text-left hover:bg-teal-faint transition-colors"
          >
            <Trophy size={16} className="text-teal mb-1" />
            <div className="font-bold text-[12px]">Leaderboard</div>
            <div className="muted">Best: {bestScore}</div>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="border border-gray-line bg-white p-3 rounded-xl text-left hover:bg-teal-faint transition-colors"
          >
            <History size={16} className="text-teal mb-1" />
            <div className="font-bold text-[12px]">History</div>
            <div className="muted">{sessions.length} session{sessions.length === 1 ? '' : 's'}</div>
          </button>
        </div>
      </div>
      {showOnboarding && <OnboardingModal onDismiss={dismiss} />}
    </Layout>
  );
}
