import { siteConfig } from '@/siteConfig'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing'],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/record/',
          '/sign-in',
          '/sign-up',
          '/pricing/success',
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  }
}
