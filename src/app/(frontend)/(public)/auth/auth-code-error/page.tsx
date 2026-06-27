import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'There was a problem completing authentication.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthCodeErrorPage() {
  return (
    <main className='flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8'>
      <div className='bg-background w-full max-w-lg rounded-[2rem] border px-6 py-10 text-center shadow-md sm:px-10'>
        <p className='text-sm font-medium tracking-[0.2em] text-red-500 uppercase max-md:text-xs'>
          Authentication failed
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-tight max-md:text-2xl max-md:text-balance'>
          Could not complete sign in
        </h1>
        <p className='text-foreground/70 mt-4 text-sm leading-6 sm:text-base'>
          The sign-in link expired, was already used, or the callback could not be completed. Try signing in again.
        </p>
        <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Link
            href='/sign-in'
            className='bg-foreground text-background inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-opacity hover:opacity-90'
          >
            Back to sign in
          </Link>
          <Link
            href='/'
            className='hover:bg-muted inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors'
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
