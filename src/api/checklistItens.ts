import { apiFetch } from './client'

const base = (cardId: string) => `/cards/${encodeURIComponent(cardId)}/checklist-itens`

export async function listChecklistItens(cardId: string) {
  return apiFetch<unknown>(`${base(cardId)}`, { method: 'GET' })
}

export async function getChecklistItem(cardId: string, itemId: string) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(itemId)}`, { method: 'GET' })
}

export async function createChecklistItem(cardId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`${base(cardId)}`, { method: 'POST', json: body })
}

export async function updateChecklistItem(cardId: string, itemId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function deleteChecklistItem(cardId: string, itemId: string) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  })
}
