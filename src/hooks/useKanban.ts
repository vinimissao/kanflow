import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  cardToFullApiBody,
  completeWorkspaceSprint,
  createCard,
  createChecklistItem,
  createComentario,
  getCard,
  getSessionUserId,
  HttpError,
  listCards,
  listWorkspaceSprints,
  mapUnknownToCardCommentSingle,
  mapUnknownToChecklistItem,
  mapUnknownToKanbanCard,
  mapUnknownToKanbanCards,
  mapUnknownToCompletedSprints,
  moveCard,
  parseTempoEstimadoHoras,
  patchCard,
  pontosToDifficulty,
  putCard,
  updateChecklistItem,
} from '../api'
import { columns, initialCards } from '../data/initialData'
import type { ColumnStatus, CompletedSprintRecord, FibonacciPoints, KanbanCard } from '../types'

const columnStatusSet = new Set<ColumnStatus>(columns.map((c) => c.status))

function isColumnStatus(value: unknown): value is ColumnStatus {
  if (typeof value !== 'string') return false
  return columnStatusSet.has(value as ColumnStatus)
}

function cloneCards(cards: KanbanCard[]): KanbanCard[] {
  return structuredClone(cards)
}

function mergeCardListWithPrevious(fresh: KanbanCard[], previous: KanbanCard[]): KanbanCard[] {
  const prevById = new Map(previous.map((c) => [c.id, c]))
  return fresh.map((c) => {
    const old = prevById.get(c.id)
    if (!old) return c
    return {
      ...c,
      checklists: c.checklists.length > 0 ? c.checklists : old.checklists,
      comments: c.comments.length > 0 ? c.comments : old.comments,
    }
  })
}

export type UseKanbanOptions = {
  workspaceId?: string | null
  remote?: boolean
}

