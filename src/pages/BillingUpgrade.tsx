import { useState } from 'react'
import {
  billingCheckout,
  cancelBillingSubscription,
  confirmMockPayment,
  HttpError,
  normalizeCheckoutResponse,
} from '../api'
import { TERMS_SUPPORT_EMAIL } from '../legal/termsOfUse'
import type { BillingPeriod, BillingPlanSnapshot, PaidPlanType } from '../types/billing'

function isBillingCancelEndpointMissing(err: unknown): boolean {
  if (!(err instanceof HttpError)) return false
  if (err.status === 404 || err.status === 405 || err.status === 501) return true
  const body = err.body
  const detail =
    body && typeof body === 'object'
      ? String((body as Record<string, unknown>).detail ?? '').toLowerCase()
      : ''
  if (err.status === 500) {
    if (detail.includes('no static resource')) return true
    if (detail.includes('billing/cancel')) return true
  }
  return false
}

function formatBRLFromCents(cents: number | undefined): string {
  if (cents == null || Number.isNaN(cents)) return '—'
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

type BillingUpgradeProps = {
  plan: BillingPlanSnapshot | null
  planLoading: boolean
  onBack: () => void
  onPlanChanged: () => void
}

export default function BillingUpgrade({
  plan,
  planLoading,
  onBack,
  onPlanChanged,
}: BillingUpgradeProps) {
  const [period, setPeriod] = useState<BillingPeriod>('MONTHLY')
  const [busyPlan, setBusyPlan] = useState<PaidPlanType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<ReturnType<typeof normalizeCheckoutResponse> | null>(
    null,
  )
  const [confirmBusy, setConfirmBusy] = useState(false)
  const [cancelBusy, setCancelBusy] = useState(false)

  const prices =
    period === 'MONTHLY' ? plan?.pricesMonthlyCents : plan?.pricesYearlyCents

  const startCheckout = async (planType: PaidPlanType) => {
    setError(null)
    setBusyPlan(planType)
    setCheckout(null)
    try {
      const raw = await billingCheckout({ planType, billingPeriod: period })
      setCheckout(normalizeCheckoutResponse(raw))
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : 'Não foi possível iniciar o checkout. Tente novamente.'
      setError(msg)
    } finally {
      setBusyPlan(null)
    }
  }

  const runConfirmMock = async () => {
    if (!checkout?.paymentId) return
    setError(null)
    setConfirmBusy(true)
    try {
      await confirmMockPayment(checkout.paymentId)
      setCheckout(null)
      onPlanChanged()
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : 'Confirmação não disponível ou pagamento inválido.'
      setError(msg)
    } finally {
      setConfirmBusy(false)
    }
  }

  const handleCancelPaidPlan = async () => {
    if (!plan || plan.planType === 'FREE') return
    const ok = window.confirm(
      'Deseja cancelar o plano?\n\nVocê deixa de ser cobrado nas próximas renovações. O acesso aos recursos do plano pago permanece até o fim do período já contratado.',
    )
    if (!ok) return
    setError(null)
    setCancelBusy(true)
    try {
      await cancelBillingSubscription()
      setCheckout(null)
      onPlanChanged()
    } catch (e) {
      if (e instanceof HttpError && e.status === 409) {
        setError(e.message)
      } else {
        const fallback =
          `O cancelamento automático falhou ou o servidor ainda não expõe POST /api/billing/cancel. ` +
          `Envie um e-mail para ${TERMS_SUPPORT_EMAIL} com o assunto "Cancelamento de plano" e o e-mail da sua conta.`
        if (isBillingCancelEndpointMissing(e)) {
          setError(fallback)
        } else if (e instanceof HttpError) {
          setError(`${e.message} ${fallback}`)
        } else {
          setError(fallback)
        }
      }
    } finally {
      setCancelBusy(false)
    }
  }

  const currentLabel =
    plan?.planType === 'FREE'
      ? 'Free'
      : plan?.planType === 'BASIC'
        ? 'Básico'
        : plan?.planType === 'FULL'
          ? 'Full'
          : '—'

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-[#F4F5F7] px-4 py-10 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-3 text-sm font-semibold text-fuchsia-700 transition hover:underline"
            >
              ← Voltar ao quadro
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Planos e pagamento</h1>
            <p className="mt-1 text-sm text-gray-500">
              Escolha o plano e o período de cobrança que melhor se encaixa na sua equipe.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Plano atual
            </p>
            <p className="text-lg font-bold text-gray-900">
              {planLoading ? '…' : currentLabel}
            </p>
            {plan?.currentPeriodEnd ? (
              <p className="mt-1 text-xs text-gray-500">
                Renova em{' '}
                {new Date(plan.currentPeriodEnd).toLocaleDateString('pt-BR', { dateStyle: 'medium' })}
              </p>
            ) : plan?.planType !== 'FREE' ? (
              <p className="mt-1 text-xs text-gray-500">Assinatura ativa</p>
            ) : null}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-sm sm:inline-flex">
          <button
            type="button"
            onClick={() => setPeriod('MONTHLY')}
            className={[
              'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              period === 'MONTHLY'
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25'
                : 'text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setPeriod('YEARLY')}
            className={[
              'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              period === 'YEARLY'
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25'
                : 'text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            Anual
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(['BASIC', 'FULL'] as const).map((tier) => {
            const price = prices?.[tier]
            const title = tier === 'BASIC' ? 'Básico' : 'Full'
            const blurb =
              tier === 'BASIC'
                ? 'Projetos ilimitados, histórico de sprint e relatórios simples.'
                : 'Tudo do Básico, permissões avançadas, dashboards e suporte prioritário.'

            return (
              <div
                key={tier}
                className={[
                  'flex flex-col rounded-2xl border bg-white p-6 shadow-card',
                  tier === 'FULL'
                    ? 'border-fuchsia-200 ring-2 ring-fuchsia-100/80'
                    : 'border-gray-100',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{blurb}</p>
                  </div>
                  {tier === 'FULL' ? (
                    <span className="shrink-0 rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-[11px] font-semibold text-fuchsia-800 ring-1 ring-fuchsia-100">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-6 text-3xl font-bold tabular-nums text-gray-900">
                  {formatBRLFromCents(price)}
                  <span className="text-base font-medium text-gray-400">
                    /{period === 'MONTHLY' ? 'mês' : 'ano'}
                  </span>
                </p>
                <button
                  type="button"
                  disabled={
                    busyPlan !== null ||
                    plan?.planType === tier ||
                    (plan?.planType === 'FULL' && tier === 'BASIC')
                  }
                  onClick={() => void startCheckout(tier)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-fuchsia-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-95 disabled:opacity-50"
                >
                  {plan?.planType === 'FULL'
                    ? tier === 'FULL'
                      ? 'Plano ativo'
                      : 'Incluído no Full'
                    : plan?.planType === tier
                      ? 'Plano ativo'
                      : busyPlan === tier
                        ? 'Processando…'
                        : `Assinar ${title}`}
                </button>
              </div>
            )
          })}
        </div>

        {checkout ? (
          <div className="mt-8 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/60 via-white to-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-gray-900">Pagamento pendente</h3>
            <p className="mt-2 text-sm text-gray-600">
              Valor:{' '}
              <strong className="text-gray-900">
                {formatBRLFromCents(checkout.amountCents)} {checkout.currency}
              </strong>
              {' '}
              · Aguardando confirmação
            </p>
            <button
              type="button"
              disabled={confirmBusy}
              onClick={() => void runConfirmMock()}
              className="kf-btn mt-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-95 disabled:opacity-60"
            >
              {confirmBusy ? 'Confirmando…' : 'Confirmar pagamento'}
            </button>
          </div>
        ) : null}

        {!planLoading && plan && (plan.planType === 'BASIC' || plan.planType === 'FULL') ? (
          <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-gray-900">Gerenciar assinatura</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              O cancelamento interrompe novas cobranças. Você continua com os benefícios do plano até o fim do
              período já pago.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                disabled={cancelBusy}
                onClick={() => void handleCancelPaidPlan()}
                className="kf-btn rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
              >
                {cancelBusy ? 'Processando…' : 'Cancelar plano'}
              </button>
              <a
                className="text-center text-sm font-medium text-gray-500 transition hover:text-fuchsia-700 sm:text-left"
                href={`mailto:${TERMS_SUPPORT_EMAIL}?subject=${encodeURIComponent('Cancelamento de plano Kanflow')}`}
              >
                Precisa de ajuda? Fale com o suporte
              </a>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        ) : null}

      </div>
    </main>
  )
}
