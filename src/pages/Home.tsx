import Board from '../components/Board/Board'

type HomeProps = {
  userName?: string
  onLogout?: () => void
}

export default function Home({ userName, onLogout }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Kanflow</h1>
              <p className="text-sm text-gray-500">Quadro Kanban inspirado no Azure DevOps</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            {userName ? (
              <div className="hidden text-right md:block">
                <p className="text-xs text-gray-500">Logado como</p>
                <p className="text-sm font-medium text-gray-900">{userName}</p>
              </div>
            ) : null}
            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Sair
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Board />
      </main>
    </div>
  )
}

