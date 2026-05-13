// All types from §5 of the spec — Task 9 Class Model (2 subjects, 5 objects, 11 associations)

export type Archetype = 'casual' | 'hardcore' | 'completionist';
export type Rank = 'bronze' | 'silver' | 'gold';
export type Difficulty = 'easy' | 'normal' | 'hard';

export type EventTypeId =
  | 'tutorial'
  | 'reward'
  | 'spike'
  | 'boss'
  | 'story'
  | 'rest'
  | 'puzzle'
  | 'secret';

export interface CurveEffect {
  // signed deltas to apply across the 9 curve points (rounds 0–8)
  // index 0 = round 0 (baseline), 1..8 map to rounds after each placement
  deltas: number[];
}

export interface EventType {
  id: EventTypeId;
  name: string;
  icon: string;
  color: string;
  description: string;
  effect: (round: number, placed: PlacedEvent[]) => CurveEffect;
}

export interface PlacedEvent {
  eventTypeId: EventTypeId;
  round: number; // 0–7
  placedAt: string;
  secretBonus?: number; // revealed at end for the Secret event
}

export interface SatisfactionCurve {
  values: number[]; // length 9
  target: number[]; // length 9 (from archetype)
  rmse: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  badges: Badge[];
  createdAt: string;
  hasSeenOnboarding: boolean;
  storyEventsLifetime: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  archetype: Archetype;
  events: PlacedEvent[];
  curve: number[]; // length 9
  score: number;
  rank: Rank;
  startedAt: string;
  completedAt?: string;
}

export interface Settings {
  difficulty: Difficulty;
  hintsOn: boolean;
  notificationsOn: boolean;
  soundOn: boolean;
  enabledEventTypes: EventTypeId[];
}

export interface AppState {
  player: Player | null;
  currentSession: GameSession | null;
  sessions: GameSession[];
  settings: Settings;
}
