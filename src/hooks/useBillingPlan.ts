import { useCallback, useEffect, useState } from 'react'
import { getBillingPlan, getStoredToken, isApiConfigured, normalizeBillingPlan } from '../api'
import type { BillingPlanSnapshot } from '../types/billing'

export function useBillingPlan() {
  const [plan, setPlan] = useState<BillingPlanSnapshot | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isApiConfigured() || !getStoredToken()) {
      setPlan(null)
      return
    }
    setLoading(true)
    try {
      const raw = await getBillingPlan()
      setPlan(normalizeBillingPlan(raw))
    } catch {
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { plan, loading, refresh }
}
