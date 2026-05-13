import type { Archetype } from '../types';

// Target curves per §3.2 of the spec — length 9 (rounds 0–8)
export const TARGETS: Record<Archetype, number[]> = {
  casual: [50, 60, 65, 70, 72, 75, 78, 80, 82],
  hardcore: [30, 50, 35, 65, 45, 80, 60, 95, 90],
  completionist: [40, 50, 60, 65, 72, 78, 85, 92, 98],
};

export const ARCHETYPE_META: Record<
  Archetype,
  { name: string; icon: string; tagline: string; description: string }
> = {
  casual: {
    name: 'Casual',
    icon: '🌿',
    tagline: 'Gentle rise · low variance',
    description: 'Short sessions, gentle difficulty, rewards-driven. Target peaks 70–82.',
  },
  hardcore: {
    name: 'Hardcore',
    icon: '⚔️',
    tagline: 'Peaks · valleys · big finale',
    description: 'Tension-release pattern. Wants struggle then triumph. Target swings 30–95.',
  },
  completionist: {
    name: 'Completionist',
    icon: '📈',
    tagline: 'Steady linear incline',
    description: 'Wants progressive mastery, no surprises, ends near 100.',
  },
};
