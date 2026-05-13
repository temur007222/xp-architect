import { useDraggable } from '@dnd-kit/core';
import type { EventType } from '../types';

interface EventTileProps {
  event: EventType;
  disabled?: boolean;
}

export function EventTile({ event, disabled }: EventTileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `event-${event.id}`,
    data: { eventTypeId: event.id },
    disabled,
  });

  const style: React.CSSProperties = {
    backgroundColor: event.color,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
    touchAction: 'none',
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold text-[9px] select-none active:scale-95 transition-transform shadow-sm"
      aria-label={`Drag ${event.name}`}
      type="button"
    >
      <span className="text-[20px] leading-none mb-1">{event.icon}</span>
      <span className="leading-tight text-center px-0.5">{event.name}</span>
    </button>
  );
}
