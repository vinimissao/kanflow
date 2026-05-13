export function getApiRoot(): string {
  if (import.meta.env.VITE_DEMO_LOCAL === '1' || import.meta.env.VITE_DEMO_LOCAL === 'true') {
    return ''
  }
  const raw = import.meta.env.VITE_API_URL?.trim()
  if (raw) {
    return `${raw.replace(/\/$/, '')}/api`
  }
  if (import.meta.env.DEV) {
    return '/api'
  }
  return ''
}

export function isApiConfigured(): boolean {
  return getApiRoot().length > 0
}
