'use client'

import { ReactNode } from 'react'
import { useUserCreditsQuery } from '@/services/user-credits'
import {
  Home01Icon,
  UserCircleIcon,
  MessageMultiple01Icon,
  Crown03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Separator } from '../ui/separator'
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

  const { data: userData, isLoading, isError } = useUserCreditsQuery(SBUser?.id)

  return (
    <>
      <Header isDashboardPage />
      <aside className='border-sidebar-border bg-sidebar fixed top-14 left-0 z-40 flex h-[calc(100vh-56px)] w-60 flex-col border-r'>
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
                        isActive
                          ? 'text-sidebar-primary'
                          : 'text-muted-foreground group-hover:text-sidebar-foreground'
                      )}
                    />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <Separator className='my-3' />

          <div className='mt-6 space-y-2 px-2 text-xs'>
            <p className='text-base font-medium'>
              {SBUser?.user_metadata?.full_name || 'No name'}&apos;s workspace
            </p>
            <Button asChild className='w-full'>
              <Link href='/pricing'>
                <HugeiconsIcon icon={Crown03Icon} />
                Upgrade
              </Link>
            </Button>
            <div className='gap- tracking-one text-muted-foreground/70 flex flex-col text-sm font-semibold'>
              <span>Current Plan:</span>
              {userData && !isLoading ? (
                <span className='text-primary tracking-four uppercase'>
                  {userData.currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
                </span>
              ) : (
                <span>Loading...</span>
              )}
              {isError && (
                <span className='text-destructive'>
                  Something went wrong. <br /> Call 112
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Feedback button at bottom */}
        <div className='border-sidebar-border border-t p-3'>
          <Button
            variant='ghost'
            className='text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground w-full justify-start gap-2.5 text-sm font-medium'
          >
            <HugeiconsIcon
              icon={MessageMultiple01Icon}
              className='text-muted-foreground size-4 shrink-0'
            />
            Feedback
          </Button>
        </div>
      </aside>
      {children}
    </>
  )
}
