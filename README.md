# XP Architect

> Functional web prototype of the XP Architect player-experience design meta-game.
> Riga Technical University · 25/26-P · Fundamentals of Computer Systems Design · Task 11.

**Live prototype:** https://temur007222.github.io/xp-architect/

---

## What this is

A meta-game where the player acts as a game designer. You place 8 events on a
satisfaction timeline and try to match a target curve for the chosen player
archetype (Casual, Hardcore, Completionist). Closer to the target = higher score.

| | |
|---|---|
| **Course** | Datorsistēmu projektēšanas pamati / Fundamentals of Computer Systems Design |
| **Instructor** | Ksenija Lāce |
| **Team leader** | Temurbek Khaydarov · 231ADB143 |
| **Stack** | React 19 · Vite · TypeScript · Tailwind · @dnd-kit · Recharts · Zustand · React Router |
| **Persistence** | `localStorage` (no backend) |
| **Deploy target** | GitHub Pages |

## Run locally

```bash
npm install
npm run dev        # dev server at http://localhost:5173/xp-architect/
npm run test       # vitest — 11 game-logic tests
npm run build      # tsc + vite build → dist/
npm run preview    # serve the production build
```

## Deploy

```bash
npm run deploy     # builds and pushes dist/ to gh-pages branch
```

Or push to `main` — GitHub Actions (`.github/workflows/deploy.yml`) builds and
publishes automatically.

## Top-priority usability fixes implemented (from Task 11)

| Fix | Insight | Where in code |
|---|---|---|
| **B1** | Target curve is invisible | `src/components/SatisfactionChart.tsx` — pink-acc dashed 3px line with a labelled "TARGET" callout at the right endpoint and a "Match the dashed line for the best score" caption above. |
| **A2** | Tutorial skipped by 4/5 first-time users | `src/components/OnboardingModal.tsx` + `src/screens/W2Home.tsx` — a 3-step modal that shows on the very first launch only, persisted via `player.hasSeenOnboarding`. |
| **B3** | Orange "Lock final event" reads as error | `src/screens/W5Final.tsx` — Lock button is primary teal, warning moved into a `ConfirmModal` shown after tap, with explicit irreversibility wording. |

Bonus fixes also applied:

- **A1** — Sign In is the primary button on W1, "Create account" is a secondary text link.
- **B2** — W4 has a visible progress bar above the timeline alongside the round counter.
- **C2** — Settings rows have chevrons and bordered button style (W11).
- **C3** — Tapping a history row opens `W10HistoryDetail`, not a generic Summary loop.

## Test scenarios supported (Task 11)

1. **First-time onboarding** — W1 → W2 → (W12 optional) → W3 → W4
2. **Design a complete game session** — W2 → W3 → W4 → W5 → W6
3. **Check progress and adjust settings** — W6 → W7 → W10 → W8 → W11

## Project structure

```
src/
  types/                  // All types from Task 9 class model
  game/                   // Pure game logic (no React)
    archetypes.ts         //   TARGETS const + metadata
    eventTypes.ts         //   EVENT_TYPES + effect functions
    curve.ts              //   computeCurve, rmse, score (§3.4)
    scoring.ts            //   rank tiers, insight generation
    __tests__/curve.test.ts
  lib/
    storage.ts            // localStorage wrapper with versioned key
    seed.ts               // fictional leaderboard data
  store/useStore.ts       // Zustand store, persists every mutation
  components/             // Reusable UI (TopBar, NavDrawer, EventTile…)
  screens/                // W1Login … W12Tutorial
  App.tsx                 // HashRouter + route table
  main.tsx                // entry point
```

## Acceptance criteria (from spec §10) — verified

- [x] All 12 screens render and are navigable
- [x] Login → Setup → Play (8 events) → Final → Summary → Leaderboard → History → Settings → Sign out
- [x] Drag-and-drop works on desktop (PointerSensor) and mobile (TouchSensor)
- [x] Satisfaction curve recomputes within 100ms of each placement
- [x] Score formula matches §3.4 (covered by vitest)
- [x] Sessions persist across reloads via localStorage
- [x] All 3 top-priority usability fixes are visibly implemented
- [x] `npm run build` succeeds without errors

---

XP Architect · Task 11 prototype · Riga Technical University · 25/26-P
