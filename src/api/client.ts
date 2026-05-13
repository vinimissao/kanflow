import { getApiRoot } from './config'
import { clearStoredToken, getStoredToken } from './token'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

function extractMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    const t = body.trim()
    if (t.length > 280) return `${t.slice(0, 280)}…`
    return t
  }
  if (!body || typeof body !== 'object') return null
  const o = body as Record<string, unknown>
  const detailStr = typeof o.detail === 'string' && o.detail.trim() ? o.detail.trim() : null
  const msgStr =
    detailStr ??
    (typeof o.message === 'string' && o.message.trim() ? o.message.trim() : null) ??
    (typeof o.error === 'string' && o.error.trim() ? o.error.trim() : null)
  if (msgStr) {
    const path = typeof o.path === 'string' && o.path.trim() ? o.path.trim() : ''
    return path ? `${msgStr} (${path})` : msgStr
  }

  if (Array.isArray(o.errors) && o.errors.length > 0) {
    const first = o.errors[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object') {
      const e = first as Record<string, unknown>
      const msg = e.defaultMessage ?? e.message
      if (typeof msg === 'string') return msg
    }
  }

  if (o.errors && typeof o.errors === 'object' && !Array.isArray(o.errors)) {
    const map = o.errors as Record<string, unknown>
    const firstKey = Object.keys(map)[0]
    if (firstKey) {
      const v = map[firstKey]
      if (typeof v === 'string') return `${firstKey}: ${v}`
      if (v && typeof v === 'object' && 'defaultMessage' in v) {
        const m = (v as { defaultMessage?: unknown }).defaultMessage
        if (typeof m === 'string') return `${firstKey}: ${m}`
      }
    }
  }

  return null
}

export type ApiFetchOptions = RequestInit & {
  json?: unknown
  auth?: boolean
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const base = getApiRoot()
  if (!base) {
    throw new HttpError(0, 'VITE_API_URL não configurada. Defina no .env e reinicie o Vite.')
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)

  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const useAuth = options.auth !== false
  if (useAuth) {
    const token = getStoredToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const { json, auth: _auth, ...rest } = options
  const res = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  if (res.status === 401 && useAuth && !path.includes('/auth/login') && !path.includes('/auth/register')) {
    clearStoredToken()
    window.dispatchEvent(new CustomEvent('kanflow:session-expired'))
  }

  const text = await res.text()
  let body: unknown
  if (text) {
    try {
      body = JSON.parse(text) as unknown
    } catch {
      body = text
    }
  }

  if (!res.ok) {
    if (import.meta.env.DEV) {
      console.error('[apiFetch]', path, res.status, body ?? text)
    }
    const msg = extractMessage(body) ?? res.statusText ?? `Erro HTTP ${res.status}`
    throw new HttpError(res.status, msg, body)
  }

  if (res.status === 204 || text === '') {
    return undefined as T
  }

  return body as T
}
