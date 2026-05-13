import { useState } from 'react';

const STEPS = [
  {
    icon: '🎯',
    title: 'You design the player experience',
    text: 'XP Architect is a meta-game. You place events on a timeline, and shape how a player feels round by round.',
  },
  {
    icon: '📊',
    title: 'Match the target curve',
    text: 'Each archetype wants a different satisfaction shape. The pink dashed line is your target — your job is to get close.',
  },
  {
    icon: '🏆',
    title: 'Score is curve fit, not points',
    text: 'You score Bronze, Silver, or Gold based on how close your curve runs to the target. There is no "right" answer — only fit.',
  },
];

interface OnboardingModalProps {
  onDismiss: () => void;
}

export function OnboardingModal({ onDismiss }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white text-dark rounded-2xl max-w-[360px] w-full p-6 shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-4">{s.icon}</div>
          <h2 className="h1 text-center">{s.title}</h2>
          <p className="text-[13px] text-gray leading-relaxed mb-6">{s.text}</p>
        </div>
        <div className="flex justify-center gap-1.5 mb-5">
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
              Back
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">
              Next →
            </button>
          ) : (
            <button onClick={onDismiss} className="btn-primary flex-1">
              Got it — let's go
            </button>
          )}
        </div>
        <div className="text-center mt-3">
          <button onClick={onDismiss} className="btn-text text-[11px]">
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
