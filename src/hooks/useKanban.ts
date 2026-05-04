import { useCallback, useEffect, useMemo, useState } from 'react'
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

import {
  blankWorkspaceBoard,
  completeWorkspaceSprint,
  createCard,
  createChecklistItem,
  createComentario,
  getSessionUserId,
  listCards,
  listWorkspaceSprints,
  mapUnknownToKanbanCards,
  mapUnknownToCompletedSprints,
  moveCard,
  parseTempoEstimadoHoras,
  patchCard,
  updateChecklistItem,
} from '../api'
import { columns, initialCards } from '../data/initialData'
import type { CardDifficulty, ColumnStatus, CompletedSprintRecord, KanbanCard } from '../types'

const columnStatusSet = new Set<ColumnStatus>(columns.map((c) => c.status))

function isColumnStatus(value: unknown): value is ColumnStatus {
  if (typeof value !== 'string') return false
  return columnStatusSet.has(value as ColumnStatus)
}

function cloneCards(cards: KanbanCard[]): KanbanCard[] {
  return structuredClone(cards)
}

export type UseKanbanOptions = {
  /** Obrigatório para sincronizar com o servidor. */
  workspaceId?: string | null
  /** Quando true e `workspaceId` definido, usa os endpoints `/api/*`. */
  remote?: boolean
}

