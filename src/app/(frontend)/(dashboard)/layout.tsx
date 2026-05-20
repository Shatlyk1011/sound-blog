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
    <div className='bg-sidebar flex h-svh overflow-hidden pt-14'>
      <DashboardSidebar>
        <main className='ml-72 h-[calc(100svh-3.5rem)] flex-1 overflow-hidden'>
          <div className='border-sidebar-border bg-background h-full overflow-hidden rounded-l-4xl border'>
            <div className='h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable]'>{children}</div>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  )
}
