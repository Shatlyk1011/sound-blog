import { Providers as PostHogProvider } from '@/app/_providers/post-hog'
import { siteConfig } from '@/siteConfig'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Lora, Geist } from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import { Analytics } from '../_providers/analytics'
import TanstackQueryProvider from '../_providers/tanstack-query'
import { UserProvider } from '../_providers/user-provider'
import './blog.css'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.tagline} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [siteConfig.author],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  generator: 'Next.js',
  category: 'technology',
  classification: 'AI writing software, voice transcription, content creation',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
    types: {
      'text/plain': [{ url: '/llms.txt', title: 'LLMs.txt' }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: `${siteConfig.tagline} | ${siteConfig.name}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI voice to blog generator`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.tagline} | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@shatlyk1011',
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'default',
  },
  verification: {
    google: siteConfig.googleSiteVerification || undefined,
  },
  other: {
    'geo.region': 'US;EU',
    'geo.placename': 'United States and Europe',
    audience: 'creators, founders, writers, marketers, students, teams',
    'target-region': siteConfig.targetRegions.join(', '),
    'target-language': siteConfig.targetLanguage,
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='scroll-smooth'>
      <body className={`${geist.variable} ${lora.variable} antialiased`}>
        <UserProvider>
          <PostHogProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              <TooltipProvider>
                <TanstackQueryProvider>
                  {children}
                  {modal}
                </TanstackQueryProvider>
              </TooltipProvider>
            </ThemeProvider>
          </PostHogProvider>
        </UserProvider>
        <CookieConsentBanner />
        <Analytics />
        <Toaster position='top-center' />
      </body>
    </html>
  )
}
