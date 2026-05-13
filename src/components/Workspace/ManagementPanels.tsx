import { useEffect, useMemo, useState } from 'react'
import { nearestFibonacciPoints } from '../../api'
import type { CompletedSprintRecord, FibonacciPoints, KanbanCard } from '../../types'

export type WorkspaceSection =
  | 'board'
  | 'performance'
  | 'evolution'
  | 'poker'
  | 'sprints'
  | 'contributors'

type SidebarMenuProps = {
  selected: WorkspaceSection
  onSelect: (section: WorkspaceSection) => void
  planLabel?: string | null
  onOpenBilling?: () => void
}

type WorkspacePanelProps = {
  selected: WorkspaceSection
  cards: KanbanCard[]
  completedSprints: CompletedSprintRecord[]
  sprintHistoryEnabled?: boolean
  onUpgrade?: () => void
  onApplyPokerEstimate?: (cardId: string, pontos: FibonacciPoints) => void | Promise<void>
}

const sectionItems: { id: WorkspaceSection; label: string }[] = [
  { id: 'board', label: 'Quadro' },
  { id: 'performance', label: 'Performance da Sprint' },
  { id: 'evolution', label: 'Gráficos de Evolução' },
  { id: 'poker', label: 'Sprint Poker' },
  { id: 'sprints', label: 'Lista de Sprints' },
  { id: 'contributors', label: 'Desenvolvimento dos Colaboradores' },
]

type SprintRow = {
  id: string
  name: string
  endedAt: number | null
  cards: KanbanCard[]
  apiTotals?: Pick<
    CompletedSprintRecord,
    'cardsTotal' | 'cardsDone' | 'checklistTotal' | 'checklistDone'
  >
}

function sprintCardsTotal(s: CompletedSprintRecord): number {
  return s.cardsTotal ?? s.cards.length
}

function sprintCardsDone(s: CompletedSprintRecord): number {
  if (typeof s.cardsDone === 'number') return s.cardsDone
  return s.cards.filter((c) => c.status === 'done').length
}

function sprintCardsPercent(s: CompletedSprintRecord): number {
  const t = sprintCardsTotal(s)
  return t === 0 ? 0 : Math.round((sprintCardsDone(s) / t) * 100)
}

function sprintChecklistPercent(s: CompletedSprintRecord): number {
  const t = s.checklistTotal
  const d = s.checklistDone
  if (typeof t !== 'number' || t <= 0 || typeof d !== 'number') return 0
  return Math.round((d / t) * 100)
}

function sprintRowCardsTotal(row: SprintRow): number {
  if (row.id === 'current-board') return row.cards.length
  if (typeof row.apiTotals?.cardsTotal === 'number') return row.apiTotals.cardsTotal
  return row.cards.length
}

function sprintRowCardsDone(row: SprintRow): number {
  if (row.id === 'current-board') return row.cards.filter((c) => c.status === 'done').length
  if (typeof row.apiTotals?.cardsDone === 'number') return row.apiTotals.cardsDone
  return row.cards.filter((c) => c.status === 'done').length
}

function sprintRowCardsPercent(row: SprintRow): number {
  const t = sprintRowCardsTotal(row)
  return t === 0 ? 0 : Math.round((sprintRowCardsDone(row) / t) * 100)
}

function sprintRowChecklistCounts(row: SprintRow): { done: number; total: number } {
  const apiT = row.apiTotals?.checklistTotal
  const apiD = row.apiTotals?.checklistDone
  if (
    row.id !== 'current-board' &&
    typeof apiT === 'number' &&
    apiT > 0 &&
    typeof apiD === 'number'
  ) {
    return { done: apiD, total: apiT }
  }
  const total = row.cards.reduce((sum, c) => sum + c.checklists.length, 0)
  const done = row.cards.reduce((sum, c) => sum + c.checklists.filter((i) => i.done).length, 0)
  return { done, total }
}

