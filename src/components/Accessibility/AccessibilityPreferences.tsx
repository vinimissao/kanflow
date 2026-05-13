import { useCallback, useEffect, useId, useRef, useState } from 'react'

const LS_REDUCE = 'kanflow_a11y_reduce_motion'
const LS_LARGE = 'kanflow_a11y_large_text'

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    if (on) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  } catch {}
}

function applyDom(reduceMotion: boolean, largeText: boolean) {
  const root = document.documentElement
  if (reduceMotion) root.setAttribute('data-kf-reduce-motion', 'true')
  else root.removeAttribute('data-kf-reduce-motion')
  if (largeText) root.setAttribute('data-kf-large-text', 'true')
  else root.removeAttribute('data-kf-large-text')
}

export default function AccessibilityPreferences() {
  const panelId = useId()
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(() => readFlag(LS_REDUCE))
  const [largeText, setLargeText] = useState(() => readFlag(LS_LARGE))

  useEffect(() => {
    applyDom(reduceMotion, largeText)
  }, [reduceMotion, largeText])

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const toggleReduce = () => {
    setReduceMotion((v) => {
      const next = !v
      writeFlag(LS_REDUCE, next)
      return next
    })
  }

  const toggleLarge = () => {
    setLargeText((v) => {
      const next = !v
      writeFlag(LS_LARGE, next)
      return next
    })
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <button
          ref={triggerRef}
          type="button"
          className="kf-btn kf-focus-ring flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg shadow-gray-900/10 backdrop-blur-sm"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setOpen((o) => !o)}
        >
          <svg className="h-5 w-5 shrink-0 text-fuchsia-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Acessibilidade
        </button>

        {open ? (
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="kf-focus-within-ring w-[min(100vw-2rem,18rem)] rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-xl"
          >
            <h2 id={titleId} className="text-base font-bold text-gray-900">
              Preferências
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Ajustes guardados neste dispositivo. O sistema também pode respeitar “reduzir movimento” nas
              definições do SO.
            </p>

            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={reduceMotion}
                    onChange={toggleReduce}
                  />
                  <span>
                    <span className="font-semibold">Reduzir animações</span>
                    <span className="mt-0.5 block text-xs text-gray-500">
                      Transições e animações mais curtas ou desativadas.
                    </span>
                  </span>
                </label>
              </li>
              <li>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={largeText}
                    onChange={toggleLarge}
                  />
                  <span>
                    <span className="font-semibold">Texto maior</span>
                    <span className="mt-0.5 block text-xs text-gray-500">
                      Aumenta ligeiramente o tamanho base da letra em toda a app.
                    </span>
                  </span>
                </label>
              </li>
            </ul>

            <button
              type="button"
              className="kf-btn kf-focus-ring mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={close}
            >
              Fechar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
