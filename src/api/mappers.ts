import type { CardComment, ChecklistItem, ColumnStatus, CompletedSprintRecord, KanbanCard } from '../types'
import { normalizeFibonacciPoints, pontosToDifficulty } from './fibonacci'
import { columns } from '../data/initialData'

const columnStatusSet = new Set(columns.map((c) => c.status))

function asStatus(v: unknown): ColumnStatus {
  const s = String(v ?? 'backlog')
  if (columnStatusSet.has(s as ColumnStatus)) return s as ColumnStatus
  return 'backlog'
}

function tempoEstimadoToDisplay(v: unknown): string {
  if (typeof v === 'number' && !Number.isNaN(v)) {
    return v === 0 ? '' : `${v} h`
  }
  return String(v ?? '')
}

function parseCreatedAt(o: Record<string, unknown>): number {
  const v =
    o.createdAt ?? o.created_at ?? o.dataCriacao ?? o.data_criacao ?? o.instante ?? o.timestamp
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const t = Date.parse(v)
    if (!Number.isNaN(t)) return t
  }
  return Date.now()
}

function asComments(raw: unknown): CardComment[] {
  if (!Array.isArray(raw)) return []
  const out: CardComment[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = String(o.id ?? o.comentarioId ?? '').trim()
    const text = String(o.text ?? o.texto ?? o.conteudo ?? o.mensagem ?? '').trim()
    if (!id || !text) continue
    out.push({ id, text, createdAt: parseCreatedAt(o) })
  }
  return out
}

function asChecklists(raw: unknown): KanbanCard['checklists'] {
  if (!Array.isArray(raw)) return []
  const out: KanbanCard['checklists'] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = String(o.id ?? o.itemId ?? o.checklistItemId ?? '').trim()
    const text = String(o.text ?? o.texto ?? o.descricao ?? o.titulo ?? o.label ?? '').trim()
    const done = Boolean(o.done ?? o.concluido ?? o.concluído ?? false)
    if (!text) continue
    if (!id) continue
    out.push({ id, text, done })
  }
  return out
}

function firstChecklistArray(o: Record<string, unknown>): unknown {
  const direct =
    o.checklists ??
    o.checklistItens ??
    o.itensChecklist ??
    o.checklistItems ??
    o.checkListItems ??
    o.itens ??
    o.checklist_itens ??
    o.itens_checklist
  if (Array.isArray(direct)) return direct
  const nested = o.checklist
  if (nested && typeof nested === 'object') {
    const n = nested as Record<string, unknown>
    const inner = n.itens ?? n.items ?? n.checklistItens
    if (Array.isArray(inner)) return inner
  }
  return []
}

function firstCommentsArray(o: Record<string, unknown>): unknown {
  const direct = o.comments ?? o.comentarios ?? o.commentarios
  if (Array.isArray(direct)) return direct
  return []
}

function unwrapCreatedPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const inner = o.data ?? o.payload ?? o.body
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>
  }
  return o
}

export function mapUnknownToChecklistItem(raw: unknown): ChecklistItem | null {
  const o = unwrapCreatedPayload(raw)
  if (!o) return null
  const id = String(o.id ?? '').trim()
  const text = String(o.text ?? o.texto ?? o.descricao ?? '').trim()
  const done = Boolean(o.done ?? o.concluido ?? false)
  if (!id || !text) return null
  return { id, text, done }
}

export function mapUnknownToCardCommentSingle(raw: unknown): CardComment | null {
  const o = unwrapCreatedPayload(raw)
  if (!o) return null
  const id = String(o.id ?? '').trim()
  const text = String(o.text ?? o.texto ?? o.conteudo ?? o.mensagem ?? '').trim()
  if (!id || !text) return null
  return { id, text, createdAt: parseCreatedAt(o) }
}

