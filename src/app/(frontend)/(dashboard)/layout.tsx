import { Metadata } from 'next'
import Header from '@/components/layout/header'

export const metadata: Metadata = {
  title: {
    template: '%s | Sound Blog',
    default: 'Sound Blog',
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-svh flex-col'>
      {children}
    </div>
  )
}
