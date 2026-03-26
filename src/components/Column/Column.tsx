import { useState, type FormEvent } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { CardDifficulty, ColumnStatus, KanbanCard } from '../../types'
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
    difficulty: CardDifficulty
    developmentTime: string
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
  const [formDifficulty, setFormDifficulty] = useState<CardDifficulty>('Média')
  const [formDevelopmentTime, setFormDevelopmentTime] = useState('')

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormAssignee('')
    setFormDifficulty('Média')
    setFormDevelopmentTime('')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onAddCard({
      title: formTitle,
      description: formDescription,
      assignee: formAssignee,
      difficulty: formDifficulty,
      developmentTime: formDevelopmentTime,
      status,
    })
    resetForm()
    setIsAdding(false)
  }

  return (
    <section
      ref={setNodeRef}
      className={[
        'flex min-w-[300px] flex-1 flex-col rounded-2xl border border-gray-200/70 bg-white/50 p-4',
        'shadow-sm shadow-gray-900/5 transition-colors duration-200',
        isOver ? 'ring-2 ring-fuchsia-400/50 ring-offset-2 ring-offset-[#F4F5F7]' : 'ring-0',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3 px-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            aria-label={`Adicionar card em ${title}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-base font-medium text-gray-500 transition hover:border-fuchsia-300 hover:text-fuchsia-600"
          >
            +
          </button>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-gray-500">
          {cards.length}
        </span>
      </div>

      {isAdding ? (
        <form
          onSubmit={submit}
          className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-card"
        >
          <div className="flex flex-col gap-2.5">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Título"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
            />
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Descrição"
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
            />
            <input
              value={formAssignee}
              onChange={(e) => setFormAssignee(e.target.value)}
              placeholder="Responsável"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
            />
            <select
              value={formDifficulty}
              onChange={(e) => setFormDifficulty(e.target.value as CardDifficulty)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-0 transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
            <input
              value={formDevelopmentTime}
              onChange={(e) => setFormDevelopmentTime(e.target.value)}
              placeholder="Tempo de desenvolvimento (ex: 8 horas)"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
            />

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/25 transition hover:opacity-95"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsAdding(false)
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {cards.map((card) => (
          <KanbanCardView key={card.id} card={card} onSelect={onSelectCard} />
        ))}

        {showPlaceholder ? (
          <div className="rounded-2xl border-2 border-dashed border-fuchsia-300/60 bg-fuchsia-50/50 p-4">
            <h3 className="text-sm font-bold text-gray-900">{activeCard?.title}</h3>
            <p className="mt-1 text-xs font-medium text-fuchsia-700">Solte aqui para mover</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
