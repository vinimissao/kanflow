import { useEffect, useMemo, useRef, useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import Column from '../Column/Column'
import { HttpError, pontosToDifficulty } from '../../api'
import { useKanban } from '../../hooks/useKanban'
import type { CardDifficulty } from '../../types'

const POKER_SCALE = [1, 2, 3, 5, 8, 13] as const

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
  const [developmentTimeDraft, setDevelopmentTimeDraft] = useState('')
  const [newChecklistText, setNewChecklistText] = useState('')
  const [newCommentText, setNewCommentText] = useState('')
  const boardScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeCard) return
    const el = boardScrollRef.current
    if (!el) return
    const margin = 72
    const speed = 24
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (e.clientX < r.left + margin) {
        el.scrollLeft = Math.max(0, el.scrollLeft - speed)
      } else if (e.clientX > r.right - margin) {
        el.scrollLeft = Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + speed)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [activeCard])

  useEffect(() => {
    if (!selectedCard) return
    setAssigneeDraft(selectedCard.assignee)
    setDevelopmentTimeDraft(selectedCard.developmentTime)
    setNewChecklistText('')
    setNewCommentText('')
  }, [
    selectedCard?.id,
    selectedCard?.assignee,
    selectedCard?.developmentTime,
    selectedCard?.pontos,
    (selectedCard?.checklists ?? [])
      .map((i) => `${i.id}:${i.done ? 1 : 0}`)
      .join('|'),
  ])

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
      <div
        ref={boardScrollRef}
        className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]"
      >
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
                  getCategoryPillClass(pontosToDifficulty(activeCard.pontos)),
                ].join(' ')}
              >
                {categoryLabel(pontosToDifficulty(activeCard.pontos))}
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
                    getCategoryPillClass(pontosToDifficulty(selectedCard.pontos)),
                  ].join(' ')}
                >
                  {categoryLabel(pontosToDifficulty(selectedCard.pontos))}
                </span>
                <h3 className="mt-2 truncate text-lg font-bold text-gray-900">{selectedCard.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                    {selectedCard.assignee}
                  </span>
                  <span className="rounded-full border border-gray-100 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                    Tempo: {selectedCard.developmentTime}
                  </span>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-800 ring-1 ring-violet-100">
                    {selectedCard.pontos} pts
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{selectedCard.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardId(null)}
                className="kf-btn shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>

            <div className="mt-5">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Responsável</label>
                  <input
                    value={assigneeDraft}
                    onChange={(e) => setAssigneeDraft(e.target.value)}
                    onBlur={() => {
                      const next = assigneeDraft.trim()
                      if (!next || next === selectedCard.assignee) return
                      void (async () => {
                        try {
                          await updateCardDetails(selectedCard.id, { assignee: next })
                        } catch (err) {
                          window.alert(
                            err instanceof HttpError
                              ? err.message
                              : 'Não foi possível salvar o responsável.',
                          )
                        }
                      })()
                    }}
                    placeholder="Ex: Maria"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Tempo de desenvolvimento do card
                  </label>
                  <input
                    value={developmentTimeDraft}
                    onChange={(e) => setDevelopmentTimeDraft(e.target.value)}
                    onBlur={() => {
                      const next = developmentTimeDraft.trim()
                      if (!next || next === selectedCard.developmentTime) return
                      void (async () => {
                        try {
                          await updateCardDetails(selectedCard.id, { developmentTime: next })
                        } catch (err) {
                          window.alert(
                            err instanceof HttpError
                              ? err.message
                              : 'Não foi possível salvar o tempo estimado.',
                          )
                        }
                      })()
                    }}
                    placeholder="Ex: 8 horas"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  />
                </div>

                <div className="rounded-xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/90 to-purple-50/40 p-3">
                  <p className="text-xs font-bold text-gray-900">Planning poker (Fibonacci)</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-600">
                    Toque no número para gravar <strong>pontos</strong> na API. Responsável e tempo gravam ao sair
                    do campo (Tab ou clique fora). Sprint Poker no menu faz a média da equipe.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {POKER_SCALE.map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => {
                          void (async () => {
                            try {
                              await updateCardDetails(selectedCard.id, { pontos: pts })
                            } catch (err) {
                              window.alert(
                                err instanceof HttpError
                                  ? err.message
                                  : 'Não foi possível salvar os pontos. Verifique a API.',
                              )
                            }
                          })()
                        }}
                        className={[
                          'kf-btn rounded-lg border px-2.5 py-1.5 text-xs font-bold shadow-sm transition',
                          selectedCard.pontos === pts
                            ? 'border-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-fuchsia-500/25'
                            : 'border-fuchsia-200/80 bg-white text-fuchsia-800 hover:border-fuchsia-400 hover:bg-fuchsia-50',
                        ].join(' ')}
                      >
                        {pts}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
                  className="kf-btn rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:opacity-95"
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
                  className="kf-btn rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:opacity-95"
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

