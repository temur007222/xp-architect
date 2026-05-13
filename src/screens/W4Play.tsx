import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Layout } from '../components/Layout';
import { SatisfactionChart } from '../components/SatisfactionChart';
import { EventTile } from '../components/EventTile';
import { TimelineSlot } from '../components/TimelineSlot';
import { useStore } from '../store/useStore';
import { EVENT_LIST, EVENT_TYPES } from '../game/eventTypes';
import { TARGETS, ARCHETYPE_META } from '../game/archetypes';
import type { EventTypeId } from '../types';

const PLACE_ROUNDS = 7; // first 7 rounds on W4 (index 0..6); round 7 handled by W5

/**
 * W4 — Place Events (CORE SCREEN).
 *
 * FIX B1: Satisfaction chart shows the TARGET line in pink-acc, 3px dashed,
 *         labelled "TARGET" at the rightmost point, with an explicit caption.
 * FIX B2: A visible progress bar at the top, in addition to the round counter.
 * FIX A2: Onboarding already handled on W2 — by the time the user reaches W4
 *         they have either seen it or explicitly skipped it.
 */
export function W4Play() {
  const navigate = useNavigate();
  const session = useStore((s) => s.currentSession);
  const settings = useStore((s) => s.settings);
  const placeEvent = useStore((s) => s.placeEvent);
  const [dragging, setDragging] = useState<EventTypeId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 6 } })
  );

  // Redirect to setup if there's no active session
  useEffect(() => {
    if (!session) {
      navigate('/play/setup', { replace: true });
    }
  }, [session, navigate]);

  // Auto-advance to W5 once the first 7 rounds are filled
  const filledFirstSeven = useMemo(() => {
    if (!session) return false;
    const rounds = new Set(session.events.map((e) => e.round));
    return Array.from({ length: PLACE_ROUNDS }, (_, i) => i).every((r) => rounds.has(r));
  }, [session]);

  useEffect(() => {
    if (filledFirstSeven) {
      navigate('/play/final');
    }
  }, [filledFirstSeven, navigate]);

  if (!session) return null;

  const target = TARGETS[session.archetype];
  const placedByRound = new Map(session.events.map((e) => [e.round, e]));
  const placedCount = session.events.filter((e) => e.round < PLACE_ROUNDS).length;
  const progress = Math.round((placedCount / PLACE_ROUNDS) * 100);
  const nextEmptyRound =
    Array.from({ length: PLACE_ROUNDS }, (_, i) => i).find((r) => !placedByRound.has(r)) ?? null;

  const enabled = new Set(settings.enabledEventTypes);
  const visibleEvents = EVENT_LIST.filter((e) => enabled.has(e.id));

  function handleDragStart(e: DragStartEvent) {
    setDragging((e.active.data.current?.eventTypeId as EventTypeId) ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    const eventTypeId = e.active.data.current?.eventTypeId as EventTypeId | undefined;
    const round = e.over?.data.current?.round as number | undefined;
    setDragging(null);
    if (eventTypeId === undefined || round === undefined) return;
    if (round >= PLACE_ROUNDS) return; // final round only via W5
    placeEvent(eventTypeId, round);
  }

  return (
    <Layout title={`Round ${Math.min(placedCount + 1, PLACE_ROUNDS)} / 8`}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="p-4 pb-6">
          {/* Round counter + B2 fix: visible progress bar */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[12px] font-bold text-dark">
              Round {Math.min(placedCount + 1, PLACE_ROUNDS)} of 8
            </div>
            <div className="text-[11px] text-gray">
              {ARCHETYPE_META[session.archetype].icon} {ARCHETYPE_META[session.archetype].name}
            </div>
          </div>
          <div className="h-2 bg-gray-light/50 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-teal transition-all duration-300"
              style={{ width: `${progress}%` }}
              aria-label={`Progress ${progress}%`}
            />
          </div>

          {/* Satisfaction chart (B1 fix lives inside this component) */}
          <div className="card mb-3 p-3">
            <SatisfactionChart
              player={session.curve}
              target={target}
              currentRound={placedCount}
              height={170}
            />
          </div>

          {/* Timeline */}
          <div className="mb-1 flex items-center justify-between">
            <div className="lbl">Timeline · drag events here</div>
            {nextEmptyRound !== null && (
              <div className="text-[10px] text-teal font-semibold">Next: R{nextEmptyRound + 1}</div>
            )}
          </div>
          <div className="grid grid-cols-8 gap-1.5 pb-5 mb-2">
            {Array.from({ length: 8 }, (_, i) => (
              <TimelineSlot
                key={i}
                round={i}
                placed={placedByRound.get(i)}
                active={i === nextEmptyRound}
              />
            ))}
          </div>

          {/* Event pool */}
          <div className="lbl mt-3">Event pool · 8 types</div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {visibleEvents.map((ev) => (
              <EventTile key={ev.id} event={ev} />
            ))}
          </div>

          {/* Help text */}
          <div className="text-[11px] text-gray bg-teal-faint rounded-lg p-2 leading-relaxed">
            💡 Tip: drag a tile onto a numbered slot. You can drop on any round — the
            satisfaction curve recomputes each time.
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => navigate('/play/setup')}
              className="btn-outline flex-1"
            >
              ↺ Change archetype
            </button>
            <button
              onClick={() => navigate('/play/final')}
              disabled={!filledFirstSeven}
              className="btn-primary flex-1"
            >
              Final round →
            </button>
          </div>
        </div>
        <DragOverlay>
          {dragging && (
            <div
              style={{ backgroundColor: EVENT_TYPES[dragging].color }}
              className="aspect-square w-16 rounded-lg flex flex-col items-center justify-center text-white font-bold text-[9px] shadow-xl"
            >
              <span className="text-[20px] leading-none mb-0.5">{EVENT_TYPES[dragging].icon}</span>
              <span>{EVENT_TYPES[dragging].name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </Layout>
  );
}
