import { create } from 'zustand';
import type {
  AppState,
  Archetype,
  Badge,
  EventTypeId,
  GameSession,
  PlacedEvent,
  Settings,
} from '../types';
import { defaultState, loadState, saveState } from '../lib/storage';
import { computeCurve, score } from '../game/curve';
import { rankFor } from '../game/scoring';
import { rollSecretBonus } from '../game/eventTypes';

interface StoreActions {
  setPlayer: (name: string, email: string) => void;
  startSession: (archetype: Archetype) => void;
  placeEvent: (eventTypeId: EventTypeId, round: number) => void;
  finalizeSession: () => GameSession | null;
  abandonSession: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  markOnboardingSeen: () => void;
  signOut: () => void;
  earnBadges: () => Badge[];
  reset: () => void;
}

type Store = AppState & StoreActions;

function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function persist(state: AppState) {
  saveState({
    player: state.player,
    currentSession: state.currentSession,
    sessions: state.sessions,
    settings: state.settings,
  });
}

const initial = loadState();

export const useStore = create<Store>((set, get) => ({
  ...initial,

  setPlayer: (name, email) => {
    const existing = get().player;
    if (existing) {
      const updated = { ...existing, name: name || existing.name, email: email || existing.email };
      set({ player: updated });
      persist(get());
      return;
    }
    set({
      player: {
        id: uid('p_'),
        name: name || 'Player',
        email: email || 'player@rtu.lv',
        level: 1,
        xp: 0,
        badges: [],
        createdAt: new Date().toISOString(),
        hasSeenOnboarding: false,
        storyEventsLifetime: 0,
      },
    });
    persist(get());
  },

  startSession: (archetype) => {
    const player = get().player;
    if (!player) return;
    const session: GameSession = {
      id: uid('s_'),
      playerId: player.id,
      archetype,
      events: [],
      curve: computeCurve([]),
      score: 0,
      rank: 'bronze',
      startedAt: new Date().toISOString(),
    };
    set({ currentSession: session });
    persist(get());
  },

  placeEvent: (eventTypeId, round) => {
    const session = get().currentSession;
    if (!session) return;
    // Remove any existing event in this round (replacement allowed)
    const events = session.events.filter((e) => e.round !== round);
    const placed: PlacedEvent = {
      eventTypeId,
      round,
      placedAt: new Date().toISOString(),
    };
    if (eventTypeId === 'secret') placed.secretBonus = rollSecretBonus();
    events.push(placed);
    events.sort((a, b) => a.round - b.round);
    const curve = computeCurve(events);
    set({ currentSession: { ...session, events, curve } });
    persist(get());
  },

  finalizeSession: () => {
    const state = get();
    const session = state.currentSession;
    if (!session) return null;
    const curve = computeCurve(session.events);
    const s = score(curve, session.archetype, state.settings.difficulty);
    const finalized: GameSession = {
      ...session,
      events: session.events,
      curve,
      score: s,
      rank: rankFor(s),
      completedAt: new Date().toISOString(),
    };
    const player = state.player;
    const updatedPlayer = player
      ? {
          ...player,
          xp: player.xp + s,
          level: 1 + Math.floor((player.xp + s) / 200),
          storyEventsLifetime:
            player.storyEventsLifetime +
            session.events.filter((e) => e.eventTypeId === 'story').length,
        }
      : player;
    set({
      currentSession: null,
      sessions: [finalized, ...state.sessions],
      player: updatedPlayer,
    });
    // Earn badges AFTER the session is saved so logic sees fresh totals.
    get().earnBadges();
    persist(get());
    return finalized;
  },

  abandonSession: () => {
    set({ currentSession: null });
    persist(get());
  },

  updateSettings: (patch) => {
    set({ settings: { ...get().settings, ...patch } });
    persist(get());
  },

  markOnboardingSeen: () => {
    const player = get().player;
    if (!player) return;
    set({ player: { ...player, hasSeenOnboarding: true } });
    persist(get());
  },

  signOut: () => {
    set({ ...defaultState() });
    persist(get());
  },

  reset: () => {
    set({ ...defaultState() });
    persist(get());
  },

  earnBadges: () => {
    const state = get();
    const player = state.player;
    if (!player) return [];
    const have = new Set(player.badges.map((b) => b.id));
    const now = new Date().toISOString();
    const newBadges: Badge[] = [];
    const completed = state.sessions.filter((s) => s.completedAt);

    if (completed.length >= 1 && !have.has('first-game')) {
      newBadges.push({ id: 'first-game', name: 'First Game', icon: '🎯', earnedAt: now });
    }
    if (completed.length >= 10 && !have.has('ten-sessions')) {
      newBadges.push({ id: 'ten-sessions', name: '10 Sessions', icon: '🔟', earnedAt: now });
    }
    if (completed.some((s) => s.rank === 'gold') && !have.has('curve-master')) {
      newBadges.push({ id: 'curve-master', name: 'Curve Master', icon: '📐', earnedAt: now });
    }
    if (player.storyEventsLifetime >= 10 && !have.has('story-architect')) {
      newBadges.push({
        id: 'story-architect',
        name: 'Story Architect',
        icon: '📜',
        earnedAt: now,
      });
    }
    if (newBadges.length > 0) {
      set({
        player: { ...player, badges: [...player.badges, ...newBadges] },
      });
      persist(get());
    }
    return newBadges;
  },
}));
