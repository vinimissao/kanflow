import { useState, type FormEvent } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { ColumnStatus, KanbanCard } from '../../types'
import KanbanCardView from '../Card/Card'

type ColumnProps = {
  status: ColumnStatus
  title: string
  cards: KanbanCard[]
  activeCard: KanbanCard | null
  overColumn: ColumnStatus | null
  onSelectCard: (cardId: string) => void
  onAddCard: (input: {
    title: string
    description: string
    assignee: string
    status: ColumnStatus
  }) => void
}

export default function Column({
  status,
  title,
  cards,
  activeCard,
  overColumn,
  onSelectCard,
  onAddCard,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  const showPlaceholder = Boolean(
    activeCard && overColumn === status && activeCard.status !== status,
  )

  const [isAdding, setIsAdding] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formAssignee, setFormAssignee] = useState('')

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormAssignee('')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onAddCard({
      title: formTitle,
      description: formDescription,
      assignee: formAssignee,
      status,
    })
    resetForm()
    setIsAdding(false)
  }

  return (
    <section
      ref={setNodeRef}
      className={[
        'min-w-[280px] flex-1 rounded-2xl bg-gray-50',
        'border border-gray-100 p-3',
        'transition-colors',
        isOver ? 'ring-2 ring-indigo-500' : 'ring-0',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            aria-label={`Adicionar card em ${title}`}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-white/60 text-lg font-semibold text-indigo-700 transition hover:bg-white"
          >
            +
          </button>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-600">
          {cards.length}
        </span>
      </div>

      {isAdding ? (
        <form onSubmit={submit} className="mt-3 rounded-2xl border border-gray-200 bg-white p-3">
          <div className="flex flex-col gap-2">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Título"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-400"
            />
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Descrição"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-400"
            />
            <input
              value={formAssignee}
              onChange={(e) => setFormAssignee(e.target.value)}
              placeholder="Responsável"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-400"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsAdding(false)
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        {cards.map((card) => (
          <KanbanCardView key={card.id} card={card} onSelect={onSelectCard} />
        ))}

        {showPlaceholder ? (
          <div className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 p-3">
            <h3 className="text-sm font-semibold text-indigo-900">{activeCard?.title}</h3>
            <p className="mt-1 text-xs text-indigo-800">Solte aqui para mover</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

