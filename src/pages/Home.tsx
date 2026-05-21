import { useEffect, useMemo, useState } from 'react'
import Board from '../components/Board/Board'
import {
  authMe,
  createWorkspace,
  extractWorkspaceList,
  getStoredToken,
  HttpError,
  isApiConfigured,
  isPlanLimitError,
  listWorkspaces,
  perfilFromMePayload,
  pickWorkspaceId,
  searchWorkspaceCards,
  type UserPerfil,
} from '../api'
import { useBillingPlan } from '../hooks/useBillingPlan'
import { useKanban } from '../hooks/useKanban'
import BillingUpgrade from './BillingUpgrade'
import {
  SidebarMenu,
  WorkspacePanel,
  type WorkspaceSection,
} from '../components/Workspace/ManagementPanels'
import type { BillingPlanSnapshot } from '../types/billing'

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

function planLabelFromSnapshot(plan: BillingPlanSnapshot | null): string | null {
  if (!plan) return null
  if (plan.planType === 'FREE') return 'Free'
  if (plan.planType === 'BASIC') return 'Básico'
  return 'Full'
}

export default function Home({ userName, onLogout }: HomeProps) {
  const [section, setSection] = useState<WorkspaceSection>('board')
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [workspaceLoading, setWorkspaceLoading] = useState(false)
  const [workspaceErr, setWorkspaceErr] = useState<string | null>(null)
  const [workspacePlanLimit, setWorkspacePlanLimit] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHits, setSearchHits] = useState<string[] | null>(null)
  const [showBilling, setShowBilling] = useState(false)
  const [viewerPerfil, setViewerPerfil] = useState<UserPerfil | undefined>(undefined)

  const apiSession = isApiConfigured() && Boolean(getStoredToken())
  const useRemote = apiSession && Boolean(workspaceId)

  const { plan: billingPlan, loading: billingLoading, refresh: refreshBilling } = useBillingPlan()
  const kanban = useKanban({ workspaceId, remote: useRemote })

  const sidebarPlanLabel = apiSession ? planLabelFromSnapshot(billingPlan) : null
  const sprintHistoryEnabled = apiSession ? (billingPlan?.sprintHistoryEnabled ?? true) : true
  const showAds = Boolean(apiSession && billingPlan?.showAds)

  useEffect(() => {
    if (!apiSession) {
      setViewerPerfil(undefined)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const me = await authMe()
        if (!cancelled) setViewerPerfil(perfilFromMePayload(me))
      } catch {
        if (!cancelled) setViewerPerfil('membro')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apiSession])

  useEffect(() => {
    if (!apiSession) return
    setWorkspaceLoading(true)
    setWorkspaceErr(null)
    setWorkspacePlanLimit(false)
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
        if (cancelled) return
        if (isPlanLimitError(e)) {
          setWorkspacePlanLimit(true)
          return
        }
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

  const openBilling = () => setShowBilling(true)

  const handleCompleteSprint = async () => {
    if (kanban.cards.length === 0) {
      window.alert('O quadro está vazio. Adicione cards antes de finalizar a sprint.')
      return
    }
    const ok = window.confirm(
      'Tem certeza que deseja finalizar a sprint?\n\nO estado atual do quadro será salvo no histórico (Performance e Evolução) e um novo quadro em branco será aberto.',
    )
    if (!ok) return
    try {
      await kanban.completeSprint()
    } catch (e) {
      if (isPlanLimitError(e)) {
        window.alert('Seu plano atual não permite finalizar sprint com histórico. Faça upgrade para liberar.')
        setShowBilling(true)
        return
      }
      console.error(e)
      if (e instanceof HttpError) {
        const hint =
          e.status >= 500
            ? '\n\nErro no servidor (500). Abra o DevTools → separador Network → pedido sprints/complete → Response, e os logs do Spring no terminal.'
            : ''
        const devBody =
          import.meta.env.DEV && e.body !== undefined
            ? `\n\n[dev] corpo: ${JSON.stringify(e.body).slice(0, 500)}`
            : ''
        window.alert(`${e.message}${hint}${devBody}`)
      } else {
        window.alert('Não foi possível finalizar a sprint.')
      }
    }
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

  if (apiSession && showBilling) {
    return (
      <BillingUpgrade
        plan={billingPlan}
        planLoading={billingLoading}
        onBack={() => setShowBilling(false)}
        onPlanChanged={() => {
          void refreshBilling()
          setShowBilling(false)
        }}
      />
    )
  }

  if (apiSession && workspaceLoading) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen items-center justify-center bg-[#F4F5F7] text-sm text-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/30"
      >
        Preparando seu workspace…
      </main>
    )
  }

  if (apiSession && workspacePlanLimit) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F4F5F7] px-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/30"
      >
        <div className="max-w-md rounded-2xl border border-fuchsia-100 bg-white p-8 shadow-card">
          <h2 className="text-lg font-bold text-gray-900">Limite do plano</h2>
          <p className="mt-2 text-sm text-gray-600">
            Não é possível criar outro projeto no plano Free ou a ação não é permitida para o seu plano
            atual.
          </p>
          <button
            type="button"
            onClick={() => setShowBilling(true)}
            className="kf-btn mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25"
          >
            Ver planos e fazer upgrade
          </button>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="kf-btn mt-3 w-full rounded-2xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
            >
              Sair
            </button>
          ) : null}
        </div>
      </main>
    )
  }

  if (apiSession && workspaceErr) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F5F7] px-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/30"
      >
        <p className="max-w-md text-sm text-red-700">{workspaceErr}</p>
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="kf-btn rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >
            Sair e tentar de novo
          </button>
        ) : null}
      </main>
    )
  }

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#F4F5F7] lg:flex-row">
      <SidebarMenu
        selected={section}
        onSelect={setSection}
        planLabel={sidebarPlanLabel}
        onOpenBilling={apiSession ? openBilling : undefined}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {showAds ? (
          <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/80 px-4 py-2.5 text-center">
            <p className="text-xs text-amber-950/90">
              <span className="font-semibold">Anúncio</span> — Você está no plano Free.{' '}
              <button
                type="button"
                onClick={openBilling}
                className="kf-btn font-semibold text-fuchsia-700 underline decoration-fuchsia-300 underline-offset-2 hover:text-fuchsia-900"
              >
                Remover anúncios e desbloquear recursos
              </button>
            </p>
          </div>
        ) : null}

        <header
          className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/95 backdrop-blur-md"
          aria-label="Ferramentas do quadro e conta"
        >
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
              {apiSession && sidebarPlanLabel ? (
                <span className="hidden rounded-full bg-fuchsia-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-fuchsia-800 ring-1 ring-fuchsia-100 sm:inline">
                  {sidebarPlanLabel}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleCreateBlankBoard}
                className="kf-btn rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Novo quadro
              </button>
              <button
                type="button"
                onClick={() => void handleCompleteSprint()}
                className="kf-btn rounded-full bg-gradient-to-r from-fuchsia-500 via-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-95"
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
                    aria-hidden
                  >
                    {userInitials(userName)}
                  </div>
                ) : null}
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="kf-btn rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Sair
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuchsia-400/25 lg:p-6"
        >
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
              <WorkspacePanel
                selected={section}
                cards={kanban.cards}
                completedSprints={kanban.completedSprints}
                viewerName={userName}
                viewerPerfil={viewerPerfil}
                sprintHistoryEnabled={sprintHistoryEnabled}
                onUpgrade={apiSession ? openBilling : undefined}
                onApplyPokerEstimate={async (cardId, pontos) => {
                  await kanban.updateCardDetails(cardId, { pontos })
                }}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
