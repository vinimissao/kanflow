import { apiFetch } from './client'

const base = (cardId: string) => `/cards/${encodeURIComponent(cardId)}/comentarios`

export async function listComentarios(cardId: string) {
  return apiFetch<unknown>(`${base(cardId)}`, { method: 'GET' })
}

export async function getComentario(cardId: string, comentarioId: string) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(comentarioId)}`, {
    method: 'GET',
  })
}

export async function createComentario(cardId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`${base(cardId)}`, { method: 'POST', json: body })
}

export async function updateComentario(cardId: string, comentarioId: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(comentarioId)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function deleteComentario(cardId: string, comentarioId: string) {
  return apiFetch<unknown>(`${base(cardId)}/${encodeURIComponent(comentarioId)}`, {
    method: 'DELETE',
  })
}
