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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-4xl items-center px-4 py-10">
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Entrar</h1>
              <p className="text-sm text-gray-500">Acesse seu quadro Kanban</p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-3"
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
            <label className="text-sm font-medium text-gray-800">Nome ou e-mail</label>
            <input
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              placeholder="Ex: Vinicius ou vinicius@email.com"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <label className="text-sm font-medium text-gray-800">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            {error ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

            <button
              type="submit"
              className="mt-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={onGoCadastro}
              className="text-left text-sm text-indigo-700 transition hover:underline"
            >
              Não tenho conta. Criar cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