export function useKanban(options?: UseKanbanOptions) {
  const workspaceId = options?.workspaceId ?? null
  const remote = Boolean(options?.remote && workspaceId)

  const [cards, setCards] = useState<KanbanCard[]>(() => (remote ? [] : initialCards))
  const cardsRef = useRef(cards)
  cardsRef.current = cards
  const pendingCreateIds = useRef(new Set<string>())
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

  const applyFreshCardList = useCallback((fresh: KanbanCard[], previous: KanbanCard[]) => {
    const merged = mergeCardListWithPrevious(fresh, previous)
    const mergedIds = new Set(merged.map((c) => c.id))
    const pending = previous.filter(
      (c) => pendingCreateIds.current.has(c.id) && !mergedIds.has(c.id),
    )
    return [...pending, ...merged]
  }, [])

  const refreshCards = useCallback(async () => {
    if (!remote || !workspaceId) return
    const raw = await listCards(workspaceId)
    const fresh = mapUnknownToKanbanCards(raw)
    setCards((prev) => applyFreshCardList(fresh, prev))
  }, [remote, workspaceId, applyFreshCardList])

  const refreshCardById = useCallback(
    async (cardId: string) => {
      if (!remote || !workspaceId) return
      try {
        const raw = await getCard(cardId)
        const next = mapUnknownToKanbanCard(raw)
        if (!next) {
          await refreshCards()
          return
        }
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== cardId) return c
            const checklists =
              next.checklists.length > 0 ? next.checklists : c.checklists
            const comments = next.comments.length > 0 ? next.comments : c.comments
            return { ...next, checklists, comments }
          }),
        )
      } catch (e) {
        console.error(e)
        await refreshCards()
      }
    },
    [remote, workspaceId, refreshCards],
  )

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
        setCards((prev) =>
          applyFreshCardList(mapUnknownToKanbanCards(rawCards), prev),
        )
        setCompletedSprints(mapUnknownToCompletedSprints(rawSprints))
      } catch (e) {
        console.error(e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [remote, workspaceId, applyFreshCardList])

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
      let statusBefore: ColumnStatus | undefined
      setCards((prev) => {
        const cur = prev.find((c) => c.id === nextActiveId)
        statusBefore = cur?.status
        if (!cur || cur.status === overId) return prev
        return prev.map((card) =>
          card.id === nextActiveId ? { ...card, status: overId } : card,
        )
      })
      if (statusBefore === undefined || statusBefore === overId) return

      void (async () => {
        try {
          await moveCard(nextActiveId, {
            status: overId,
            posicao: null,
          })
          await refreshCards()
        } catch (e) {
          console.error(e)
          setCards((prev) =>
            prev.map((card) =>
              card.id === nextActiveId ? { ...card, status: statusBefore! } : card,
            ),
          )
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
    pontos: FibonacciPoints
    developmentTime: string
    status: ColumnStatus
  }): boolean => {
    const trimmedTitle = input.title.trim()
    const trimmedDescription = input.description.trim()
    const trimmedAssignee = input.assignee.trim() || 'Não atribuído'
    const trimmedDevelopmentTime = input.developmentTime.trim()

    if (!trimmedTitle) return false

    const tempId = createId()
    const draftCard: KanbanCard = {
      id: tempId,
      title: trimmedTitle,
      description: trimmedDescription,
      assignee: trimmedAssignee,
      difficulty: pontosToDifficulty(input.pontos),
      pontos: input.pontos,
      developmentTime: trimmedDevelopmentTime || '',
      checklists: [],
      comments: [],
      status: input.status,
    }

    if (remote && workspaceId) {
      pendingCreateIds.current.add(tempId)
      setCards((prev) => [draftCard, ...prev])
      void (async () => {
        try {
          const horas = parseTempoEstimadoHoras(trimmedDevelopmentTime)
          const raw = await createCard({
            titulo: trimmedTitle,
            descricao: trimmedDescription || null,
            pontos: input.pontos,
            tempoEstimado: horas > 0 ? horas : null,
            status: input.status,
            responsavelId: null,
            workspaceId,
            posicao: 0,
            assignee: trimmedAssignee,
          })
          const created = mapUnknownToKanbanCard(raw)
          pendingCreateIds.current.delete(tempId)
          if (created) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === tempId ? { ...created, status: input.status } : c,
              ),
            )
          } else {
            await refreshCards()
          }
        } catch (e) {
          pendingCreateIds.current.delete(tempId)
          console.error(e)
          setCards((prev) => prev.filter((c) => c.id !== tempId))
          const msg =
            e instanceof HttpError
              ? e.message
              : 'Não foi possível criar o card. Verifique a API e tente de novo.'
          window.alert(msg)
        }
      })()
      return true
    }

    setCards((prev) => [draftCard, ...prev])
    return true
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

  const updateCardDetails = async (
    cardId: string,
    patch: {
      assignee?: string
      developmentTime?: string
      pontos?: FibonacciPoints
    },
  ): Promise<void> => {
    const nextAssignee = patch.assignee?.trim()
    const nextDevelopmentTime = patch.developmentTime?.trim()

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

    if (remote && workspaceId) {
      const current = cards.find((c) => c.id === cardId)
      if (!current) {
        throw new Error('Card não encontrado.')
      }

      let merged: KanbanCard = { ...current }
      if (nextAssignee !== undefined) merged = { ...merged, assignee: nextAssignee }
      if (nextDevelopmentTime !== undefined) merged = { ...merged, developmentTime: nextDevelopmentTime }
      if (patch.pontos !== undefined) {
        merged = {
          ...merged,
          pontos: patch.pontos,
          difficulty: pontosToDifficulty(patch.pontos),
        }
      }

      const onlyPontos =
        patch.pontos !== undefined &&
        patch.assignee === undefined &&
        patch.developmentTime === undefined
      const onlyAssignee =
        patch.assignee !== undefined &&
        patch.developmentTime === undefined &&
        patch.pontos === undefined
      const onlyTempo =
        patch.developmentTime !== undefined &&
        patch.assignee === undefined &&
        patch.pontos === undefined

      try {
        if (onlyPontos) {
          await patchCard(cardId, { pontos: patch.pontos })
        } else if (onlyAssignee) {
          await patchCard(cardId, { assignee: nextAssignee })
        } else if (onlyTempo) {
          const th = parseTempoEstimadoHoras(nextDevelopmentTime!)
          await patchCard(cardId, { tempoEstimado: th > 0 ? th : null })
        } else {
          await putCard(cardId, cardToFullApiBody(merged, workspaceId, 0))
        }
        await refreshCards()
      } catch (e) {
        console.error(e)
        if (e instanceof HttpError) throw e
        throw new Error('Falha ao atualizar o card na API.')
      }
      return
    }

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        let next: KanbanCard = { ...card }
        if (nextAssignee !== undefined) next = { ...next, assignee: nextAssignee }
        if (nextDevelopmentTime !== undefined) next = { ...next, developmentTime: nextDevelopmentTime }
        if (patch.pontos !== undefined) {
          next = { ...next, pontos: patch.pontos, difficulty: pontosToDifficulty(patch.pontos) }
        }
        return next
      }),
    )
  }

  const addChecklistItem = (cardId: string, text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    if (remote && workspaceId) {
      ;(async () => {
        try {
          const created = await createChecklistItem(cardId, { texto: trimmedText, concluido: false })
          const item = mapUnknownToChecklistItem(created)
          if (item) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === cardId ? { ...c, checklists: [item, ...c.checklists] } : c,
              ),
            )
          }
          await refreshCardById(cardId)
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
      const card = cardsRef.current.find((c) => c.id === cardId)
      const item = card?.checklists.find((i) => i.id === itemId)
      if (!item) return
      const texto = item.text
      const toggledTo = !item.done

      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== cardId) return c
          return {
            ...c,
            checklists: c.checklists.map((it) =>
              it.id === itemId ? { ...it, done: toggledTo } : it,
            ),
          }
        }),
      )

      void (async () => {
        try {
          await updateChecklistItem(cardId, itemId, {
            texto,
            concluido: toggledTo,
          })
          await refreshCardById(cardId)
        } catch (e) {
          console.error(e)
          setCards((prev) =>
            prev.map((c) => {
              if (c.id !== cardId) return c
              return {
                ...c,
                checklists: c.checklists.map((it) =>
                  it.id === itemId ? { ...it, done: !toggledTo } : it,
                ),
              }
            }),
          )
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
          const created = await createComentario(cardId, { autorId, texto: trimmedText })
          const comment = mapUnknownToCardCommentSingle(created)
          if (comment) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === cardId ? { ...c, comments: [comment, ...c.comments] } : c,
              ),
            )
          }
          await refreshCardById(cardId)
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

  const completeSprint = async (): Promise<void> => {
    if (remote && workspaceId) {
      await completeWorkspaceSprint(workspaceId)
      await blankWorkspaceBoard(workspaceId)
      await refreshCards()
      await refreshSprints()
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
