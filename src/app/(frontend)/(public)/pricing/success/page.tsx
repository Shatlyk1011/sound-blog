import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscription Confirmed | Sound Blog',
  description: 'Your subscription has been confirmed. Welcome to Sound Blog!',
}

export default function PricingSuccessPage() {
  return (
    <main className='mx-auto mb-16 flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-6 px-8 pt-30 text-center max-sm:px-4 max-sm:pt-16'>
      {/* Animated checkmark */}
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30'>
        <svg
          className='h-10 w-10 text-emerald-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
      </div>

      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight max-sm:text-2xl'>You&apos;re all set! 🎉</h1>
        <p className='text-muted-foreground mx-auto max-w-md text-base'>
          Your subscription is now active. A receipt has been sent to your email. Start creating amazing voice blogs
          right away.
        </p>
      </div>

      <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
        <Link
          id='success-go-to-dashboard'
          href='/dashboard'
          className='bg-foreground text-background inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-opacity hover:opacity-90'
        >
          Go to Dashboard
        </Link>
        <Link
          id='success-go-to-pricing'
          href='/pricing'
          className='border-border hover:bg-muted inline-flex h-10 items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors'
        >
          Back to Pricing
        </Link>
      </div>
    </main>
  )
}
