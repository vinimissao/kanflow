import { apiFetch } from './client'

export async function listUsuarios() {
  return apiFetch<unknown>('/usuarios', { method: 'GET' })
}

export async function getUsuario(id: string) {
  return apiFetch<unknown>(`/usuarios/${encodeURIComponent(id)}`, { method: 'GET' })
}

export async function createUsuario(body: Record<string, unknown>) {
  return apiFetch<unknown>('/usuarios', { method: 'POST', json: body })
}

export async function updateUsuario(id: string, body: Record<string, unknown>) {
  return apiFetch<unknown>(`/usuarios/${encodeURIComponent(id)}`, {
    method: 'PUT',
    json: body,
  })
}

export async function deleteUsuario(id: string) {
  return apiFetch<unknown>(`/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
