'use client'

import { type ReactNode, useState } from 'react'
import { UserDataResponse } from '@/app/api/user-data/route'
import { useUserCreditsQuery } from '@/services/user-credits'
import { siteConfig } from '@/siteConfig'
import {
  Home01Icon,
  UserCircleIcon,
  MessageMultiple01Icon,
  Crown03Icon,
  BookOpenTextIcon,
  Eye,
  EyeOff,
  SidebarLeftIcon,
  SidebarRightIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import Header from './header'

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'dashboard-sidebar-collapsed'

const FeedbackDialog = dynamic(() => import('./FeedbackDialog').then((mod) => mod.FeedbackDialog), {
  ssr: false,
})

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home01Icon },
  { href: '/profile', label: 'Profile', icon: UserCircleIcon },
  { href: '/editorial', label: 'Editorial', icon: BookOpenTextIcon },
]

interface Props {
  children: ReactNode
}

export function DashboardSidebar({ children }: Props) {
  const pathname = usePathname()
  const { user: SBUser } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false

    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  })
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

  const { data: userData } = useUserCreditsQuery(SBUser?.id)

  const remainingCredits = userData ? Math.max(userData.totalCredits - (userData?.creditsSpent || 0), 0) : undefined

  const handleToggleSidebar = () => {
    setIsCollapsed((currentValue) => {
      const nextValue = !currentValue
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextValue))
      return nextValue
    })
  }

  const openEmailDraft = (subject?: string, body?: string) => {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)

    const mailtoUrl = `mailto:${siteConfig.supportEmail}${params.toString() ? `?${params.toString()}` : ''}`
    window.location.href = mailtoUrl
  }

  return (
    <>
      <Header isDashboardPage />
      <aside
        className={cn(
          'border-sidebar-border/80 bg-sidebar/95 fixed top-14 left-0 z-40 flex h-[calc(100svh-3.5rem)] flex-col shadow-[12px_0_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 ease-out',
          isCollapsed ? 'w-16' : 'w-72'
        )}
      >
        <nav className={cn('flex-1 py-4 transition-all duration-300', isCollapsed ? 'px-2' : 'px-3')}>
          <div className={cn('mb-2 flex items-center gap-2 px-1', isCollapsed ? 'justify-center' : 'justify-between')}>
            {!isCollapsed && (
              <span className='text-muted-foreground/70 inline-block px-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase'>
                Menu
              </span>
            )}
            <Button
              size='icon-sm'
              variant='ghost'
              type='button'
              onClick={handleToggleSidebar}
              aria-label={isCollapsed ? 'Expand dashboard sidebar' : 'Collapse dashboard sidebar'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className='text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground rounded-xl'
            >
              <HugeiconsIcon icon={isCollapsed ? SidebarRightIcon : SidebarLeftIcon} className='size-4' />
            </Button>
          </div>
          <ul className='mb-6 space-y-1'>
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={isCollapsed ? label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isCollapsed && 'justify-center gap-0 px-2',
                      isActive
                        ? 'border-sidebar-border bg-sidebar-accent text-sidebar-primary shadow-sm'
                        : 'text-sidebar-foreground/68 hover:border-sidebar-border/70 hover:bg-sidebar-accent/45 hover:text-sidebar-foreground border-transparent'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-lg transition-colors',
                        isActive ? 'bg-sidebar text-sidebar-primary' : 'bg-sidebar-accent/45 text-muted-foreground'
                      )}
                    >
                      <HugeiconsIcon icon={icon} className='size-4' />
                    </span>
                    <span className={cn('truncate transition-opacity duration-200', isCollapsed && 'sr-only')}>
                      {label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className={cn('px-1', isCollapsed && 'px-0')}>
            {!isCollapsed && (
              <span className='text-muted-foreground/70 mb-2 inline-block px-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase'>
                Workspace
              </span>
            )}
            <UserInfo
              name={SBUser?.user_metadata?.full_name || 'No name'}
              currentPlan={userData?.currentPlan}
              credits={remainingCredits}
              isCollapsed={isCollapsed}
            />
          </div>
        </nav>

        <div className={cn('border-sidebar-border/80 bg-sidebar/80 border-t p-3', isCollapsed && 'px-2')}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                title={isCollapsed ? 'Feedback' : undefined}
                className={cn(
                  'text-sidebar-foreground/70 hover:bg-sidebar-accent/65 hover:text-sidebar-foreground hover:border-sidebar-border/70 h-11 w-full gap-2.5 rounded-xl border border-transparent text-sm font-medium',
                  isCollapsed ? 'justify-center px-0' : 'justify-start'
                )}
              >
                <span className='bg-sidebar-accent/70 grid size-7 place-items-center rounded-lg'>
                  <HugeiconsIcon icon={MessageMultiple01Icon} className='text-muted-foreground size-4 shrink-0' />
                </span>
                <span className={cn(isCollapsed && 'sr-only')}>Feedback</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' side='top' className='w-80'>
              <DropdownMenuLabel>Choose how to share feedback</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='items-start py-3' onSelect={() => setIsFeedbackDialogOpen(true)}>
                <p className='font-medium'>Open feedback form</p>
              </DropdownMenuItem>

              <DropdownMenuItem className='items-start py-3' onSelect={() => openEmailDraft('Sound Blog Feedback')}>
                <div className='space-y-0.5'>
                  <p className='font-medium'>Send an email</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className='items-start py-3'
                onSelect={() => window.open(siteConfig.linkedin, '_blank', 'noopener,noreferrer')}
              >
                <div className='space-y-0.5'>
                  <p className='font-medium'>Write to me on LinkedIn</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main
        className={cn(
          'h-[calc(100svh-3.5rem)] flex-1 overflow-hidden transition-all duration-300 ease-out',
          isCollapsed ? 'ml-16' : 'ml-72'
        )}
      >
        <div className='border-sidebar-border bg-background h-full overflow-hidden rounded-l-4xl border'>
          <div className='h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable]'>{children}</div>
        </div>
      </main>

      {isFeedbackDialogOpen && (
        <FeedbackDialog email={SBUser?.email} open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />
      )}
    </>
  )
}

