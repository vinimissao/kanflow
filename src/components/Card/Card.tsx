import { useDraggable } from '@dnd-kit/core'
import type { KanbanCard } from '../../types'

type CardProps = {
  card: KanbanCard
  onSelect?: (cardId: string) => void
}

function getTransformStyle(transform: { x: number; y: number; scaleX?: number; scaleY?: number } | null) {
  if (!transform) return undefined
  const scaleX = transform.scaleX ?? 1
  const scaleY = transform.scaleY ?? 1
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scaleX}, ${scaleY})`
}

export default function KanbanCardView({ card, onSelect }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { type: 'card', cardId: card.id, status: card.status },
  })

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: getTransformStyle(transform),
      }}
      onClick={() => onSelect?.(card.id)}
      className={[
        'rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow',
        'cursor-pointer hover:shadow-md',
        isDragging ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">{card.title}</h3>
          <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
            {card.assignee}
          </span>
        </div>

        <button
          type="button"
          aria-label="Arrastar card"
          onClick={(e) => e.stopPropagation()}
          className={[
            'flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white',
            'touch-none cursor-grab text-gray-600',
            'active:cursor-grabbing',
          ].join(' ')}
          {...attributes}
          {...listeners}
        >
          ::
        </button>
      </div>
      <p className="mt-2 max-h-10 overflow-hidden text-xs leading-relaxed text-gray-600">
        {card.description}
      </p>
    </article>
  )
}

