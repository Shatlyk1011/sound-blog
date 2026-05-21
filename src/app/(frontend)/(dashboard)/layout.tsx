import { Metadata } from 'next'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | Sound Blog',
    default: 'Dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
}
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-sidebar flex h-svh overflow-hidden pt-14'>
      <DashboardSidebar>{children}</DashboardSidebar>
    </div>
  )
}