export function mapUnknownToKanbanCard(raw: unknown): KanbanCard | null {
  const unwrapped = unwrapCreatedPayload(raw) ?? (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null)
  if (!unwrapped) return null
  const o = unwrapped
  const id = String(o.id ?? '')
  if (!id) return null
  const title = String(o.title ?? o.titulo ?? '')
  const description = String(o.description ?? o.descricao ?? '')
  const assignee = String(o.assignee ?? o.responsavel ?? o.assigneeName ?? '')

  const tempoRaw = o.tempoEstimado ?? o.tempoDesenvolvimento ?? o.developmentTime
  const developmentTime =
    tempoRaw !== undefined && tempoRaw !== null
      ? tempoEstimadoToDisplay(tempoRaw)
      : String(o.developmentTime ?? '')

  const pontos = normalizeFibonacciPoints(o.pontos ?? o.difficulty ?? o.dificuldade)

  return {
    id,
    title,
    description,
    assignee,
    difficulty: pontosToDifficulty(pontos),
    pontos,
    developmentTime,
    checklists: asChecklists(firstChecklistArray(o)),
    comments: asComments(firstCommentsArray(o)),
    status: asStatus(o.status ?? o.columnStatus ?? o.estado),
  }
}

export function mapUnknownToKanbanCards(raw: unknown): KanbanCard[] {
  let list: unknown = raw
  if (!Array.isArray(list) && raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (Array.isArray(o.content)) list = o.content
    else if (Array.isArray(o.data)) list = o.data
    else if (Array.isArray(o.cards)) list = o.cards
  }
  if (!Array.isArray(list)) return []
  const cards: KanbanCard[] = []
  for (const item of list) {
    const c = mapUnknownToKanbanCard(item)
    if (c) cards.push(c)
  }
  return cards
}

function sprintEndedAtMs(o: Record<string, unknown>): number {
  const v = o.endedAt ?? o.ended_at
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return Date.parse(v) || Date.now()
  return Date.now()
}

function sprintStartedAtMs(o: Record<string, unknown>): number | undefined {
  const v = o.startedAt ?? o.started_at
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const t = Date.parse(v)
    return Number.isNaN(t) ? undefined : t
  }
  return undefined
}

function readNonNegativeInt(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v) && v >= 0) return Math.floor(v)
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseInt(v, 10)
    if (!Number.isNaN(n) && n >= 0) return n
  }
  return undefined
}

function readSprintTotals(o: Record<string, unknown>) {
  return {
    cardsTotal: readNonNegativeInt(
      o.cardsTotal ?? o.cards_total ?? o.totalCards ?? o.total_cards,
    ),
    cardsDone: readNonNegativeInt(o.cardsDone ?? o.cards_done ?? o.doneCards ?? o.done_cards),
    checklistTotal: readNonNegativeInt(
      o.checklistTotal ?? o.checklist_total ?? o.totalChecklist ?? o.total_checklist,
    ),
    checklistDone: readNonNegativeInt(
      o.checklistDone ?? o.checklist_done ?? o.doneChecklist ?? o.done_checklist,
    ),
  }
}

export function mapUnknownToCompletedSprintItem(raw: unknown): CompletedSprintRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = String(o.sprintHistoryId ?? o.id ?? '')
  if (!id) return null

  const numeroRaw = o.numero ?? o.number
  const numero = typeof numeroRaw === 'number' && !Number.isNaN(numeroRaw) ? numeroRaw : Number(numeroRaw) || 1
  const name = String(o.name ?? o.nome ?? `Sprint ${numero}`)

  const endedAt = sprintEndedAtMs(o)
  const startedAt = sprintStartedAtMs(o)

  const snapshot = o.snapshot
  let cards: KanbanCard[] = []
  if (snapshot && typeof snapshot === 'object') {
    const snap = snapshot as Record<string, unknown>
    cards = mapUnknownToKanbanCards(snap.cards)
  } else {
    const cardsRaw = o.cards ?? o.cartoes
    cards = mapUnknownToKanbanCards(cardsRaw)
  }

  const { cardsTotal: apiCT, cardsDone: apiCD, checklistTotal, checklistDone } = readSprintTotals(o)

  return {
    id,
    name,
    endedAt,
    startedAt,
    cards,
    cardsTotal: apiCT !== undefined ? apiCT : cards.length > 0 ? cards.length : undefined,
    cardsDone:
      apiCD !== undefined
        ? apiCD
        : cards.length > 0
          ? cards.filter((c) => c.status === 'done').length
          : undefined,
    checklistTotal,
    checklistDone,
  }
}

export function mapUnknownToCompletedSprints(raw: unknown): CompletedSprintRecord[] {
  const list = Array.isArray(raw) ? raw : (raw as Record<string, unknown>)?.content
  if (!Array.isArray(list)) return []
  const out: CompletedSprintRecord[] = []
  for (const item of list) {
    const rec = mapUnknownToCompletedSprintItem(item)
    if (rec) out.push(rec)
  }
  return out
}
