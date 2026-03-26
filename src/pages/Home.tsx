import { useState } from 'react'
import Board from '../components/Board/Board'
import { useKanban } from '../hooks/useKanban'
import {
  SidebarMenu,
  WorkspacePanel,
  type WorkspaceSection,
} from '../components/Workspace/ManagementPanels'

type HomeProps = {
  userName?: string
  onLogout?: () => void
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function userInitials(name: string) {
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || '?'
}

export default function Home({ userName, onLogout }: HomeProps) {
  const kanban = useKanban()
  const [section, setSection] = useState<WorkspaceSection>('board')

  const handleCompleteSprint = () => {
    if (kanban.cards.length === 0) {
      window.alert('O quadro está vazio. Adicione cards antes de finalizar a sprint.')
      return
    }
    const ok = window.confirm(
      'Tem certeza que deseja finalizar a sprint?\n\nO estado atual do quadro será salvo no histórico (Performance, Evolução e Lista de Sprints) e um novo quadro em branco será aberto.',
    )
    if (!ok) return
    kanban.completeSprint()
  }

  const handleCreateBlankBoard = () => {
    if (kanban.cards.length === 0) {
      window.alert('O quadro já está em branco.')
      return
    }
    const ok = window.confirm(
      'Criar um novo quadro em branco?\n\nO quadro atual será descartado sem ser salvo no histórico de sprints finalizadas.',
    )
    if (!ok) return
    kanban.createBlankBoard()
  }

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      <SidebarMenu selected={section} onSelect={setSection} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6">
            <div className="relative min-w-0 flex-1 max-w-xl">
              <SearchIcon />
              <input
                type="search"
                placeholder="Buscar cards, responsáveis ou tarefas..."
                className="w-full rounded-full border border-gray-200/90 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-400/20"
                aria-label="Buscar no quadro"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCreateBlankBoard}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
              >
                Novo quadro
              </button>
              <button
                type="button"
                onClick={handleCompleteSprint}
                className="rounded-full bg-gradient-to-r from-fuchsia-500 via-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-95 active:scale-[0.98]"
              >
                Complete Sprint
              </button>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
                {userName ? (
                  <div className="hidden text-right sm:block">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Logado</p>
                    <p className="max-w-[140px] truncate text-sm font-semibold text-gray-900">{userName}</p>
                  </div>
                ) : null}
                {userName ? (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 text-xs font-bold text-white shadow-md ring-2 ring-white"
                    title={userName}
                  >
                    {userInitials(userName)}
                  </div>
                ) : null}
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Sair
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {section === 'board' ? 'Sprint board' : 'Painéis de gestão'}
              </h1>
              <p className="text-sm text-gray-500">
                {section === 'board'
                  ? 'Arraste cards entre colunas e acompanhe o fluxo em tempo real.'
                  : 'Indicadores e estimativas para apoio à decisão.'}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            {section === 'board' ? <Board kanban={kanban} /> : null}
            {section !== 'board' ? (
              <WorkspacePanel selected={section} cards={kanban.cards} completedSprints={kanban.completedSprints} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