interface UserProps {
  name?: string
  currentPlan?: UserDataResponse['currentPlan']
  credits?: UserDataResponse['totalCredits']
  isCollapsed?: boolean
}

const UserInfo = ({ name, currentPlan, credits, isCollapsed }: UserProps) => {
  const [showCredits, setShowCredits] = useState(true)
  const [first] = (name ?? '').split(' ')

  const isPaid = currentPlan && currentPlan === 'paid'

  if (isCollapsed) return null

  return (
    <div className='border-sidebar-border/80 bg-sidebar-accent/35 space-y-3 rounded-2xl border p-3 shadow-sm'>
      <div className='flex min-w-0 items-center gap-3'>
        <div className='min-w-0'>
          <p className='text-sidebar-foreground text-sm font-semibold'>{first || 'Your'}&apos;s workspace</p>
        </div>
      </div>

      <div className='grid gap-2 text-xs'>
        <div className='bg-sidebar/75 border-sidebar-border/70 flex items-center justify-between gap-2 rounded-xl border px-3 py-2'>
          <span className='text-sidebar-foreground/60'>Plan</span>
          {currentPlan ? (
            <span className='text-sidebar-primary bg-sidebar-accent rounded-full px-2 py-0.5 font-semibold capitalize'>
              {currentPlan}
            </span>
          ) : (
            <Skeleton className='h-5 w-16 rounded-full' />
          )}
        </div>

        <div className='bg-sidebar/75 border-sidebar-border/70 rounded-xl border px-3 py-2'>
          <div className='mb-1 flex items-center justify-between gap-2'>
            <span className='text-sidebar-foreground/60'>Credits</span>
            {credits !== undefined ? (
              <Button
                size='icon-xs'
                variant='ghost'
                className='text-muted-foreground hover:text-sidebar-foreground -mr-1 size-6'
                type='button'
                onClick={() => setShowCredits(!showCredits)}
                aria-label={showCredits ? 'Hide credits' : 'Show credits'}
              >
                <HugeiconsIcon icon={showCredits ? Eye : EyeOff} className='size-3.5' />
              </Button>
            ) : (
              <Skeleton className='h-5 w-5 rounded-full' />
            )}
          </div>
          {credits !== undefined ? (
            <div className='text-sidebar-primary flex h-5 items-baseline gap-1'>
              <span className='text-lg leading-none font-semibold'>{showCredits ? credits : '******'}</span>
              {showCredits && (
                <span className='text-muted-foreground text-[0.68rem]'>(~{Math.round(credits / 60)} min)</span>
              )}
            </div>
          ) : (
            <Skeleton className='h-6 w-24' />
          )}
        </div>
      </div>

      <p className='text-sidebar-foreground/55 px-1 text-[0.68rem]'>1 credit equals 1 second of audio.</p>

      {!isPaid && (
        <Button
          size='sm'
          asChild
          className='bg-chart-2 hover:bg-chart-2/90 h-10 w-full rounded-xl text-white shadow-sm'
        >
          <Link href='/pricing' prefetch={false}>
            <HugeiconsIcon icon={Crown03Icon} className='size-4' strokeWidth={2} />
            Upgrade plan
          </Link>
        </Button>
      )}
    </div>
  )
}
