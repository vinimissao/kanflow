import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import Column from '../Column/Column'
import { useKanban } from '../../hooks/useKanban'
import type { CardDifficulty } from '../../types'

function getDifficultyBadge(difficulty: CardDifficulty) {
  switch (difficulty) {
    case 'Baixa':
      return 'bg-green-50 text-green-700'
    case 'Média':
      return 'bg-indigo-50 text-indigo-700'
    case 'Alta':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-50 text-gray-700'
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
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
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
          <div className="pointer-events-none">
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{activeCard.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    {activeCard.assignee}
                  </span>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                      getDifficultyBadge(activeCard.difficulty),
                    ].join(' ')}
                  >
                    {activeCard.difficulty}
                  </span>
                </div>
              </div>
              <p className="mt-2 max-h-10 overflow-hidden text-xs leading-relaxed text-gray-600">
                {activeCard.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700">
                  Tempo: {activeCard.developmentTime}
                </span>
                <span className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700">
                  Checklist: {activeChecklistDone}/{activeChecklistTotal}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {selectedCard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900">{selectedCard.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    {selectedCard.assignee}
                  </span>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      getDifficultyBadge(selectedCard.difficulty),
                    ].join(' ')}
                  >
                    {selectedCard.difficulty}
                  </span>
                  <span className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700">
                    Tempo: {selectedCard.developmentTime}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{selectedCard.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardId(null)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-50"
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
              className="mt-4"
            >
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-800">Responsável</label>
                  <input
                    value={assigneeDraft}
                    onChange={(e) => setAssigneeDraft(e.target.value)}
                    placeholder="Ex: Maria"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800">Dificuldade</label>
                  <select
                    value={difficultyDraft}
                    onChange={(e) => setDifficultyDraft(e.target.value as CardDifficulty)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Tempo de desenvolvimento do card
                  </label>
                  <input
                    value={developmentTimeDraft}
                    onChange={(e) => setDevelopmentTimeDraft(e.target.value)}
                    placeholder="Ex: 8 horas"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Salvar detalhes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900">Checklists</h4>
                <span className="text-xs text-gray-500">
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
                        className="mt-1 h-4 w-4 accent-indigo-600"
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
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Adicionar
                </button>
              </form>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900">Comentários</h4>
                <span className="text-xs text-gray-500">{selectedCard.comments.length}</span>
              </div>

              <div className="mt-2 max-h-36 space-y-2 overflow-auto pr-1">
                {selectedCard.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">Sem comentários.</p>
                ) : (
                  selectedCard.comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-gray-100 bg-gray-50 p-2">
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
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
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

