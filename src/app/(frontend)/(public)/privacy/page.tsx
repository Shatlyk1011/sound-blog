import { siteConfig } from '@/siteConfig'
import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}. Learn what information we collect, how we use it, and how to contact us.`,
  alternates: {
    canonical: siteConfig.links.privacy,
  },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description: `Privacy Policy for ${siteConfig.name}.`,
    url: siteConfig.links.privacy,
  },
}

const lastUpdated = 'June 3, 2026'

export default function PrivacyPage() {
  return (
    <main className='bg-background mt-14 min-h-screen'>
      <section className='mx-auto w-full max-w-4xl px-4 py-16 sm:px-8 lg:py-20'>
        <div className='border-border bg-card/80 rounded-4xl border p-6 shadow-sm backdrop-blur sm:p-10'>
          <p className='text-muted-foreground text-sm font-medium'>Last updated: {lastUpdated}</p>
          <h1 className='mt-3 text-4xl leading-tight font-bold tracking-tight sm:text-5xl'>Privacy Policy</h1>
          <p className='text-muted-foreground mt-5 text-base leading-7'>
            This Privacy Policy explains how {siteConfig.name} collects, uses, and protects information when you use our
            website and application.
          </p>

          <div className='prose mt-10 max-w-none'>
            <h2>Information we collect</h2>
            <p>
              We collect account information such as your email address and authentication provider details when you
              sign in with Google, GitHub, or email. If you upload audio, we process the recording, generated
              transcript, generated blog content, selected generation filters, and related usage metadata required to
              provide the service.
            </p>

            <h2>How we use information</h2>
            <p>
              We use your information to authenticate your account, generate blog drafts from voice recordings, manage
              credits and billing-related records, provide text-to-speech functionality, improve reliability, prevent
              abuse, and respond to support or feedback requests.
            </p>

            <h2>Google sign-in data</h2>
            <p>
              When you choose Google sign-in, we use Google-provided account information only to create and access your
              {siteConfig.name} account. We do not sell Google user data.
            </p>

            <h2>Storage and processors</h2>
            <p>
              We use third-party service providers to operate the product, including authentication, database, file
              storage, analytics, payment, and AI processing providers. These providers process information only as
              needed to deliver their services to us.
            </p>

            <h2>Audio recordings and generated content</h2>
            <p>
              Audio files, transcripts, generated drafts, and generated speech files may be stored so you can access,
              edit, retry, play back, or delete your records from the application. Deleting a voice record removes the
              associated stored audio and related generated content according to the product deletion flow.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              We may use cookies or similar technologies for authentication, preferences, analytics, and product
              performance. Analytics help us understand usage patterns and improve the application.
            </p>

            <h2>Your choices</h2>
            <p>
              You can stop using the service at any time. You may request access, correction, export, or deletion of
              your personal information by contacting us at the email below. We may retain limited information when
              required for security, fraud prevention, legal compliance, or legitimate business records.
            </p>

            <h2>Children</h2>
            <p>
              {siteConfig.name} is not intended for children under 13, and we do not knowingly collect personal
              information from children under 13.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we will update the
              “Last updated” date on this page.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{' '}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
            </p>
          </div>

          <div className='border-border mt-10 border-t pt-6'>
            <Link href='/' className='text-primary text-sm font-semibold hover:underline'>
              Back to home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
