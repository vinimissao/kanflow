import { useState } from 'react'
import {
  authMe,
  displayNameFromMePayload,
  getStoredToken,
  HttpError,
  isApiConfigured,
  registerAndStoreToken,
  setSessionUserId,
  userIdFromMePayload,
} from '../api'
import TermsOfUseModal from '../components/Legal/TermsOfUseModal'

type CadastroProps = {
  onCadastro: (name: string) => void
  onGoLogin: () => void
}

export default function Cadastro({ onCadastro, onGoLogin }: CadastroProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [perfil, setPerfil] = useState<'admin' | 'membro' | 'visualizador'>('admin')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <div className="flex min-h-screen bg-[#F4F5F7] px-4">
        <div className="mx-auto flex w-full max-w-md items-center py-12">
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full rounded-2xl border border-gray-100 bg-white/95 p-6 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/30 md:p-8"
          >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20">
              K
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-gray-900">Criar conta</h1>
              <p className="text-sm text-gray-500">Cadastro para usar o Kanflow</p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={async (e) => {
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
              if (!acceptedTerms) {
                setError('É necessário aceitar os Termos de Uso para criar a conta.')
                return
              }

              if (isApiConfigured()) {
                setLoading(true)
                try {
                  await registerAndStoreToken({
                    name: trimmedName,
                    email: trimmedEmail,
                    password,
                    perfil,
                  })
                  let display = trimmedName
                  if (getStoredToken()) {
                    try {
                      const me = await authMe()
                      setSessionUserId(userIdFromMePayload(me))
                      display = displayNameFromMePayload(me)
                    } catch {
                      display = trimmedName
                    }
                  }
                  onCadastro(display)
                } catch (err) {
                  const msg =
                    err instanceof HttpError
                      ? err.message
                      : 'Não foi possível criar a conta. Tente novamente.'
                  setError(msg)
                } finally {
                  setLoading(false)
                }
                return
              }

              onCadastro(trimmedName)
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="cadastro-nome" className="text-sm font-semibold text-gray-800">
                Nome
              </label>
              <input
                id="cadastro-nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vinicius"
                autoComplete="name"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cadastro-email" className="text-sm font-semibold text-gray-800">
                E-mail
              </label>
              <input
                id="cadastro-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vinicius@email.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cadastro-senha" className="text-sm font-semibold text-gray-800">
                Senha
              </label>
              <input
                id="cadastro-senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </div>

            {isApiConfigured() ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="cadastro-perfil" className="text-sm font-semibold text-gray-800">
                  Perfil
                </label>
                <select
                  id="cadastro-perfil"
                  value={perfil}
                  onChange={(e) =>
                    setPerfil(e.target.value as 'admin' | 'membro' | 'visualizador')
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                >
                  <option value="admin">admin</option>
                  <option value="membro">membro</option>
                  <option value="visualizador">visualizador</option>
                </select>
              </div>
            ) : null}

            <div className="rounded-2xl border border-gray-100 bg-[#F4F5F7] px-4 py-3">
              <label htmlFor="cadastro-termos" className="flex cursor-pointer items-start gap-3">
                <input
                  id="cadastro-termos"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="text-sm leading-snug text-gray-700">
                  Declaro que li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-semibold text-fuchsia-700 underline decoration-fuchsia-300 underline-offset-2 hover:text-fuchsia-900"
                  >
                    Termos de Uso
                  </button>{' '}
                  do Kanflow (incluindo planos, cancelamento e limitações descritos no documento).
                </span>
              </label>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="mt-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/25 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Criando…' : 'Criar'}
            </button>

            <button
              type="button"
              onClick={onGoLogin}
              className="text-left text-sm font-semibold text-fuchsia-700 transition hover:underline"
            >
              Já tenho conta. Voltar para login
            </button>
          </form>
          </main>
        </div>
      </div>
      <TermsOfUseModal open={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </>
  )
}
