import { useDroppable } from '@dnd-kit/core';
import type { PlacedEvent } from '../types';
import { EVENT_TYPES } from '../game/eventTypes';

interface TimelineSlotProps {
  round: number;
  placed?: PlacedEvent;
  active?: boolean;
  onClick?: () => void;
}

export function TimelineSlot({ round, placed, active, onClick }: TimelineSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${round}`,
    data: { round },
  });

  const event = placed ? EVENT_TYPES[placed.eventTypeId] : null;

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      type="button"
      className={[
        'relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all',
        isOver
          ? 'border-teal bg-teal-light scale-105'
          : active
            ? 'border-teal bg-white'
            : event
              ? 'border-transparent'
              : 'border-dashed border-gray-light bg-gray-light/10',
      ].join(' ')}
      style={event ? { backgroundColor: event.color } : undefined}
      aria-label={`Round ${round + 1}${event ? `, placed ${event.name}` : ', empty'}`}
    >
      {event ? (
        <span className="text-white text-[16px] leading-none">{event.icon}</span>
      ) : (
        <span className="text-[10px] font-bold text-gray">{round + 1}</span>
      )}
      <span
        className={[
          'absolute -bottom-4 text-[9px] font-semibold',
          event ? 'text-teal' : 'text-gray',
        ].join(' ')}
      >
        R{round + 1}
      </span>
    </button>
  );
}
