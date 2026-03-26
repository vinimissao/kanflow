import { useMemo, useState } from 'react'
import type { CompletedSprintRecord, KanbanCard } from '../../types'

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
}

type WorkspacePanelProps = {
  selected: WorkspaceSection
  cards: KanbanCard[]
  completedSprints: CompletedSprintRecord[]
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
}

/** Sprints finalizadas (em ordem cronológica) + sprint atual opcional. */
function buildSprintRows(completed: CompletedSprintRecord[], currentCards: KanbanCard[]): SprintRow[] {
  const sorted = [...completed].sort((a, b) => a.endedAt - b.endedAt)
  const rows: SprintRow[] = sorted.map((s) => ({
    id: s.id,
    name: s.name,
    endedAt: s.endedAt,
    cards: s.cards,
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

export function SidebarMenu({ selected, onSelect }: SidebarMenuProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/5 bg-[#121417] lg:sticky lg:top-0 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
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

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Menu de gestão
        </h2>
        {sectionItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              'rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
              selected === item.id
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-900/40'
                : 'text-gray-400 hover:bg-white/5 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

export function WorkspacePanel({ selected, cards, completedSprints }: WorkspacePanelProps) {
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
                const c = s.cards.length
                const d = s.cards.filter((x) => x.status === 'done').length
                const pct = c > 0 ? Math.round((d / c) * 100) : 0
                return (
                  <li
                    key={s.id}
                    className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-[#F4F5F7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">Encerrada em {formatSprintDate(s.endedAt)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {d}/{c} concluídos ({pct}%)
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
              const total = sprint.cards.length
              const done = sprint.cards.filter((card) => card.status === 'done').length
              const percent = total > 0 ? Math.round((done / total) * 100) : 0
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
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (selected === 'poker') {
    return <SprintPoker cards={cards} />
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
              const hours = sprint.cards.reduce((sum, card) => sum + parseHours(card.developmentTime), 0)
              const done = sprint.cards.filter((c) => c.status === 'done').length
              return (
                <div key={sprint.id} className="rounded-2xl border border-gray-100 bg-[#F4F5F7] p-4">
                  <p className="font-semibold text-gray-900">{sprint.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">Encerrada em {formatSprintDate(sprint.endedAt)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {sprint.cards.length} cards • {done} concluídos • estimativa aproximada: {hours}h
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

function SprintPoker({ cards }: { cards: KanbanCard[] }) {
  const cardOptions = useMemo(() => cards.map((card) => ({ id: card.id, title: card.title })), [cards])
  const members = useMemo(() => [...new Set(cards.map((card) => card.assignee))].slice(0, 8), [cards])
  const [selectedCardId, setSelectedCardId] = useState<string>(cardOptions[0]?.id ?? '')
  const [votes, setVotes] = useState<Record<string, number>>({})
  const pokerScale = [1, 2, 3, 5, 8, 13]

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? null

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Sprint Poker</h3>
        <p className="mt-2 text-sm text-gray-500">Adicione cards ao quadro para estimar histórias.</p>
      </div>
    )
  }
  const averageVote = Object.keys(votes).length
    ? Math.round((Object.values(votes).reduce((sum, value) => sum + value, 0) / Object.keys(votes).length) * 10) / 10
    : 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-gray-900">Sprint Poker</h3>
      <p className="mt-1 text-sm text-gray-500">Defina estimativas por história usando pontuação fibonacci.</p>

      <div className="mt-5">
        <label className="text-sm font-semibold text-gray-800">Card</label>
        <select
          value={selectedCardId}
          onChange={(e) => {
            setSelectedCardId(e.target.value)
            setVotes({})
          }}
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
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">Não há colaboradores para votação.</p>
        ) : (
          members.map((member) => (
            <div key={member} className="rounded-2xl border border-gray-100 bg-[#F4F5F7] p-4">
              <p className="text-sm font-semibold text-gray-900">{member}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokerScale.map((point) => (
                  <button
                    key={`${member}-${point}`}
                    type="button"
                    onClick={() => setVotes((prev) => ({ ...prev, [member]: point }))}
                    className={[
                      'rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                      votes[member] === point
                        ? 'border-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-fuchsia-200',
                    ].join(' ')}
                  >
                    {point}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-fuchsia-50 p-4 text-sm text-fuchsia-950 ring-1 ring-fuchsia-100">
        <p className="font-semibold">Resultado</p>
        <p className="mt-1 text-fuchsia-900">
          {selectedCard ? `"${selectedCard.title}"` : 'Card não selecionado'} • média: {averageVote} pontos
        </p>
      </div>
    </div>
  )
}
