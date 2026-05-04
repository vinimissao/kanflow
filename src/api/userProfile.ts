/** Extrai nome amigável do payload de GET /auth/me. */
export function displayNameFromMePayload(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Usuário'
  const o = data as Record<string, unknown>
  const nome = o.nome ?? o.name ?? o.fullName ?? o.email ?? o.username
  if (typeof nome === 'string' && nome.trim()) return nome.trim()
  return 'Usuário'
}

/** UUID do usuário para `autorId` em comentários. */
export function userIdFromMePayload(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const id = o.id ?? o.userId ?? o.usuarioId ?? o.uuid
  if (typeof id === 'string' && id) return id
  if (typeof id === 'number') return String(id)
  return null
}
