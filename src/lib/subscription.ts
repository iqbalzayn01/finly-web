import { useState, useEffect } from 'react'

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise'

const SUBSCRIPTION_STORAGE_KEY = 'finly_user_plan'
const SUBSCRIPTION_EVENT = 'finly_subscription_change'

export function getStoredPlan(): SubscriptionPlan {
  if (typeof window === 'undefined') return 'starter'
  try {
    const plan = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) as SubscriptionPlan
    return plan === 'pro' || plan === 'enterprise' ? plan : 'starter'
  } catch {
    return 'starter'
  }
}

export function setStoredPlan(plan: SubscriptionPlan) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, plan)
    window.dispatchEvent(new CustomEvent(SUBSCRIPTION_EVENT, { detail: plan }))
  } catch (err) {
    console.error('Failed to update subscription in localStorage:', err)
  }
}

export function useSubscription() {
  const [plan, setPlan] = useState<SubscriptionPlan>(() => getStoredPlan())

  useEffect(() => {
    const handlePlanChange = (event: Event) => {
      const customEvent = event as CustomEvent<SubscriptionPlan>
      if (customEvent.detail) {
        setPlan(customEvent.detail)
      } else {
        setPlan(getStoredPlan())
      }
    }

    window.addEventListener(SUBSCRIPTION_EVENT, handlePlanChange)
    window.addEventListener('storage', handlePlanChange)

    return () => {
      window.removeEventListener(SUBSCRIPTION_EVENT, handlePlanChange)
      window.removeEventListener('storage', handlePlanChange)
    }
  }, [])

  const upgradeToPro = () => setStoredPlan('pro')
  const downgradeToStarter = () => setStoredPlan('starter')

  return {
    plan,
    isPro: plan === 'pro' || plan === 'enterprise',
    setPlan: setStoredPlan,
    upgradeToPro,
    downgradeToStarter,
  }
}
