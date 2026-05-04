/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Host da API, sem path final. Ex.: http://127.0.0.1:9090 — o código concatena `/api/...`. */
  readonly VITE_API_URL?: string
  /** Se `true`/`1`, não usa API (só demo no browser). */
  readonly VITE_DEMO_LOCAL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
