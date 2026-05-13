import { apiFetch } from './client'
import type { BillingPeriod, BillingPlanSnapshot, CheckoutResponse, PaidPlanType, PlanType } from '../types/billing'

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== 'object') return null
  return v as Record<string, unknown>
}

function readPriceMap(raw: unknown): Partial<Record<PaidPlanType, number>> {
  const out: Partial<Record<PaidPlanType, number>> = {}
  const o = asRecord(raw)
  if (!o) return out
  for (const k of ['BASIC', 'FULL'] as const) {
    const v = o[k]
    if (typeof v === 'number' && !Number.isNaN(v)) out[k] = v
  }
  return out
}

export function normalizeBillingPlan(raw: unknown): BillingPlanSnapshot {
  const o = asRecord(raw) ?? {}
  const pt = String(o.planType ?? 'FREE').toUpperCase()
  const planType: PlanType =
    pt === 'BASIC' || pt === 'FULL' || pt === 'FREE' ? (pt as PlanType) : 'FREE'

  const maxWs = o.maxWorkspaces
  const maxWorkspaces =
    maxWs === null || maxWs === undefined
      ? planType === 'FREE'
        ? 1
        : null
      : typeof maxWs === 'number'
        ? maxWs
        : null

  return {
    planType,
    maxWorkspaces,
    sprintHistoryEnabled:
      typeof o.sprintHistoryEnabled === 'boolean' ? o.sprintHistoryEnabled : planType !== 'FREE',
    showAds: typeof o.showAds === 'boolean' ? o.showAds : planType === 'FREE',
    currentPeriodEnd:
      typeof o.currentPeriodEnd === 'string'
        ? o.currentPeriodEnd
        : null,
    pricesMonthlyCents: readPriceMap(o.pricesMonthlyCents),
    pricesYearlyCents: readPriceMap(o.pricesYearlyCents),
  }
}

export async function getBillingPlan() {
  return apiFetch<unknown>('/billing/plan', { method: 'GET' })
}

export async function billingCheckout(body: { planType: PaidPlanType; billingPeriod: BillingPeriod }) {
  return apiFetch<unknown>('/billing/checkout', { method: 'POST', json: body })
}

export function normalizeCheckoutResponse(raw: unknown): CheckoutResponse {
  const o = asRecord(raw) ?? {}
  return {
    paymentId: String(o.paymentId ?? o.id ?? ''),
    amountCents: typeof o.amountCents === 'number' ? o.amountCents : 0,
    currency: String(o.currency ?? 'BRL'),
    status: String(o.status ?? 'PENDING'),
    hint: typeof o.hint === 'string' ? o.hint : undefined,
  }
}

export async function confirmMockPayment(paymentId: string) {
  return apiFetch<unknown>(
    `/billing/payments/${encodeURIComponent(paymentId)}/confirm-mock`,
    { method: 'POST' },
  )
}

export async function cancelBillingSubscription() {
  return apiFetch<unknown>('/billing/cancel', { method: 'POST', json: {} })
}
