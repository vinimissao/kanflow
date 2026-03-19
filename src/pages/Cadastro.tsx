import { useState } from 'react'

type CadastroProps = {
  onCadastro: (name: string) => void
  onGoLogin: () => void
}

export default function Cadastro({ onCadastro, onGoLogin }: CadastroProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
              <h1 className="text-lg font-semibold text-gray-900">Criar conta</h1>
              <p className="text-sm text-gray-500">Cadastro para usar o Kanflow</p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)

              const trimmedName = name.trim()
              const trimmedEmail = email.trim()
              if (!trimmedName) {
                setError('Informe seu nome.')
                return
              }
              if (!trimmedEmail) {
                setError('Informe seu e-mail.')
                return
              }
              if (!password.trim()) {
                setError('Informe a senha.')
                return
              }

              onCadastro(trimmedName)
            }}
          >
            <label className="text-sm font-medium text-gray-800">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vinicius"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <label className="text-sm font-medium text-gray-800">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vinicius@email.com"
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
              Criar
            </button>

            <button
              type="button"
              onClick={onGoLogin}
              className="text-left text-sm text-indigo-700 transition hover:underline"
            >
              Já tenho conta. Voltar para login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

