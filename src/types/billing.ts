export type PlanType = 'FREE' | 'BASIC' | 'FULL'

export type BillingPeriod = 'MONTHLY' | 'YEARLY'

export type PaidPlanType = 'BASIC' | 'FULL'

export type BillingPlanSnapshot = {
  planType: PlanType
  maxWorkspaces: number | null
  sprintHistoryEnabled: boolean
  showAds: boolean
  currentPeriodEnd: string | null
  pricesMonthlyCents: Partial<Record<PaidPlanType, number>>
  pricesYearlyCents: Partial<Record<PaidPlanType, number>>
}

export type CheckoutResponse = {
  paymentId: string
  amountCents: number
  currency: string
  status: string
  hint?: string
}
