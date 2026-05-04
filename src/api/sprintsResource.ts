import { apiFetch } from './client'

export async function listSprints() {
  return apiFetch<unknown>('/sprints', { method: 'GET' })
}

export async function getSprint(id: string) {
  return apiFetch<unknown>(`/sprints/${encodeURIComponent(id)}`, { method: 'GET' })
}

export async function createSprint(body: Record<string, unknown>) {
  return apiFetch<unknown>('/sprints', { method: 'POST', json: body })
}

export async function updateSprint(id: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/sprints/${encodeURIComponent(id)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function deleteSprint(id: string) {
  return apiFetch<unknown>(`/sprints/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function listSprintCards(sprintId: string) {
  return apiFetch<unknown>(`/sprints/${encodeURIComponent(sprintId)}/cards`, { method: 'GET' })
}

export async function linkCardToSprint(sprintId: string, cardId: string) {
  return apiFetch<unknown>(
    `/sprints/${encodeURIComponent(sprintId)}/cards/${encodeURIComponent(cardId)}`,
    { method: 'POST' },
  )
}

export async function unlinkCardFromSprint(sprintId: string, cardId: string) {
  return apiFetch<unknown>(
    `/sprints/${encodeURIComponent(sprintId)}/cards/${encodeURIComponent(cardId)}`,
    { method: 'DELETE' },
  )
}
