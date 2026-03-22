import { Suspense } from 'react'
import type { Metadata } from 'next'
import SignUpPage from '@/components/auth/SignUpPage'

export const metadata: Metadata = {
  title: 'Sign Up | Sound Blog',
  description: 'Create your Sound Blog account',
}

export default function SignUp() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  )
}
