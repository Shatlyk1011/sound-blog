'use client'

import { setPersonalDataConsent, type PersonalDataConsent } from '@/lib/privacy-consent'
import { usePersonalDataConsent } from '@/hooks/use-personal-data-consent'
import { Button } from '@/components/ui/button'

export function CookieConsentBanner() {
  const consent = usePersonalDataConsent()

  function confirmPreference(preference: PersonalDataConsent) {
    setPersonalDataConsent(preference)
  }

  if (consent !== 'pending') return null

  return (
    <div className='fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6'>
      <div className='border-border bg-card/95 text-card-foreground supports-[backdrop-filter]:bg-card/85 mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5'>
        <div className='space-y-1'>
          <p className='font-serif text-lg font-semibold'>Personal data preferences</p>
          <p className='text-muted-foreground max-w-2xl text-sm leading-6'>
            We use cookies and analytics tools to collect personal data about site usage so we can improve Sound Blog.
            Please choose whether you allow this collection.
          </p>
        </div>
        <div className='flex shrink-0 gap-2'>
          <Button variant='outline' onClick={() => confirmPreference('declined')}>
            Decline
          </Button>
          <Button onClick={() => confirmPreference('accepted')}>Allow</Button>
        </div>
      </div>
    </div>
  )
}
