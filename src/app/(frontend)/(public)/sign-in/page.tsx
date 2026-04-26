import { Suspense } from 'react'
import type { Metadata } from 'next'
import SignInPage from '@/components/auth/SignInPage'

export const metadata: Metadata = {
  title: 'Sign In | Sound Blog',
  description: 'Sign in to your Sound Blog account',
}

export default function SignIn() {
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  )
}