export function useKanban(options?: UseKanbanOptions) {
  const workspaceId = options?.workspaceId ?? null
  const remote = Boolean(options?.remote && workspaceId)

  const [cards, setCards] = useState<KanbanCard[]>(() => (remote ? [] : initialCards))
  const [completedSprints, setCompletedSprints] = useState<CompletedSprintRecord[]>([])
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

  const refreshCards = useCallback(async () => {
    if (!remote || !workspaceId) return
    const raw = await listCards(workspaceId)
    setCards(mapUnknownToKanbanCards(raw))
  }, [remote, workspaceId])

  const refreshSprints = useCallback(async () => {
    if (!remote || !workspaceId) return
    const raw = await listWorkspaceSprints(workspaceId)
    setCompletedSprints(mapUnknownToCompletedSprints(raw))
  }, [remote, workspaceId])

  useEffect(() => {
    if (!remote || !workspaceId) return
    let cancelled = false
    ;(async () => {
      try {
        const [rawCards, rawSprints] = await Promise.all([
          listCards(workspaceId),
          listWorkspaceSprints(workspaceId),
        ])
        if (cancelled) return
        setCards(mapUnknownToKanbanCards(rawCards))
        setCompletedSprints(mapUnknownToCompletedSprints(rawSprints))
      } catch (e) {
        console.error(e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [remote, workspaceId])

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

    if (remote && workspaceId) {
      ;(async () => {
        try {
          await moveCard(nextActiveId, {
            status: overId,
          })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

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
    difficulty: CardDifficulty
    developmentTime: string
    status: ColumnStatus
  }) => {
    const trimmedTitle = input.title.trim()
    const trimmedDescription = input.description.trim()
    const trimmedAssignee = input.assignee.trim()
    const trimmedDevelopmentTime = input.developmentTime.trim()

    if (!trimmedTitle) return
    if (!trimmedDescription) return
    if (!trimmedAssignee) return
    if (!input.difficulty) return
    if (!trimmedDevelopmentTime) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          const horas = parseTempoEstimadoHoras(trimmedDevelopmentTime)
          await createCard({
            titulo: trimmedTitle,
            descricao: trimmedDescription || null,
            dificuldade: input.difficulty,
            tempoEstimado: horas > 0 ? horas : null,
            status: input.status,
            responsavelId: null,
            workspaceId,
            posicao: 0,
            assignee: trimmedAssignee || null,
          })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    const newCard: KanbanCard = {
      id: createId(),
      title: trimmedTitle,
      description: trimmedDescription,
      assignee: trimmedAssignee,
      difficulty: input.difficulty,
      developmentTime: trimmedDevelopmentTime,
      checklists: [],
      comments: [],
      status: input.status,
    }

    setCards((prev) => [newCard, ...prev])
  }

  const updateCardAssignee = (cardId: string, assignee: string) => {
    const nextAssignee = assignee.trim()
    if (!nextAssignee) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          await patchCard(cardId, { assignee: nextAssignee })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, assignee: nextAssignee } : card)),
    )
  }

  const updateCardDetails = (
    cardId: string,
    patch: {
      assignee?: string
      difficulty?: CardDifficulty
      developmentTime?: string
    },
  ) => {
    const nextAssignee = patch.assignee?.trim()
    const nextDevelopmentTime = patch.developmentTime?.trim()
    const nextDifficulty = patch.difficulty

    if (
      patch.assignee !== undefined &&
      (nextAssignee === undefined || nextAssignee === '')
    )
      return
    if (
      patch.developmentTime !== undefined &&
      (nextDevelopmentTime === undefined || nextDevelopmentTime === '')
    )
      return
    if (patch.difficulty !== undefined && !nextDifficulty) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          const body: Record<string, unknown> = {}
          if (nextAssignee !== undefined) body.assignee = nextAssignee
          if (nextDifficulty !== undefined) body.dificuldade = nextDifficulty
          if (nextDevelopmentTime !== undefined) {
            const th = parseTempoEstimadoHoras(nextDevelopmentTime)
            body.tempoEstimado = th > 0 ? th : null
          }
          await patchCard(cardId, body)
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        return {
          ...card,
          ...(nextAssignee !== undefined ? { assignee: nextAssignee } : {}),
          ...(nextDifficulty !== undefined ? { difficulty: nextDifficulty } : {}),
          ...(nextDevelopmentTime !== undefined ? { developmentTime: nextDevelopmentTime } : {}),
        }
      }),
    )
  }

  const addChecklistItem = (cardId: string, text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          await createChecklistItem(cardId, { texto: trimmedText, concluido: false })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        return {
          ...card,
          checklists: [
            { id: createId(), text: trimmedText, done: false },
            ...card.checklists,
          ],
        }
      }),
    )
  }

  const toggleChecklistItem = (cardId: string, itemId: string) => {
    if (remote && workspaceId) {
      ;(async () => {
        try {
          const card = cards.find((c) => c.id === cardId)
          const item = card?.checklists.find((i) => i.id === itemId)
          const next = item ? !item.done : true
          await updateChecklistItem(cardId, itemId, {
            texto: item?.text ?? '',
            concluido: next,
          })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        return {
          ...card,
          checklists: card.checklists.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      }),
    )
  }

  const addCardComment = (cardId: string, text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          const autorId = getSessionUserId()
          if (!autorId) {
            window.alert('Sessão sem ID de usuário. Faça login novamente.')
            return
          }
          await createComentario(cardId, { autorId, texto: trimmedText })
          await refreshCards()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    const comment = {
      id: createId(),
      text: trimmedText,
      createdAt: Date.now(),
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        return { ...card, comments: [comment, ...card.comments] }
      }),
    )
  }

  const completeSprint = () => {
    if (remote && workspaceId) {
      ;(async () => {
        try {
          await completeWorkspaceSprint(workspaceId)
          await refreshCards()
          await refreshSprints()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    const snapshot = cloneCards(cards)
    setCompletedSprints((prev) => {
      const record: CompletedSprintRecord = {
        id: createId(),
        name: `Sprint ${prev.length + 1}`,
        endedAt: Date.now(),
        cards: snapshot,
      }
      return [...prev, record]
    })
    setCards([])
    setActiveId(null)
    setOverColumn(null)
  }

  const createBlankBoard = () => {
    if (remote && workspaceId) {
      ;(async () => {
        try {
          await blankWorkspaceBoard(workspaceId)
          await refreshCards()
          await refreshSprints()
        } catch (e) {
          console.error(e)
        }
      })()
      return
    }

    setCards([])
    setActiveId(null)
    setOverColumn(null)
  }

  return {
    cards,
    completedSprints,
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
    updateCardDetails,
    addChecklistItem,
    toggleChecklistItem,
    addCardComment,
    completeSprint,
    createBlankBoard,
    remote,
  }
}
