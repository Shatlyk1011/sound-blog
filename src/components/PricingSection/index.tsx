'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { PricingCard, PricingTier } from './PricingCard'

const pricingPlans: PricingTier[] = [
  {
    name: 'Free',
    price: '0',
    priceYearly: '0',
    description: 'Free tier',
    features: ['1000 credits (~17min)', 'Private generations', 'Customer Support'],
    ctaText: 'Try for free',
    ctaVariant: 'blue',
    featuresIntro: 'Everything in Free, plus:',
    priceDetail: 'per seat/mo',
    monthlyPlanId: 'hobby_monthly',
    yearlyPlanId: 'hobby_yearly',
  },
  {
    name: 'Hobby',
    price: '10',
    priceYearly: '100',
    description: 'Perfect for individuals and small blogs',
    features: ['10000 monthly credits (~165min)', 'Private generations', 'Customer Support'],
    ctaText: 'Upgrade to Hobby',
    ctaVariant: 'blue',
    featuresIntro: 'Everything in Free, plus:',
    priceDetail: 'per seat/mo',
    monthlyPlanId: 'hobby_monthly',
    yearlyPlanId: 'hobby_yearly',
  },
  {
    name: 'Pro',
    price: '30',
    priceYearly: '300',
    description: 'Ideal individuals and big blogs',
    features: ['35000 monthly credits (~580min)', 'Private generations', 'Customer Support'],
    ctaText: 'Upgrade to Pro',
    ctaVariant: 'blue',
    featuresIntro: 'Everything in Hobby, plus:',
    priceDetail: 'per seat/mo',
    monthlyPlanId: 'pro_monthly',
    yearlyPlanId: 'pro_yearly',
  },
]

const PricingSection = () => {
  const [isAnnual, setAnnual] = useState(true)

  return (
    <>
      <section className='mb-8 text-center'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight max-sm:text-3xl'>Simple, Transparent Pricing</h1>
        <p className='text-muted-foreground mx-auto max-w-2xl text-lg max-sm:text-base'>
          Deliver new products faster with Emerald UI
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
          <PricingCard key={plan.name} item={plan} isAnnual={isAnnual} isAuth={true} />
        ))}
      </section>
    </>
  )
}
export default PricingSection
