import { Metadata } from 'next'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

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
    <main className='flex min-h-svh'>
      <DashboardSidebar>
        <div className='ml-60 flex-1'>
          {children}
        </div>
      </DashboardSidebar>

    </main>
  )
}

