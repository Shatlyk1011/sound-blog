'use client'

import { useState } from 'react'
import { CheckmarkCircle01Icon, LegalHammerIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import type { PlanId } from '@/lib/stripe'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { CheckoutModal } from './CheckoutModal'

export interface PricingTier {
  name: 'Hobby' | 'Pro' | 'Free'
  description: string
  /** Monthly price (display string, e.g. "10") */
  price: string
  /** Yearly price (display string, e.g. "100") */
  priceYearly: string
  priceDetail?: string
  ctaText: string
  ctaVariant: 'blue' | 'black'
  featuresIntro?: string
  features: string[]
  /** Stripe planId for the monthly billing cycle */
  monthlyPlanId?: PlanId
  /** Stripe planId for the annual billing cycle */
  yearlyPlanId?: PlanId
}

interface PricingCardProps {
  item: PricingTier
  isAnnual: boolean
  isAuth: boolean
  classes?: string
}

const getPricingLabel = (s: string) => {
  return s.toLowerCase() === 'custom' ? s : `$${s}`
}

export function PricingCard({ item, isAnnual, isAuth, classes }: PricingCardProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Determine which Stripe planId to use based on billing cycle
  const activePlanId: PlanId | undefined = isAnnual ? item.yearlyPlanId : item.monthlyPlanId

  // Label shown in modal header
  const activePlanName = `${item.name} ${isAnnual ? '(Yearly)' : '(Monthly)'}`

  const handleSubscribe = () => {
    if (!activePlanId) return
    setCheckoutOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          'border-border bg-background relative flex w-full max-w-sm flex-col overflow-hidden rounded-4xl border p-7 shadow-sm transition-shadow hover:shadow-md',
          classes
        )}
      >
        <div className='mb-4 min-h-18'>
          <h3 className='text-foreground text-2xl font-semibold'>{item.name}</h3>
          <p className='text-foreground/70 mt-2 line-clamp-2 text-base'>{item.description}</p>
        </div>

        <div className='mb-6'>
          <div className='flex items-center'>
            <span className='-tracking-two font-mono text-3xl leading-8 font-medium'>
              {isAnnual ? getPricingLabel(item.priceYearly) : getPricingLabel(item.price)}
            </span>

            {item.priceDetail && (
              <span className='text-muted-foreground ml-2 max-w-20 text-xs leading-tight'>
                {isAnnual && (
                  <span>
                    billed annually <br />
                  </span>
                )}
                {item.priceDetail}
              </span>
            )}
          </div>
        </div>

        {item.name !== 'Free' ? (
          <Button
            id={`subscribe-${item.name.toLowerCase()}-${isAnnual ? 'yearly' : 'monthly'}`}
            onClick={handleSubscribe}
            disabled={!activePlanId}
            className={cn(
              'border-secondary w-full border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
            )}
          >
            {item.ctaText}
          </Button>
        ) : (
          <Button
            className={cn(
              'w-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
            )}
            asChild
          >
            <Link href='/sign-in'>{item.ctaText}</Link>
          </Button>
        )}

        <div className='mt-8 flex flex-1 flex-col'>
          <p className='text-foreground/80 mb-4 text-sm font-medium'>{item.featuresIntro}</p>
          <ul className='space-y-3'>
            {item.features.map((feature) => (
              <li key={feature} className='flex items-start gap-2'>
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className='text-muted-foreground h-4 w-4'
                  aria-hidden='true'
                />
                <span className='text-foreground/70 text-sm'>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stripe Embedded Checkout Modal */}
      {checkoutOpen && activePlanId && (
        <CheckoutModal planId={activePlanId} planName={activePlanName} onClose={() => setCheckoutOpen(false)} />
      )}
    </>
  )
}
