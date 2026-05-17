import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

export type PlanId = 'hobby_monthly' | 'pro_monthly' | 'hobby_yearly' | 'pro_yearly'

export interface StripePlan {
  id: PlanId
  name: string
  amount: number // in dollars
  interval: 'month' | 'year'
  priceEnvKey: string
}

export const STRIPE_PLANS: StripePlan[] = [
  {
    id: 'hobby_monthly',
    name: 'Hobby (Monthly)',
    amount: 10,
    interval: 'month',
    priceEnvKey: 'STRIPE_PRICE_HOBBY_MONTHLY',
  },
  {
    id: 'pro_monthly',
    name: 'Pro (Monthly)',
    amount: 30,
    interval: 'month',
    priceEnvKey: 'STRIPE_PRICE_PRO_MONTHLY',
  },
  {
    id: 'hobby_yearly',
    name: 'Hobby (Yearly)',
    amount: 100,
    interval: 'year',
    priceEnvKey: 'STRIPE_PRICE_HOBBY_YEARLY',
  },
  {
    id: 'pro_yearly',
    name: 'Pro (Yearly)',
    amount: 300,
    interval: 'year',
    priceEnvKey: 'STRIPE_PRICE_PRO_YEARLY',
  },
]

export function getPriceId(planId: PlanId): string {
  const plan = STRIPE_PLANS.find((p) => p.id === planId)
  if (!plan) throw new Error(`Unknown plan: ${planId}`)
  const priceId = process.env[plan.priceEnvKey]
  if (!priceId) throw new Error(`Missing env var: ${plan.priceEnvKey}`)
  return priceId
}
