import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import Column from '../Column/Column'
import { useKanban } from '../../hooks/useKanban'

export default function Board() {
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
    updateCardAssignee,
  } = useKanban()

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const selectedCard = useMemo(
    () => (selectedCardId ? cards.find((c) => c.id === selectedCardId) ?? null : null),
    [cards, selectedCardId],
  )

  const [assigneeDraft, setAssigneeDraft] = useState('')
  useEffect(() => {
    setAssigneeDraft(selectedCard?.assignee ?? '')
  }, [selectedCard?.assignee])

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
                <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                  {activeCard.assignee}
                </span>
              </div>
              <p className="mt-2 max-h-10 overflow-hidden text-xs leading-relaxed text-gray-600">
                {activeCard.description}
              </p>
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
                <p className="mt-1 text-sm text-gray-600">{selectedCard.description}</p>
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
                const next = assigneeDraft.trim()
                if (!next) return
                updateCardAssignee(selectedCard.id, next)
                setSelectedCardId(null)
              }}
              className="mt-4"
            >
              <label className="block text-sm font-medium text-gray-800">Responsável</label>
              <input
                value={assigneeDraft}
                onChange={(e) => setAssigneeDraft(e.target.value)}
                placeholder="Ex: Maria"
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssigneeDraft(selectedCard.assignee)
                    setSelectedCardId(null)
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DndContext>
  )
}

