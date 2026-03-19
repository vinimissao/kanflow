import { useMemo, useState } from 'react'
import {
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { columns, initialCards } from '../data/initialData'
import type { ColumnStatus, KanbanCard } from '../types'

const columnStatusSet = new Set<ColumnStatus>(columns.map((c) => c.status))

function isColumnStatus(value: unknown): value is ColumnStatus {
  if (typeof value !== 'string') return false
  return columnStatusSet.has(value as ColumnStatus)
}

export function useKanban() {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<ColumnStatus | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  )

  const activeCard = useMemo(
    () => (activeId ? cards.find((c) => c.id === activeId) ?? null : null),
    [cards, activeId],
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
    setOverColumn(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id
    if (!overId) {
      setOverColumn(null)
      return
    }
    if (isColumnStatus(overId)) setOverColumn(overId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id
    const nextActiveId = String(event.active.id)

    setOverColumn(null)
    setActiveId(null)

    if (!overId || !isColumnStatus(overId)) return
    if (nextActiveId === '') return

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== nextActiveId) return card
        if (card.status === overId) return card
        return { ...card, status: overId }
      }),
    )
  }

  const handleDragCancel = (_event: DragCancelEvent) => {
    setOverColumn(null)
    setActiveId(null)
  }

  const createId = () => {
    const cryptoObj = globalThis.crypto
    if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
      return cryptoObj.randomUUID()
    }
    return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }

  const addCard = (input: {
    title: string
    description: string
    assignee: string
    status: ColumnStatus
  }) => {
    const trimmedTitle = input.title.trim()
    const trimmedDescription = input.description.trim()
    const trimmedAssignee = input.assignee.trim()

    if (!trimmedTitle) return
    if (!trimmedDescription) return
    if (!trimmedAssignee) return

    const newCard: KanbanCard = {
      id: createId(),
      title: trimmedTitle,
      description: trimmedDescription,
      assignee: trimmedAssignee,
      status: input.status,
    }

    setCards((prev) => [newCard, ...prev])
  }

  const updateCardAssignee = (cardId: string, assignee: string) => {
    const nextAssignee = assignee.trim()
    if (!nextAssignee) return

    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, assignee: nextAssignee } : card)),
    )
  }

  return {
    cards,
    columns,
    sensors,
    activeCard,
    overColumn,
    collisionDetection: closestCorners,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    addCard,
    updateCardAssignee,
  }
}

