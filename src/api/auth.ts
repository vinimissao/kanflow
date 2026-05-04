import { apiFetch } from './client'
import { setStoredToken } from './token'

export type AuthLoginBody = {
  email: string
  password: string
}

export type AuthRegisterBody = {
  name: string
  email: string
  password: string
  perfil?: 'admin' | 'membro' | 'visualizador'
}

export type ChangePasswordBody = {
  senhaAtual: string
  novaSenha: string
}

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const keys = ['accessToken', 'token', 'access_token', 'jwt', 'bearerToken'] as const
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v) return v
  }
  if (o.data && typeof o.data === 'object') {
    return extractToken(o.data)
  }
  return null
}

export function readTokenFromAuthResponse(data: unknown): string | null {
  return extractToken(data)
}

export async function authRegister(body: AuthRegisterBody) {
  const email = body.email.trim()
  const perfil = body.perfil ?? 'admin'
  // Contrato alinhado ao Spring: POST /api/auth/register
  return apiFetch<unknown>('/auth/register', {
    method: 'POST',
    json: {
      nome: body.name.trim(),
      email,
      senha: body.password,
      perfil,
    },
    auth: false,
  })
}

export async function authLogin(body: AuthLoginBody) {
  return apiFetch<unknown>('/auth/login', {
    method: 'POST',
    json: {
      email: body.email,
      senha: body.password,
    },
    auth: false,
  })
}

export async function authMe() {
  return apiFetch<unknown>('/auth/me', { method: 'GET' })
}

export async function authChangePassword(body: ChangePasswordBody) {
  return apiFetch<unknown>('/auth/change-password', {
    method: 'POST',
    json: {
      senhaAtual: body.senhaAtual,
      novaSenha: body.novaSenha,
    },
  })
}

/** Login e já persiste o token se a resposta trouxer. */
export async function loginAndStoreToken(body: AuthLoginBody) {
  const data = await authLogin(body)
  const token = readTokenFromAuthResponse(data)
  if (token) setStoredToken(token)
  return data
}

export async function registerAndStoreToken(body: AuthRegisterBody) {
  const data = await authRegister(body)
  const token = readTokenFromAuthResponse(data)
  if (token) setStoredToken(token)
  return data
}
