import { Suspense } from 'react'
import type { Metadata } from 'next'
import SignUpPage from '@/components/auth/SignUpPage'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a Sound Blog account and start turning voice recordings into blog posts.',
  robots: {
    index: false,
    follow: false,
  },
}
export default function SignUp() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  )
}
