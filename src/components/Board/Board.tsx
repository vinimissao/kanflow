import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import Column from '../Column/Column'
import { useKanban } from '../../hooks/useKanban'
import type { CardDifficulty } from '../../types'

function getCategoryPillClass(difficulty: CardDifficulty) {
  switch (difficulty) {
    case 'Baixa':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
    case 'Média':
      return 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-100'
    case 'Alta':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
    default:
      return 'bg-slate-50 text-slate-700 ring-1 ring-slate-100'
  }
}

function categoryLabel(difficulty: CardDifficulty) {
  switch (difficulty) {
    case 'Baixa':
      return 'Maintenance'
    case 'Média':
      return 'Feature'
    case 'Alta':
      return 'Hotfix'
    default:
      return 'Task'
  }
}

type BoardProps = {
  kanban: ReturnType<typeof useKanban>
}

export default function Board({ kanban }: BoardProps) {
  const {
    cards,
    columns,
    sensors,
    activeCard,
    overColumn,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    addCard,
    updateCardDetails,
    addChecklistItem,
    toggleChecklistItem,
    addCardComment,
  } = kanban

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const selectedCard = useMemo(
    () => (selectedCardId ? cards.find((c) => c.id === selectedCardId) ?? null : null),
    [cards, selectedCardId],
  )

  const [assigneeDraft, setAssigneeDraft] = useState('')
  const [difficultyDraft, setDifficultyDraft] = useState<CardDifficulty>('Média')
  const [developmentTimeDraft, setDevelopmentTimeDraft] = useState('')
  const [newChecklistText, setNewChecklistText] = useState('')
  const [newCommentText, setNewCommentText] = useState('')

  useEffect(() => {
    if (!selectedCard) return
    setAssigneeDraft(selectedCard.assignee)
    setDifficultyDraft(selectedCard.difficulty)
    setDevelopmentTimeDraft(selectedCard.developmentTime)
    setNewChecklistText('')
    setNewCommentText('')
  }, [selectedCard?.id])

  const activeChecklistTotal = activeCard?.checklists.length ?? 0
  const activeChecklistDone = activeCard
    ? activeCard.checklists.filter((item) => item.done).length
    : 0

  const selectedChecklistTotal = selectedCard?.checklists.length ?? 0
  const selectedChecklistDone = selectedCard
    ? selectedCard.checklists.filter((item) => item.done).length
    : 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
        <div className="flex min-w-max gap-5">
          {columns.map((column) => (
            <Column
              key={column.status}
              status={column.status}
              title={column.title}
              cards={cards.filter((c) => c.status === column.status)}
              activeCard={activeCard}
              overColumn={overColumn}
              onAddCard={addCard}
              onSelectCard={(cardId) => setSelectedCardId(cardId)}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="pointer-events-none max-w-[320px] rotate-1">
            <div className="rounded-2xl border border-gray-100/80 bg-white p-4 shadow-lg shadow-gray-900/10">
              <span
                className={[
                  'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                  getCategoryPillClass(activeCard.difficulty),
                ].join(' ')}
              >
                {categoryLabel(activeCard.difficulty)}
              </span>
              <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-gray-900">{activeCard.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[13px] text-gray-500">{activeCard.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-gray-400">
                <span>Tempo: {activeCard.developmentTime}</span>
                <span>
                  Checklist {activeChecklistDone}/{activeChecklistTotal}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {selectedCard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121417]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-900/20">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className={[
                    'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                    getCategoryPillClass(selectedCard.difficulty),
                  ].join(' ')}
                >
                  {categoryLabel(selectedCard.difficulty)}
                </span>
                <h3 className="mt-2 truncate text-lg font-bold text-gray-900">{selectedCard.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                    {selectedCard.assignee}
                  </span>
                  <span className="rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-[11px] font-semibold text-fuchsia-800 ring-1 ring-fuchsia-100">
                    {selectedCard.difficulty}
                  </span>
                  <span className="rounded-full border border-gray-100 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                    Tempo: {selectedCard.developmentTime}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{selectedCard.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardId(null)}
                className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateCardDetails(selectedCard.id, {
                  assignee: assigneeDraft,
                  difficulty: difficultyDraft,
                  developmentTime: developmentTimeDraft,
                })
              }}
              className="mt-5"
            >
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Responsável</label>
                  <input
                    value={assigneeDraft}
                    onChange={(e) => setAssigneeDraft(e.target.value)}
                    placeholder="Ex: Maria"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Dificuldade</label>
                  <select
                    value={difficultyDraft}
                    onChange={(e) => setDifficultyDraft(e.target.value as CardDifficulty)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Tempo de desenvolvimento do card
                  </label>
                  <input
                    value={developmentTimeDraft}
                    onChange={(e) => setDevelopmentTimeDraft(e.target.value)}
                    placeholder="Ex: 8 horas"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/25 transition hover:opacity-95"
                >
                  Salvar detalhes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-gray-900">Checklists</h4>
                <span className="text-xs font-medium text-gray-400">
                  {selectedChecklistDone}/{selectedChecklistTotal}
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {selectedCard.checklists.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum item ainda.</p>
                ) : (
                  selectedCard.checklists.map((item) => (
                    <label key={item.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(selectedCard.id, item.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <span className={item.done ? 'line-through text-gray-400' : 'text-gray-700'}>
                        {item.text}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  addChecklistItem(selectedCard.id, newChecklistText)
                  setNewChecklistText('')
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Adicionar item de checklist"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:opacity-95"
                >
                  Adicionar
                </button>
              </form>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-gray-900">Comentários</h4>
                <span className="text-xs font-medium text-gray-400">{selectedCard.comments.length}</span>
              </div>

              <div className="mt-2 max-h-36 space-y-2 overflow-auto pr-1">
                {selectedCard.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">Sem comentários.</p>
                ) : (
                  selectedCard.comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-gray-100 bg-[#F4F5F7] p-2.5">
                      <p className="text-[11px] text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 break-words text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  addCardComment(selectedCard.id, newCommentText)
                  setNewCommentText('')
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Escreva um comentário"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:opacity-95"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </DndContext>
  )
}

