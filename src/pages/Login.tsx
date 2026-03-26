import { useState } from 'react'

type LoginProps = {
  onLogin: (name: string) => void
  onGoCadastro: () => void
}

export default function Login({ onLogin, onGoCadastro }: LoginProps) {
  const [nameOrEmail, setNameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] px-4">
      <div className="mx-auto flex w-full max-w-md items-center py-12">
        <div className="w-full rounded-2xl border border-gray-100 bg-white/95 p-6 shadow-card md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20">
              K
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-gray-900">Entrar</h1>
              <p className="text-sm text-gray-500">Acesse seu quadro Kanban</p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)

              const name = nameOrEmail.trim()
              if (!name) {
                setError('Informe seu nome ou e-mail.')
                return
              }
              if (!password.trim()) {
                setError('Informe a senha.')
                return
              }

              onLogin(name)
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">Nome ou e-mail</label>
              <input
                value={nameOrEmail}
                onChange={(e) => setNameOrEmail(e.target.value)}
                placeholder="Ex: Vinicius ou vinicius@email.com"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/25 transition hover:opacity-95 active:scale-[0.98]"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={onGoCadastro}
              className="text-left text-sm font-semibold text-fuchsia-700 transition hover:underline"
            >
              Não tenho conta. Criar cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

