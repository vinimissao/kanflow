import type { CardDifficulty, CardComment, ColumnStatus, CompletedSprintRecord, KanbanCard } from '../types'
import { columns } from '../data/initialData'

const columnStatusSet = new Set(columns.map((c) => c.status))

function asDifficulty(v: unknown): CardDifficulty {
  if (v === 'Baixa' || v === 'Média' || v === 'Alta') return v
  const s = String(v || '').toLowerCase()
  if (s.includes('baix')) return 'Baixa'
  if (s.includes('alt')) return 'Alta'
  return 'Média'
}

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

function asComments(raw: unknown): CardComment[] {
  if (!Array.isArray(raw)) return []
  const out: CardComment[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = String(o.id ?? '')
    const text = String(o.text ?? o.texto ?? o.conteudo ?? '')
    let createdAt = Date.now()
    if (typeof o.createdAt === 'number') createdAt = o.createdAt
    else if (typeof o.created_at === 'number') createdAt = o.created_at
    else if (typeof o.createdAt === 'string') createdAt = Date.parse(o.createdAt) || createdAt
    else if (typeof o.created_at === 'string') createdAt = Date.parse(o.created_at) || createdAt
    if (id && text) out.push({ id, text, createdAt })
  }
  return out
}

function asChecklists(raw: unknown): KanbanCard['checklists'] {
  if (!Array.isArray(raw)) return []
  const out: KanbanCard['checklists'] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = String(o.id ?? '')
    const text = String(o.text ?? o.texto ?? '')
    const done = Boolean(o.done ?? o.concluido ?? false)
    if (id && text) out.push({ id, text, done })
  }
  return out
}

/** Converte resposta genérica do backend para o modelo do front. */
export function mapUnknownToKanbanCard(raw: unknown): KanbanCard | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
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

  return {
    id,
    title,
    description,
    assignee,
    difficulty: asDifficulty(o.difficulty ?? o.dificuldade),
    developmentTime,
    checklists: asChecklists(o.checklists ?? o.checklistItens ?? o.itensChecklist),
    comments: asComments(o.comments ?? o.comentarios),
    status: asStatus(o.status ?? o.columnStatus ?? o.estado),
  }
}

export function mapUnknownToKanbanCards(raw: unknown): KanbanCard[] {
  const list = Array.isArray(raw) ? raw : (raw as Record<string, unknown>)?.content
  if (!Array.isArray(list)) return []
  const cards: KanbanCard[] = []
  for (const item of list) {
    const c = mapUnknownToKanbanCard(item)
    if (c) cards.push(c)
  }
  return cards
}

export function mapUnknownToCompletedSprints(raw: unknown): CompletedSprintRecord[] {
  const list = Array.isArray(raw) ? raw : (raw as Record<string, unknown>)?.content
  if (!Array.isArray(list)) return []
  const out: CompletedSprintRecord[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = String(o.id ?? '')
    if (!id) continue
    const name = String(o.name ?? o.nome ?? `Sprint`)
    let endedAt = Date.now()
    if (typeof o.endedAt === 'number') endedAt = o.endedAt
    else if (typeof o.ended_at === 'number') endedAt = o.ended_at
    else if (typeof o.endedAt === 'string') endedAt = Date.parse(o.endedAt) || endedAt
    const cardsRaw = o.cards ?? o.cartoes
    const cards = mapUnknownToKanbanCards(cardsRaw)
    out.push({ id, name, endedAt, cards })
  }
  return out
}