function buildSprintRows(completed: CompletedSprintRecord[], currentCards: KanbanCard[]): SprintRow[] {
  const sorted = [...completed].sort((a, b) => a.endedAt - b.endedAt)
  const rows: SprintRow[] = sorted.map((s) => ({
    id: s.id,
    name: s.name,
    endedAt: s.endedAt,
    cards: s.cards,
    apiTotals: {
      cardsTotal: s.cardsTotal,
      cardsDone: s.cardsDone,
      checklistTotal: s.checklistTotal,
      checklistDone: s.checklistDone,
    },
  }))
  if (currentCards.length > 0) {
    rows.push({
      id: 'current-board',
      name: 'Sprint atual (em andamento)',
      endedAt: null,
      cards: currentCards,
    })
  }
  return rows
}

function formatSprintDate(ts: number) {
  return new Date(ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function parseHours(value: string): number {
  const match = value.match(/\d+/)
  if (!match) return 0
  return Number(match[0])
}

function PlanHistoryGate({
  onUpgrade,
}: {
  onUpgrade?: () => void
}) {
  return (
    <div className="rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/60 via-white to-white p-8 text-center shadow-card">
      <h3 className="text-lg font-bold text-gray-900">Recurso dos planos pagos</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
        Histórico de sprints, performance e evolução detalhada fazem parte do Básico e do Full.
      </p>
      {onUpgrade ? (
        <button
          type="button"
          onClick={onUpgrade}
          className="kf-btn mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-95"
        >
          Ver planos e fazer upgrade
        </button>
      ) : null}
    </div>
  )
}

export function SidebarMenu({ selected, onSelect, planLabel, onOpenBilling }: SidebarMenuProps) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-white/5 bg-[#121417] lg:sticky lg:top-0 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"
      aria-label="Kanflow — menu lateral"
    >
      <div className="border-b border-white/5 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20">
            K
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-white">Kanflow</p>
            <p className="truncate text-[11px] text-gray-500">Modern SaaS workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Secções do workspace">
        <h2 className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Menu de gestão
        </h2>
        {sectionItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={selected === item.id ? 'page' : undefined}
            className={[
              'kf-btn rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
              selected === item.id
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-900/40'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {planLabel || onOpenBilling ? (
        <div className="mt-auto border-t border-white/5 p-3">
          {planLabel ? (
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Plano
            </p>
          ) : null}
          {planLabel ? (
            <span className="mb-3 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-fuchsia-200">
              {planLabel}
            </span>
          ) : null}
          {onOpenBilling ? (
            <button
              type="button"
              onClick={onOpenBilling}
              className="kf-btn w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Planos e pagamento
            </button>
          ) : null}
        </div>
      ) : null}
    </aside>
  )
}

export function WorkspacePanel({
  selected,
  cards,
  completedSprints,
  sprintHistoryEnabled = true,
  onUpgrade,
  onApplyPokerEstimate,
}: WorkspacePanelProps) {
  const sprintRows = useMemo<SprintRow[]>(
    () => buildSprintRows(completedSprints, cards),
    [completedSprints, cards],
  )
  const completedHistoryDesc = useMemo(
    () => [...completedSprints].sort((a, b) => b.endedAt - a.endedAt),
    [completedSprints],
  )
  const contributors = useMemo(() => {
    const byPerson = new Map<string, { total: number; done: number; checklistDone: number; checklistTotal: number }>()
    cards.forEach((card) => {
      const current = byPerson.get(card.assignee) ?? { total: 0, done: 0, checklistDone: 0, checklistTotal: 0 }
      const checklistDone = card.checklists.filter((item) => item.done).length
      const checklistTotal = card.checklists.length
      current.total += 1
      current.done += card.status === 'done' ? 1 : 0
      current.checklistDone += checklistDone
      current.checklistTotal += checklistTotal
      byPerson.set(card.assignee, current)
    })
    return [...byPerson.entries()]
      .map(([name, data]) => ({
        name,
        ...data,
        score: data.done * 5 + data.checklistDone,
      }))
      .sort((a, b) => b.score - a.score)
  }, [cards])

  const paidHistorySections: WorkspaceSection[] = ['performance', 'evolution', 'sprints']
  if (paidHistorySections.includes(selected) && !sprintHistoryEnabled) {
    return <PlanHistoryGate onUpgrade={onUpgrade} />
  }

  if (selected === 'performance') {
    const total = cards.length
    const done = cards.filter((card) => card.status === 'done').length
    const inProgress = cards.filter(
      (card) => card.status === 'inDev' || card.status === 'codeReview' || card.status === 'inTest',
    ).length
    const checklistTotal = cards.reduce((sum, card) => sum + card.checklists.length, 0)
    const checklistDone = cards.reduce(
      (sum, card) => sum + card.checklists.filter((item) => item.done).length,
      0,
    )
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    const checklistProgress = checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Performance da Sprint</h3>
        <p className="mt-1 text-sm text-gray-500">Indicadores do quadro atual e histórico de sprints finalizadas.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#F4F5F7] p-4">
            <p className="text-xs font-medium text-gray-500">Cards totais</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-xs font-medium text-emerald-700">Concluídos</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{done}</p>
          </div>
          <div className="rounded-2xl bg-fuchsia-50 p-4 ring-1 ring-fuchsia-100">
            <p className="text-xs font-medium text-fuchsia-800">Em andamento</p>
            <p className="mt-1 text-2xl font-bold text-fuchsia-950">{inProgress}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <p className="text-xs font-medium text-amber-800">Checklist concluído</p>
            <p className="mt-1 text-2xl font-bold text-amber-950">{checklistProgress}%</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-800">Entrega geral</p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{progress}% dos cards concluídos</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">Execução de checklist</p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-amber-400" style={{ width: `${checklistProgress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {checklistDone}/{checklistTotal} tarefas concluídas
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-900">Sprints finalizadas</h4>
          <p className="mt-1 text-sm text-gray-500">
            {completedSprints.length === 0
              ? 'Nenhuma sprint finalizada ainda. Use “Complete Sprint” no topo para salvar o quadro no histórico.'
              : `${completedSprints.length} sprint(s) registrada(s).`}
          </p>
          {completedHistoryDesc.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {completedHistoryDesc.slice(0, 8).map((s) => {
                const c = sprintCardsTotal(s)
                const d = sprintCardsDone(s)
                const pct = sprintCardsPercent(s)
                const checkPct = sprintChecklistPercent(s)
                return (
                  <li
                    key={s.id}
                    className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-[#F4F5F7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">Encerrada em {formatSprintDate(s.endedAt)}</p>
                      {typeof s.checklistTotal === 'number' && s.checklistTotal > 0 ? (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Checklist {s.checklistDone ?? 0}/{s.checklistTotal} ({checkPct}%)
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {d}/{c} cards ({pct}%)
                    </p>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>
    )
  }

  if (selected === 'evolution') {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Gráficos de Evolução das Sprints</h3>
        <p className="mt-1 text-sm text-gray-500">
          Taxa de conclusão por sprint finalizada e, se houver cards, a sprint atual em andamento.
        </p>
        {sprintRows.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">
            Nenhum dado ainda. Finalize uma sprint ou adicione cards ao quadro para ver a evolução.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {sprintRows.map((sprint) => {
              const total = sprintRowCardsTotal(sprint)
              const done = sprintRowCardsDone(sprint)
              const percent = sprintRowCardsPercent(sprint)
              return (
                <div key={sprint.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-800">{sprint.name}</span>
                    <span className="text-gray-500">
                      {done}/{total} cards ({percent}%)
                    </span>
                  </div>
                  {sprint.endedAt ? (
                    <p className="mt-0.5 text-xs text-gray-400">Encerrada em {formatSprintDate(sprint.endedAt)}</p>
                  ) : (
                    <p className="mt-0.5 text-xs text-gray-400">Quadro em andamento</p>
                  )}
                  <div className="mt-2 h-3 rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {(() => {
                    const { done: clDone, total: clTotal } = sprintRowChecklistCounts(sprint)
                    if (clTotal <= 0) return null
                    const pct = clTotal > 0 ? Math.round((clDone / clTotal) * 100) : 0
                    return (
                      <p className="mt-1 text-xs text-gray-500">
                        Checklist {clDone}/{clTotal} ({pct}%)
                      </p>
                    )
                  })()}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (selected === 'poker') {
    return <SprintPoker cards={cards} onApplyPokerEstimate={onApplyPokerEstimate} />
  }

  if (selected === 'sprints') {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Lista de Todas as Sprints</h3>
        <p className="mt-1 text-sm text-gray-500">Sprints finalizadas (histórico) e, se aplicável, o quadro atual.</p>
        {cards.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50/40 p-4">
            <p className="font-semibold text-gray-900">Sprint atual (quadro em andamento)</p>
            <p className="mt-1 text-sm text-gray-500">
              {cards.length} cards • estimativa aproximada:{' '}
              {cards.reduce((sum, card) => sum + parseHours(card.developmentTime), 0)}h
            </p>
          </div>
        ) : null}
        <div className="mt-4 space-y-3">
          {completedHistoryDesc.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma sprint finalizada. Use “Complete Sprint” para registrar o quadro aqui.
            </p>
          ) : (
            completedHistoryDesc.map((sprint) => {
              const totalC = sprintCardsTotal(sprint)
              const doneC = sprintCardsDone(sprint)
              const pct = sprintCardsPercent(sprint)
              const hours =
                sprint.cards.length > 0
                  ? sprint.cards.reduce((sum, card) => sum + parseHours(card.developmentTime), 0)
                  : null
              const checklistLine =
                typeof sprint.checklistTotal === 'number' && sprint.checklistTotal > 0
                  ? ` • checklist ${sprint.checklistDone ?? 0}/${sprint.checklistTotal} (${sprintChecklistPercent(sprint)}%)`
                  : ''
              return (
                <div key={sprint.id} className="rounded-2xl border border-gray-100 bg-[#F4F5F7] p-4">
                  <p className="font-semibold text-gray-900">{sprint.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">Encerrada em {formatSprintDate(sprint.endedAt)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {totalC} cards • {doneC} concluídos ({pct}%)
                    {checklistLine}
                    {hours !== null ? ` • estimativa ~${hours}h` : ''}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  if (selected === 'contributors') {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Desenvolvimento dos Colaboradores</h3>
        <p className="mt-1 text-sm text-gray-500">Ranking por entregas e avanço em checklists.</p>
        <div className="mt-5 space-y-2">
          {contributors.map((person) => {
            const checklistPercent =
              person.checklistTotal > 0 ? Math.round((person.checklistDone / person.checklistTotal) * 100) : 0
            return (
              <div key={person.name} className="rounded-2xl border border-gray-100 bg-[#F4F5F7] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{person.name}</p>
                  <p className="text-sm font-bold text-fuchsia-700">{person.score} pts</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {person.done} cards concluídos • {person.total} cards totais • checklist {checklistPercent}%
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-gray-900">Quadro de Cards</h3>
      <p className="mt-1 text-sm text-gray-500">Selecione esta aba para visualizar e gerenciar os cards.</p>
    </div>
  )
}

function SprintPoker({
  cards,
  onApplyPokerEstimate,
}: {
  cards: KanbanCard[]
  onApplyPokerEstimate?: (cardId: string, pontos: FibonacciPoints) => void | Promise<void>
}) {
  const cardOptions = useMemo(() => cards.map((card) => ({ id: card.id, title: card.title })), [cards])
  const members = useMemo(() => {
    const raw = cards.map((c) => (typeof c.assignee === 'string' ? c.assignee.trim() : ''))
    const uniq = [...new Set(raw.filter(Boolean))]
    if (uniq.length > 0) return uniq.slice(0, 12)
    return ['Time']
  }, [cards])

  const [selectedCardId, setSelectedCardId] = useState<string>(cardOptions[0]?.id ?? '')
  const [votesByCard, setVotesByCard] = useState<Record<string, Record<string, number>>>({})
  const [applyLoading, setApplyLoading] = useState(false)
  const pokerScale = [1, 2, 3, 5, 8, 13]

  useEffect(() => {
    if (cardOptions.length === 0) return
    if (!cardOptions.some((o) => o.id === selectedCardId)) {
      setSelectedCardId(cardOptions[0].id)
    }
  }, [cardOptions, selectedCardId])

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? null
  const votesForCard = votesByCard[selectedCardId] ?? {}

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Sprint Poker</h3>
        <p className="mt-2 text-sm text-gray-500">Adicione cards ao quadro para estimar histórias.</p>
      </div>
    )
  }

  const voteEntries = Object.entries(votesForCard)
  const averageVote =
    voteEntries.length > 0
      ? Math.round(
          (voteEntries.reduce((sum, [, value]) => sum + value, 0) / voteEntries.length) * 10,
        ) / 10
      : 0

  const consensusPoints =
    voteEntries.length > 0
      ? Math.round(voteEntries.reduce((sum, [, v]) => sum + v, 0) / voteEntries.length)
      : 0

  const fibPts = nearestFibonacciPoints(consensusPoints)

  const setVote = (member: string, point: number) => {
    setVotesByCard((prev) => ({
      ...prev,
      [selectedCardId]: {
        ...(prev[selectedCardId] ?? {}),
        [member]: point,
      },
    }))
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-gray-900">Sprint Poker</h3>
      <p className="mt-1 text-sm text-gray-500">Defina estimativas por história usando pontuação fibonacci.</p>

      <div className="mt-5">
        <label className="text-sm font-semibold text-gray-800">Card</label>
        <select
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
        >
          {cardOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {members.map((member) => (
          <div key={member} className="rounded-2xl border border-gray-100 bg-[#F4F5F7] p-4">
            <p className="text-sm font-semibold text-gray-900">{member}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {pokerScale.map((point) => (
                <button
                  key={`${selectedCardId}-${member}-${point}`}
                  type="button"
                  onClick={() => setVote(member, point)}
                  className={[
                    'kf-btn rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                    votesForCard[member] === point
                      ? 'border-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-fuchsia-200',
                  ].join(' ')}
                >
                  {point}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-fuchsia-50 p-4 text-sm text-fuchsia-950 ring-1 ring-fuchsia-100">
        <p className="font-semibold">Resultado</p>
        <p className="mt-1 text-fuchsia-900">
          {selectedCard ? `"${selectedCard.title}"` : 'Card não selecionado'} • média:{' '}
          <strong>{averageVote}</strong> pontos
          {voteEntries.length === 0 ? (
            <span className="block mt-2 text-xs font-normal text-fuchsia-800/90">
              Escolha um número em cada pessoa para contar o voto. Os votos ficam guardados por card.
            </span>
          ) : null}
        </p>
        {onApplyPokerEstimate && selectedCard && voteEntries.length > 0 ? (
          <button
            type="button"
            disabled={applyLoading}
            onClick={async () => {
              if (applyLoading) return
              setApplyLoading(true)
              try {
                await onApplyPokerEstimate(selectedCard.id, fibPts)
              } catch (e) {
                window.alert(
                  e instanceof Error ? e.message : 'Não foi possível aplicar os pontos ao card.',
                )
              } finally {
                setApplyLoading(false)
              }
            }}
            className={[
              'kf-btn relative mt-3 w-full overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition sm:w-auto',
              'hover:enabled:opacity-95 active:enabled:scale-[0.98]',
              applyLoading ? 'cursor-wait motion-safe:animate-pulse' : 'cursor-pointer',
              'disabled:opacity-95',
            ].join(' ')}
          >
            {applyLoading ? (
              <>
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent motion-safe:animate-poker-sheen"
                  aria-hidden
                />
                <span className="relative inline-flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0 motion-safe:animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Aplicando…
                </span>
              </>
            ) : (
              <>Aplicar {fibPts} pts ao card</>
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}
