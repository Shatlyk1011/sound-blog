import { siteConfig } from '@/siteConfig'

const appFeatures = [
  'Record or upload audio notes',
  'Generate publish-ready blog drafts',
  'Choose tone, length, structure, and enhancements',
  'Edit generated Markdown content',
  'Create text-to-speech audio from blog posts',
]

const faqItems = [
  {
    question: 'What is Sound Blog?',
    answer:
      'Sound Blog is an AI writing app that turns voice recordings into structured, editable, publish-ready blog posts.',
  },
  {
    question: 'Who is Sound Blog for?',
    answer:
      'Sound Blog is built for creators, founders, writers, marketers, students, and teams in the USA and Europe who capture ideas by speaking and want to turn them into written content faster.',
  },
  {
    question: 'Can Sound Blog transcribe audio?',
    answer:
      'Yes. Sound Blog processes uploaded or recorded audio, creates a transcript, and uses it to generate a polished article draft.',
  },
  {
    question: 'Can I control the generated article style?',
    answer:
      'Yes. You can select filters such as tone, length, structure, and enhancements before generating the final blog draft.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/android-chrome-512x512.png`,
    sameAs: [siteConfig.githubRepo, siteConfig.linkedin, siteConfig.author.url],
    areaServed: siteConfig.targetRegions,
    founder: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.siteUrl}/#website`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    audience: {
      '@type': 'Audience',
      audienceType: 'Creators, founders, writers, marketers, students, and teams',
      geographicArea: siteConfig.targetRegions.map((region) => ({
        '@type': 'AdministrativeArea',
        name: region,
      })),
    },
    publisher: {
      '@id': `${siteConfig.siteUrl}/#organization`,
    },
    inLanguage: 'en',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteConfig.siteUrl}/#software`,
    name: siteConfig.productName,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteConfig.siteUrl,
    image: siteConfig.ogImage,
    description: siteConfig.description,
    availableLanguage: 'en',
    areaServed: siteConfig.targetRegions,
    featureList: appFeatures,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '30',
      priceCurrency: 'USD',
      offerCount: '3',
      url: `${siteConfig.siteUrl}/pricing`,
    },
    creator: {
      '@id': `${siteConfig.siteUrl}/#organization`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteConfig.siteUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
]

export default function JsonLd() {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
