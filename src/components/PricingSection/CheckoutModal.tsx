'use client'

import { useCallback, useEffect, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { PlanId } from '@/lib/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutModalProps {
  planId: PlanId
  planName: string
  onClose: () => void
}

export function CheckoutModal({ planId, planName, onClose }: CheckoutModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error ?? 'Failed to create checkout session')
    }

    const { clientSecret } = await res.json()
    return clientSecret as string
  }, [planId])

  const options = { fetchClientSecret }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-label={`Checkout for ${planName}`}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300'
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Modal panel */}
      <div
        className='bg-background ring-border relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-2xl ring-1 transition-all duration-300'
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        }}
      >
        {/* Header */}
        <div className='border-border flex items-center justify-between border-b px-6 pt-5 pb-4'>
          <div>
            <p className='text-muted-foreground mb-0.5 text-xs font-medium tracking-widest uppercase'>Subscribe</p>
            <h2 className='text-foreground text-lg font-semibold'>{planName}</h2>
          </div>
          <button
            id='checkout-modal-close'
            onClick={handleClose}
            aria-label='Close checkout'
            className='bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors'
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className='p-4'>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
