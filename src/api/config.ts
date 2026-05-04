/**
 * Base da API, sempre terminando no path `/api` lógico.
 *
 * - Com `VITE_API_URL` (ex.: http://127.0.0.1:9090): chamadas diretas (CORS precisa estar ok no back).
 * - Em **dev** sem `VITE_API_URL`: usa `/api` no mesmo host do Vite → o proxy (vite.config) manda para o Spring.
 * - `VITE_DEMO_LOCAL=true`: desliga API (só estado local, como antes).
 */
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
