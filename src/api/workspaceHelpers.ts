/** Normaliza listas retornadas como array puro, `content`, `data` ou `workspaces`. */
export function extractWorkspaceList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>
    if (Array.isArray(o.content)) return o.content
    if (Array.isArray(o.data)) return o.data
    if (Array.isArray(o.workspaces)) return o.workspaces
  }
  return []
}

export function pickWorkspaceId(ws: unknown): string | null {
  if (!ws || typeof ws !== 'object') return null
  const id = (ws as Record<string, unknown>).id
  if (typeof id === 'string' || typeof id === 'number') return String(id)
  return null
}
