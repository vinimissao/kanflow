import { useMemo, useState } from 'react'
import type { KanbanCard } from '../../types'

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
}

const sectionItems: { id: WorkspaceSection; label: string }[] = [
  { id: 'board', label: 'Quadro' },
  { id: 'performance', label: 'Performance da Sprint' },
  { id: 'evolution', label: 'Gráficos de Evolução' },
  { id: 'poker', label: 'Sprint Poker' },
  { id: 'sprints', label: 'Lista de Sprints' },
  { id: 'contributors', label: 'Desenvolvimento dos Colaboradores' },
]

type SprintSummary = {
  id: string
  name: string
  cards: KanbanCard[]
}

function buildSprints(cards: KanbanCard[]): SprintSummary[] {
  return [
    {
      id: 'sprint-1',
      name: 'Sprint 1 - Planejamento',
      cards: cards.filter((card) => card.status === 'backlog' || card.status === 'planned'),
    },
    {
      id: 'sprint-2',
      name: 'Sprint 2 - Desenvolvimento',
      cards: cards.filter((card) => card.status === 'readyForDev' || card.status === 'inDev'),
    },
    {
      id: 'sprint-3',
      name: 'Sprint 3 - Qualidade e Entrega',
      cards: cards.filter(
        (card) => card.status === 'codeReview' || card.status === 'inTest' || card.status === 'done',
      ),
    },
  ]
}

function parseHours(value: string): number {
  const match = value.match(/\d+/)
  if (!match) return 0
  return Number(match[0])
}

export function SidebarMenu({ selected, onSelect }: SidebarMenuProps) {
  return (
    <aside className="w-full rounded-2xl border border-gray-200 bg-white p-3 lg:w-72 lg:self-start">
      <h2 className="px-2 pb-2 text-sm font-semibold text-gray-900">Menu de Gestão</h2>
      <div className="flex flex-col gap-1">
        {sectionItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              'rounded-xl px-3 py-2 text-left text-sm transition',
              selected === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-50',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

export function WorkspacePanel({ selected, cards }: WorkspacePanelProps) {
  const sprints = useMemo(() => buildSprints(cards), [cards])
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Performance da Sprint</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Cards totais</p>
            <p className="text-xl font-semibold text-gray-900">{total}</p>
          </div>
          <div className="rounded-xl bg-green-50 p-3">
            <p className="text-xs text-green-700">Concluídos</p>
            <p className="text-xl font-semibold text-green-800">{done}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3">
            <p className="text-xs text-indigo-700">Em andamento</p>
            <p className="text-xl font-semibold text-indigo-800">{inProgress}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-amber-700">Checklist concluído</p>
            <p className="text-xl font-semibold text-amber-800">{checklistProgress}%</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Entrega geral</p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">{progress}% dos cards concluídos</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Execução de checklist</p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: `${checklistProgress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">{checklistDone}/{checklistTotal} tarefas concluídas</p>
          </div>
        </div>
      </div>
    )
  }

  if (selected === 'evolution') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Gráficos de Evolução das Sprints</h3>
        <p className="mt-1 text-sm text-gray-500">Indicador por sprint com taxa de conclusão de cards.</p>
        <div className="mt-5 space-y-4">
          {sprints.map((sprint) => {
            const total = sprint.cards.length
            const done = sprint.cards.filter((card) => card.status === 'done').length
            const percent = total > 0 ? Math.round((done / total) * 100) : 0
            return (
              <div key={sprint.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{sprint.name}</span>
                  <span className="text-gray-500">
                    {done}/{total} cards ({percent}%)
                  </span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (selected === 'poker') {
    return <SprintPoker cards={cards} />
  }

  if (selected === 'sprints') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Lista de Todas as Sprints</h3>
        <div className="mt-4 space-y-3">
          {sprints.map((sprint) => {
            const hours = sprint.cards.reduce((sum, card) => sum + parseHours(card.developmentTime), 0)
            return (
              <div key={sprint.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="font-medium text-gray-900">{sprint.name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {sprint.cards.length} cards planejados • estimativa aproximada: {hours}h
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (selected === 'contributors') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Desenvolvimento dos Colaboradores</h3>
        <p className="mt-1 text-sm text-gray-500">Ranking por entregas e avanço em checklists.</p>
        <div className="mt-4 space-y-2">
          {contributors.map((person) => {
            const checklistPercent =
              person.checklistTotal > 0 ? Math.round((person.checklistDone / person.checklistTotal) * 100) : 0
            return (
              <div key={person.name} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-sm font-semibold text-indigo-700">{person.score} pts</p>
                </div>
                <p className="mt-1 text-xs text-gray-600">
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Quadro de Cards</h3>
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
  const averageVote = Object.keys(votes).length
    ? Math.round((Object.values(votes).reduce((sum, value) => sum + value, 0) / Object.keys(votes).length) * 10) / 10
    : 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Sprint Poker</h3>
      <p className="mt-1 text-sm text-gray-500">Defina estimativas por história usando pontuação fibonacci.</p>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-800">Card</label>
        <select
          value={selectedCardId}
          onChange={(e) => {
            setSelectedCardId(e.target.value)
            setVotes({})
          }}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
        >
          {cardOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">Não há colaboradores para votação.</p>
        ) : (
          members.map((member) => (
            <div key={member} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-800">{member}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokerScale.map((point) => (
                  <button
                    key={`${member}-${point}`}
                    type="button"
                    onClick={() => setVotes((prev) => ({ ...prev, [member]: point }))}
                    className={[
                      'rounded-lg border px-2 py-1 text-xs',
                      votes[member] === point
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-200 bg-white text-gray-700',
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

      <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">
        <p className="font-medium">Resultado</p>
        <p className="mt-1">
          {selectedCard ? `"${selectedCard.title}"` : 'Card não selecionado'} • média: {averageVote} pontos
        </p>
      </div>
    </div>
  )
}
