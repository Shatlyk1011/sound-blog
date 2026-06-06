import { siteConfig } from '@/siteConfig'
import type { Metadata } from 'next'
import DemoSection from '@/components/DemoSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import JsonLd from '@/components/SEO/JsonLd'

export const metadata: Metadata = {
  title: siteConfig.tagline,
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.tagline} | ${siteConfig.name}`,
    description: siteConfig.description,
    url: '/',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: {
    title: `${siteConfig.tagline} | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function Home() {
  return (
    <>
      <main className='bg-background mt-14 flex min-h-screen flex-col items-center justify-start pb-8'>
        <JsonLd />
        <Hero />
        <DemoSection />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
