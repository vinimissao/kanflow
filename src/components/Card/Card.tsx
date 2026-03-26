import { useDraggable } from '@dnd-kit/core'
import type { CardDifficulty, KanbanCard } from '../../types'

type CardProps = {
  card: KanbanCard
  onSelect?: (cardId: string) => void
}

function getCategoryPill(difficulty: CardDifficulty) {
  switch (difficulty) {
    case 'Baixa':
      return {
        label: 'Maintenance',
        className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
      }
    case 'Média':
      return {
        label: 'Feature',
        className: 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-100',
      }
    case 'Alta':
      return {
        label: 'Hotfix',
        className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
      }
    default:
      return {
        label: 'Task',
        className: 'bg-slate-50 text-slate-700 ring-1 ring-slate-100',
      }
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

function PriorityGlyph({ difficulty }: { difficulty: CardDifficulty }) {
  const common = 'h-4 w-4 shrink-0'
  if (difficulty === 'Baixa') {
    return (
      <span className={`${common} flex flex-col justify-center gap-0.5`} aria-hidden>
        <span className="h-0.5 w-3 rounded-full bg-emerald-400" />
        <span className="h-0.5 w-2 rounded-full bg-emerald-300" />
        <span className="h-0.5 w-3 rounded-full bg-emerald-400" />
      </span>
    )
  }
  if (difficulty === 'Média') {
    return (
      <span className={`${common} flex items-center justify-center`} aria-hidden>
        <span className="h-3 w-3 rotate-45 rounded-sm border-2 border-amber-400 bg-amber-50" />
      </span>
    )
  }
  return (
    <span className={`${common} flex items-center justify-center`} aria-hidden>
      <span className="h-0 w-0 border-x-[6px] border-b-[10px] border-x-transparent border-b-rose-500" />
    </span>
  )
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

  const totalChecklist = card.checklists.length
  const doneChecklist = card.checklists.filter((item) => item.done).length
  const category = getCategoryPill(card.difficulty)

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: getTransformStyle(transform),
      }}
      onClick={() => onSelect?.(card.id)}
      className={[
        'group relative rounded-2xl border border-gray-100/80 bg-white p-4 shadow-card',
        'cursor-pointer transition-shadow duration-200 hover:shadow-md',
        isDragging ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            'inline-flex max-w-[85%] rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight',
            category.className,
          ].join(' ')}
        >
          {category.label}
        </span>
        <button
          type="button"
          aria-label="Arrastar card"
          onClick={(e) => e.stopPropagation()}
          className={[
            '-mr-1 -mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            'border border-transparent text-gray-400 transition',
            'touch-none cursor-grab hover:border-gray-200 hover:bg-gray-50 hover:text-gray-600',
            'active:cursor-grabbing',
          ].join(' ')}
          {...attributes}
          {...listeners}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>
      </div>

      <h3 className="mt-2.5 line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-gray-900">
        {card.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500">{card.description}</p>

      <p className="mt-3 text-[11px] font-medium text-gray-400">
        {totalChecklist > 0 ? (
          <span>
            Checklist {doneChecklist}/{totalChecklist}
          </span>
        ) : (
          <span>Sem checklist</span>
        )}
        <span className="mx-1.5 text-gray-300">•</span>
        <span>
          {card.comments.length} comentário{card.comments.length === 1 ? '' : 's'}
        </span>
      </p>

      <div className="mt-4 flex items-end justify-between gap-2 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-1.5 text-gray-400" title={`Prioridade: ${card.difficulty}`}>
          <PriorityGlyph difficulty={card.difficulty} />
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {card.difficulty}
          </span>
        </div>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 text-[11px] font-bold text-white shadow-sm ring-2 ring-white"
          title={card.assignee}
        >
          {getInitials(card.assignee)}
        </div>
      </div>
    </article>
  )
}
