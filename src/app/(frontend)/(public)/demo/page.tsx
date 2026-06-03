import { DEMO_SOUND_RECORD } from '@/data'
import type { Blog } from '@/payload-types'
import { siteConfig } from '@/siteConfig'
import type { Metadata } from 'next'
import RecordPreview from '@/components/RecordPreview'

export const metadata: Metadata = {
  title: 'Demo',
  description: 'Preview how a voice note turns into a structured Sound Blog article.',
  alternates: {
    canonical: '/demo',
  },
  openGraph: {
    title: `Demo | ${siteConfig.name}`,
    description: 'Preview how a voice note turns into a structured Sound Blog article.',
    url: '/demo',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} demo preview` }],
  },
}

export default function DemoPage() {
  return (
    <main className='bg-background mt-14 min-h-screen px-6 py-8 max-sm:px-3 max-sm:py-4'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
        <div className='space-y-3 pt-4'>
          <span className='border-border bg-background/80 text-muted-foreground inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase shadow-sm backdrop-blur'>
            demo article
          </span>
        </div>

        <RecordPreview blog={DEMO_SOUND_RECORD as Blog} backHref='/' backLabel='Back to home' badge='Demo article' />
      </div>
    </main>
  )
}
