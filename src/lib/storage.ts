import type { AppState } from '../types';

const KEY = 'xp-architect-v1';

export function defaultState(): AppState {
  return {
    player: null,
    currentSession: null,
    sessions: [],
    settings: {
      difficulty: 'normal',
      hintsOn: true,
      notificationsOn: false,
      soundOn: false,
      enabledEventTypes: [
        'tutorial',
        'reward',
        'spike',
        'boss',
        'story',
        'rest',
        'puzzle',
        'secret',
      ],
    },
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    // Merge with defaults so newly-added settings keys don't crash older saves.
    return {
      ...defaultState(),
      ...parsed,
      settings: { ...defaultState().settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (incognito, quota); fail silently.
  }
}
