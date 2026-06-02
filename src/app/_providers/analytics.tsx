'use client'

import Script from 'next/script'
import { usePersonalDataConsent } from '@/hooks/use-personal-data-consent'

export function Analytics() {
  const consent = usePersonalDataConsent()

  if (consent !== 'accepted' || !process.env.NEXT_PUBLIC_GA_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        id='google-tagmanager'
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
