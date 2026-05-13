import {
  TERMS_OF_USE_BODY,
  TERMS_OF_USE_TITLE,
  TERMS_OF_USE_UPDATED,
  TERMS_SUPPORT_EMAIL,
} from '../../legal/termsOfUse'

type TermsOfUseModalProps = {
  open: boolean
  onClose: () => void
}

export default function TermsOfUseModal({ open, onClose }: TermsOfUseModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121417]/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-of-use-title"
    >
      <div className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-gray-100 px-5 py-4">
          <h2 id="terms-of-use-title" className="text-lg font-bold text-gray-900">
            {TERMS_OF_USE_TITLE}
          </h2>
          <p className="mt-1 text-xs text-gray-500">{TERMS_OF_USE_UPDATED}</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-gray-700">
            {TERMS_OF_USE_BODY}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Contato:{' '}
            <a className="font-semibold text-fuchsia-700 underline" href={`mailto:${TERMS_SUPPORT_EMAIL}`}>
              {TERMS_SUPPORT_EMAIL}
            </a>
          </p>
        </div>
        <div className="shrink-0 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="kf-btn w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
