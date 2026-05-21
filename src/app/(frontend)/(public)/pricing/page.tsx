import { siteConfig } from '@/siteConfig'
import type { Metadata } from 'next'
import PricingSection from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose a Sound Blog plan for turning voice recordings into AI-generated blog posts.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: `Pricing | ${siteConfig.name}`,
    description: 'Compare Sound Blog Free, Hobby, and Pro plans for AI voice-to-blog generation.',
    url: '/pricing',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} pricing` }],
  },
}

export default function PricingPage() {
  return (
    <main className='mx-auto mb-16 w-full max-w-7xl px-8 pt-30 max-lg:px-6 max-sm:px-4 max-sm:pt-8'>
      <PricingSection />
    </main>
  )
}
