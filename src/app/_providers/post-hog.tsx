'use client'

import { useEffect } from 'react'
import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePersonalDataConsent } from '@/hooks/use-personal-data-consent'

let isPostHogInitialized = false

function initPostHog() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NODE_ENV !== 'production' || isPostHogInitialized) {
    return
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
  })
  isPostHogInitialized = true
}

export function Providers({ children }: { children: React.ReactNode }) {
  const consent = usePersonalDataConsent()

  useEffect(() => {
    if (consent === 'accepted') {
      initPostHog()
    }
  }, [consent])

  if (consent !== 'accepted') {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
