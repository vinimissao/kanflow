import { useEffect, useMemo, useState } from 'react'
import Board from '../components/Board/Board'
import {
  createWorkspace,
  extractWorkspaceList,
  getStoredToken,
  HttpError,
  isApiConfigured,
  listWorkspaces,
  pickWorkspaceId,
  searchWorkspaceCards,
} from '../api'
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
  const [section, setSection] = useState<WorkspaceSection>('board')
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [workspaceLoading, setWorkspaceLoading] = useState(false)
  const [workspaceErr, setWorkspaceErr] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHits, setSearchHits] = useState<string[] | null>(null)

  const apiSession = isApiConfigured() && Boolean(getStoredToken())
  const useRemote = apiSession && Boolean(workspaceId)

  const kanban = useKanban({ workspaceId, remote: useRemote })

  useEffect(() => {
    if (!apiSession) return
    setWorkspaceLoading(true)
    setWorkspaceErr(null)
    let cancelled = false
    ;(async () => {
      try {
        const raw = await listWorkspaces()
        if (cancelled) return
        const list = extractWorkspaceList(raw)
        if (list.length === 0) {
          const created = await createWorkspace({
            nome: 'Meu projeto',
          })
          const id = pickWorkspaceId(created)
          setWorkspaceId(id)
        } else {
          setWorkspaceId(pickWorkspaceId(list[0]))
        }
      } catch (e) {
        const msg =
          e instanceof HttpError
            ? e.message
            : 'Não foi possível carregar o workspace. Confira se a API está no ar.'
        setWorkspaceErr(msg)
      } finally {
        if (!cancelled) setWorkspaceLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apiSession])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q || !workspaceId || !useRemote) {
      setSearchHits(null)
      return
    }
    const t = window.setTimeout(() => {
      ;(async () => {
        try {
          const raw = await searchWorkspaceCards(workspaceId, q)
          const list = Array.isArray(raw)
            ? raw
            : (raw as Record<string, unknown>)?.content
          const ids: string[] = []
          if (Array.isArray(list)) {
            for (const item of list) {
              if (item && typeof item === 'object' && 'id' in item) {
                ids.push(String((item as { id: unknown }).id))
              }
            }
          }
          setSearchHits(ids)
        } catch {
          setSearchHits(null)
        }
      })()
    }, 350)
    return () => window.clearTimeout(t)
  }, [searchQuery, workspaceId, useRemote])

  const visibleCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return kanban.cards
    if (useRemote && searchHits) {
      const set = new Set(searchHits)
      return kanban.cards.filter((c) => set.has(c.id))
    }
    return kanban.cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.assignee.toLowerCase().includes(q),
    )
  }, [kanban.cards, searchQuery, searchHits, useRemote])

  const kanbanForBoard = useMemo(
    () => ({
      ...kanban,
      cards: visibleCards,
    }),
    [kanban, visibleCards],
  )

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

  if (apiSession && workspaceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] text-sm text-gray-600">
        Preparando seu workspace…
      </div>
    )
  }

  if (apiSession && workspaceErr) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F5F7] px-4 text-center">
        <p className="max-w-md text-sm text-red-700">{workspaceErr}</p>
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >
            Sair e tentar de novo
          </button>
        ) : null}
      </div>
    )
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            {section === 'board' ? <Board kanban={kanbanForBoard} /> : null}
            {section !== 'board' ? (
              <WorkspacePanel selected={section} cards={kanban.cards} completedSprints={kanban.completedSprints} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
