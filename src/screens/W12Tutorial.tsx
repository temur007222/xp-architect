import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

const STEPS = [
  {
    title: 'Pick an archetype',
    body: 'Casual, Hardcore, or Completionist. Each wants a different satisfaction curve.',
    icon: '🎯',
  },
  {
    title: 'Drag events onto the timeline',
    body: 'You place 8 events across 8 rounds. Drag a tile to a numbered slot.',
    icon: '🎮',
  },
  {
    title: 'Watch the curve respond',
    body: 'The pink dashed line is your target. The solid teal line is your design.',
    icon: '📊',
  },
  {
    title: 'Finish on a peak',
    body: 'Round 8 is the climax — Reward, Boss, or Story beat. Lock to score.',
    icon: '🏆',
  },
];

export function W12Tutorial() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const s = STEPS[step];

  return (
    <Layout title="How to play" onBack={() => navigate('/')}>
      <div className="p-4 pb-6 h-full flex flex-col">
        <div className="card flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-b from-teal-light/40 to-white">
          <div className="text-[64px] mb-3">{s.icon}</div>
          <div className="text-[11px] font-bold text-teal uppercase tracking-wider mb-1">
            Step {step + 1} of {STEPS.length}
          </div>
          <h2 className="h1 mt-1">{s.title}</h2>
          <p className="text-[13px] text-gray max-w-[280px] leading-relaxed">{s.body}</p>
        </div>

        <div className="flex justify-center gap-1.5 my-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={
                i === step
                  ? 'w-5 h-1.5 rounded-full bg-teal transition-all'
                  : 'w-1.5 h-1.5 rounded-full bg-gray-light'
              }
            />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-outline flex-1"
            >
              ← Back
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">
              Next →
            </button>
          ) : (
            <button
              onClick={() => navigate('/play/setup')}
              className="btn-primary flex-1"
            >
              Got it — Start designing →
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
