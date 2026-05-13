import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useStore } from '../store/useStore';
import type { Archetype } from '../types';
import { ARCHETYPE_META, TARGETS } from '../game/archetypes';

function MiniSparkline({ values }: { values: number[] }) {
  const w = 100;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / 100) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7">
      <polyline points={points} fill="none" stroke="#D9A7C7" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  );
}

export function W3Setup() {
  const navigate = useNavigate();
  const startSession = useStore((s) => s.startSession);
  const [selected, setSelected] = useState<Archetype | null>(null);

  const archetypes: Archetype[] = ['casual', 'hardcore', 'completionist'];

  const handleContinue = () => {
    if (!selected) return;
    startSession(selected);
    navigate('/play');
  };

  return (
    <Layout title="Choose archetype" onBack={() => navigate('/')}>
      <div className="p-4">
        <h2 className="h1">Who are you designing for?</h2>
        <p className="muted mb-4">
          Each archetype wants a different satisfaction curve. Pick one — you can change next round.
        </p>
        {archetypes.map((a) => {
          const meta = ARCHETYPE_META[a];
          const isSelected = selected === a;
          return (
            <button
              key={a}
              onClick={() => setSelected(a)}
              className={[
                'w-full text-left rounded-xl p-3 mb-2.5 transition-all flex items-center gap-3',
                isSelected
                  ? 'border-2 border-teal bg-teal-light'
                  : 'border-2 border-gray-line bg-white hover:border-teal',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center text-white text-xl shrink-0">
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-dark">{meta.name}</div>
                <div className="text-[10px] text-gray leading-tight">{meta.description}</div>
                <div className="mt-1">
                  <MiniSparkline values={TARGETS[a]} />
                </div>
              </div>
              {isSelected && (
                <div className="text-teal text-lg shrink-0">✓</div>
              )}
            </button>
          );
        })}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="btn-primary w-full mt-3"
        >
          Continue → Place Events
        </button>
      </div>
    </Layout>
  );
}
