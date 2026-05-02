'use client'

import { ReactNode } from 'react'
import { UserDataResponse } from '@/app/api/user-data/route'
import { useUserCreditsQuery } from '@/services/user-credits'
import { Home01Icon, UserCircleIcon, MessageMultiple01Icon, Crown03Icon, Coins01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import Header from './header'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home01Icon },
  { href: '/profile', label: 'Profile', icon: UserCircleIcon },
]

interface Props {
  children: ReactNode
}

export function DashboardSidebar({ children }: Props) {
  const pathname = usePathname()

  const { user: SBUser } = useUser()

  const { data: userData } = useUserCreditsQuery(SBUser?.id)

  const remainingCredits = userData ? userData.totalCredits - (userData?.creditsSpent || 0) : undefined

  return (
    <>
      <Header isDashboardPage />
      <aside className='border-sidebar-border bg-sidebar fixed top-14 left-0 z-40 flex h-[calc(100vh-56px)] w-60 flex-col'>
        {/* Nav */}
        <nav className='flex-1 overflow-y-auto px-3 py-4'>
          <span className='text-muted-foreground/70 mb-2 inline-block px-2 text-xs font-semibold tracking-widest uppercase'>
            Menu
          </span>
          <ul className='space-y-0.5'>
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                    )}
                  >
                    <HugeiconsIcon
                      icon={icon}
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                      )}
                    />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <Separator className='my-3' />

          <UserInfo
            name={SBUser?.user_metadata?.full_name || 'No name'}
            currentPlan={userData?.currentPlan}
            credits={remainingCredits}
          />
        </nav>

        {/* Feedback button at bottom */}
        <div className='border-sidebar-border border-t p-3'>
          <Button
            variant='ghost'
            className='text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground w-full justify-start gap-2.5 text-sm font-medium'
          >
            <HugeiconsIcon icon={MessageMultiple01Icon} className='text-muted-foreground size-4 shrink-0' />
            Feedback
          </Button>
        </div>
      </aside>
      {children}
    </>
  )
}

interface UserProps {
  name?: string
  currentPlan?: UserDataResponse['currentPlan']
  credits?: UserDataResponse['totalCredits']
}

const UserInfo = ({ name, currentPlan, credits }: UserProps) => {
  return (
    <div className='space-y-4 px-2'>
      {/* User Avatar */}
      <div className='flex items-center gap-3'>
        <p className='text-sidebar-foreground text-base font-semibold'>{name}&apos;s workspace</p>
      </div>

      {/* Plan Info */}
      <div className='space-y-2 text-sm capitalize'>
        <div className='border-border flex items-center justify-between border-b py-1'>
          <span className='text-sidebar-foreground/60'>Current Plan:</span>
          {currentPlan ? (
            <span className='text-sidebar-primary font-semibold'>{currentPlan}</span>
          ) : (
            <Skeleton className='h-5 w-16' />
          )}
        </div>

        <div className='border-border flex items-center justify-between border-b py-1'>
          <span className='text-sidebar-foreground/60'>Credits:</span>
          {credits ? (
            <div className='text-sidebar-primary flex items-center gap-1'>
              <span className='font-semibold'>{credits}</span>
              <span className='text-xs'>(~{Math.round(credits / 60)} min)</span>
            </div>
          ) : (
            <Skeleton className='h-5 w-20' />
          )}
        </div>

        <p className='text-sidebar-foreground/80 text-xs italic'>Note: 1 credit = 1 second</p>
      </div>

      {/* Upgrade Button */}
      <Button size='lg' asChild className='from-chart-2 to-chart-1 w-full bg-linear-to-l'>
        <Link href='/pricing' prefetch={false}>
          <HugeiconsIcon icon={Crown03Icon} className='size-5' />
          Upgrade
        </Link>
      </Button>
    </div>
  )
}
