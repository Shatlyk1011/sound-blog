'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Switch } from '@/components/ui/switch'
import { PricingCard, PricingTier } from './PricingCard'

const pricingPlans: PricingTier[] = [
  {
    name: 'Free',
    price: '0',
    priceYearly: '0',
    description: 'Perfect to get started',
    features: ['500 credits (each month)', 'Private generations', 'Customer Support'],
    ctaText: 'Try for free',
    ctaVariant: 'blue',
    featuresIntro: 'Features include:',
    priceDetail: '/ month',
  },
  {
    name: 'Hobby',
    price: '10',
    priceYearly: '100',
    description: 'Perfect for individuals',
    features: [
      '10000 monthly credits (~165min)',
      'Private generations',
      'Credits valid for 2 months',
      'Customer Support',
    ],
    ctaText: 'Upgrade to Hobby',
    ctaVariant: 'blue',
    featuresIntro: 'Everything in Free, plus:',
    priceDetail: '/ month',
    monthlyPlanId: 'hobby_monthly',
    yearlyPlanId: 'hobby_yearly',
  },
  {
    name: 'Pro',
    price: '30',
    priceYearly: '300',
    description: 'With generous limits',
    features: [
      '50000 monthly credits (~830min)',
      'Private generations',
      'Credits valid for 2 months',
      'Customer Support',
    ],
    ctaText: 'Upgrade to Pro',
    ctaVariant: 'blue',
    featuresIntro: 'Everything in Hobby, plus:',
    priceDetail: '/ month',
    monthlyPlanId: 'pro_monthly',
    yearlyPlanId: 'pro_yearly',
  },
]

const PricingSection = () => {
  const [isAnnual, setAnnual] = useState(false)

  const { user } = useUser()

  const isAuth = !!user

  return (
    <>
      <section className='mb-8 text-center'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight max-sm:text-3xl'>Simple, Transparent Pricing</h1>
        <p className='text-muted-foreground mx-auto max-w-2xl text-lg max-sm:text-base'>
          Choose the right plan for your audio generation needs
        </p>
      </section>
      <div className='mb-8 flex items-center justify-center gap-1.5 text-sm font-normal'>
        <span className={cn('transition-colors', isAnnual && 'text-muted-foreground')}>Monthly</span>
        <Switch checked={isAnnual} onCheckedChange={(checked) => setAnnual(checked)} />
        <p className='relative'>
          <span className={cn('transition-colors', !isAnnual && 'text-muted-foreground')}>Annual</span>
          <span className='tracking-one bg-secondary text-secondary-foreground absolute top-1/2 -right-[15%] flex w-max -translate-y-1/2 items-center rounded-full border px-1.5 py-0.5 text-xs text-[10px] font-medium text-nowrap'>
            Save 15%
          </span>
        </p>
      </div>

      <section className='mx-auto grid h-full max-w-max grid-cols-3 justify-center gap-3 px-10 max-lg:px-0 max-md:grid-cols-2 max-sm:grid-cols-1'>
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} item={plan} isAnnual={isAnnual} isAuth={isAuth} />
        ))}
      </section>
    </>
  )
}
export default PricingSection
