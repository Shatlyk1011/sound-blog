// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import { siteConfig } from '@/siteConfig'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Poppins, Lora } from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import TanstackQueryProvider from '../_providers/tanstack-query'
import { UserProvider } from '../_providers/user-provider'
import './blog.css'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  robots: 'index follow',
  authors: [{ name: 'Shatlyk Abdullayev', url: 'https://shatlykabdullayev.com' }],
  creator: 'Shatlyk Abdullayev',
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },

  alternates: {
    types: {
      'application/rss+xml': [{ url: `${siteConfig.siteUrl}/rss.xml`, title: 'RSS Feed - English' }],
    },
  },
  icons: {
    icon: [{ url: '/icon.png' }],
    apple: [{ url: '/android-chrome-192x192.png', sizes: '192x192' }],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.variable} ${lora.variable} antialiased`}>
        <UserProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <TooltipProvider>
              <TanstackQueryProvider>
                {children}
                {modal}
              </TanstackQueryProvider>
            </TooltipProvider>
          </ThemeProvider>
        </UserProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  )
}
