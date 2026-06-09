import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

export type PlanId = 'hobby_monthly' | 'pro_monthly' | 'hobby_yearly' | 'pro_yearly'

const STRIPE_PLANS: Record<PlanId, string> = {
  hobby_monthly: 'STRIPE_PRICE_HOBBY_MONTHLY',
  pro_monthly: 'STRIPE_PRICE_PRO_MONTHLY',
  hobby_yearly: 'STRIPE_PRICE_HOBBY_YEARLY',
  pro_yearly: 'STRIPE_PRICE_PRO_YEARLY',
}

export function getPriceId(planId: PlanId): string {
  const priceEnvKey = STRIPE_PLANS[planId]
  if (!priceEnvKey) throw new Error(`Unknown plan: ${planId}`)
  const priceId = process.env[priceEnvKey]
  if (!priceId) throw new Error(`Missing env var: ${priceEnvKey}`)
  return priceId
}
