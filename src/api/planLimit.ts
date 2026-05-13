import { HttpError } from './client'

export function isPlanLimitError(err: unknown): boolean {
  if (!(err instanceof HttpError) || err.status !== 403) return false
  const body = err.body
  if (!body || typeof body !== 'object') return false
  return (body as Record<string, unknown>).error === 'plan_limit'
}
