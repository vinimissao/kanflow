import { apiFetch } from './client'

export async function listWorkspaces() {
  return apiFetch<unknown>('/workspaces', { method: 'GET' })
}

export async function createWorkspace(body: Record<string, unknown>) {
  return apiFetch<unknown>('/workspaces', { method: 'POST', json: body })
}

export async function getWorkspace(id: string) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(id)}`, { method: 'GET' })
}

export async function updateWorkspace(id: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(id)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function deleteWorkspace(id: string) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function getWorkspaceBoard(workspaceId: string) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(workspaceId)}/board`, {
    method: 'GET',
  })
}

export async function putWorkspaceBoard(workspaceId: string, body: unknown) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(workspaceId)}/board`, {
    method: 'PUT',
    json: body,
  })
}

export async function searchWorkspaceCards(workspaceId: string, q: string) {
  const qs = new URLSearchParams({ q })
  return apiFetch<unknown>(
    `/workspaces/${encodeURIComponent(workspaceId)}/search?${qs.toString()}`,
    { method: 'GET' },
  )
}

export async function completeWorkspaceSprint(workspaceId: string) {
  return apiFetch<unknown>(
    `/workspaces/${encodeURIComponent(workspaceId)}/sprints/complete`,
    { method: 'POST' },
  )
}

export async function blankWorkspaceBoard(workspaceId: string) {
  return apiFetch<unknown>(
    `/workspaces/${encodeURIComponent(workspaceId)}/board/blank`,
    { method: 'POST' },
  )
}

export async function listWorkspaceSprints(workspaceId: string) {
  return apiFetch<unknown>(`/workspaces/${encodeURIComponent(workspaceId)}/sprints`, {
    method: 'GET',
  })
}

export async function getWorkspaceSprint(workspaceId: string, sprintHistoryId: string) {
  return apiFetch<unknown>(
    `/workspaces/${encodeURIComponent(workspaceId)}/sprints/${encodeURIComponent(sprintHistoryId)}`,
    { method: 'GET' },
  )
}
