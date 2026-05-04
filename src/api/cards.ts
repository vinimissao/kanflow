import { apiFetch } from './client'

export async function listCards(workspaceId?: string) {
  const qs = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : ''
  return apiFetch<unknown>(`/cards${qs}`, { method: 'GET' })
}

export async function getCard(cardId: string) {
  return apiFetch<unknown>(`/cards/${encodeURIComponent(cardId)}`, { method: 'GET' })
}

export async function createCard(body: Record<string, unknown>) {
  return apiFetch<unknown>('/cards', { method: 'POST', json: body })
}

export async function putCard(cardId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/cards/${encodeURIComponent(cardId)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function patchCard(cardId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/cards/${encodeURIComponent(cardId)}`, {
    method: 'PATCH',
    json: body,
  })
}

export async function moveCard(cardId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/cards/${encodeURIComponent(cardId)}/move`, {
    method: 'POST',
    json: body,
  })
}

export async function deleteCard(cardId: string) {
  return apiFetch<unknown>(`/cards/${encodeURIComponent(cardId)}`, { method: 'DELETE' })
}
