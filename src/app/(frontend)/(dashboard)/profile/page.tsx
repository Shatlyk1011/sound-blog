'use client'

import { getUserInitials } from '@/composables/utils'
import { CreditHistory } from '@/payload-types'
import { useUserCreditsQuery } from '@/services/user-credits'
import { Calendar03Icon, CreditCardIcon, Crown03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const dynamic = 'force-dynamic'

// Mock invoice history (keeping this as it's not part of credit history)
const mockInvoices = [
  {
    id: 1,
    date: '2026-01-15',
    amount: 0,
    status: 'Paid',
    description: 'Free Plan - January 2026',
  },
  {
    id: 2,
    date: '2025-12-15',
    amount: 0,
    status: 'Paid',
    description: 'Free Plan - December 2025',
  },
  {
    id: 3,
    date: '2025-11-15',
    amount: 0,
    status: 'Paid',
    description: 'Free Plan - November 2025',
  },
]
export default function ProfilePage() {
  const { user: SBUser, isLoading: isSBLoading } = useUser()

  const { data: userData, isLoading, isError } = useUserCreditsQuery(SBUser?.id)

  const getCreditTypeLabel = (type: CreditHistory['source']) => {
    return type === 'signup_bonus' ? 'Signup Bonus' : 'Purchased Credits'
  }

  return (
    <main className='mx-auto mb-16 w-full max-w-6xl px-8 pt-24 max-lg:px-6 max-sm:px-4'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Profile</h1>
        <p className='text-muted-foreground'>View credit history, download invoices.</p>
      </div>

      {/* Profile Settings Card */}
      <div className='bg-card text-card-foreground mb-6 rounded-4xl border p-8'>
        <div className='mb-6 flex items-center gap-4'>
          <Avatar className='size-12'>
            <AvatarImage
              src={SBUser?.user_metadata?.avatar_url}
              alt={SBUser?.user_metadata?.full_name || 'avatar image'}
            />
            <AvatarFallback className='bg-secondary text-secondary-foreground text-xl'>
              {getUserInitials(SBUser)}
            </AvatarFallback>
          </Avatar>
          <h2 className='text-2xl font-semibold'>Profile Settings</h2>
        </div>

        <div className='mb-10 flex gap-4 text-sm font-medium'>
          <div className='flex-1'>
            <label className='mb-2 block'>Name</label>
            <p className='text-muted-foreground border-input bg-input/30 flex h-9 items-center rounded-full px-4'>
              {SBUser?.user_metadata?.full_name || 'No name'}
            </p>
          </div>

          <div className='flex-1'>
            <label className='mb-2 block'>Email</label>
            <p className='text-muted-foreground border-input bg-input/30 flex h-9 items-center rounded-full px-4'>
              {SBUser?.user_metadata?.email || 'No email'}
            </p>
          </div>
        </div>

        <div className='mb-5 flex items-center justify-between gap-4'>
          <h2 className='text-xl font-medium'>
            <span className=''>Your Current Plan:</span>{' '}
            <span className='text-primary font-bold tracking-[-0.02em]'>
              {userData?.currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
            </span>
          </h2>
          <Button asChild>
            <Link href='/pricing'>
              <HugeiconsIcon icon={Crown03Icon} />
              Upgrade
            </Link>
          </Button>
        </div>

        <div className='bg-input/30 rounded-3xl p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{userData?.currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}</h3>
            <span className='text-muted-foreground text-sm'>
              {(userData?.totalCredits || 0) - (userData?.creditsSpent || 0)} credits remaining
            </span>
          </div>
          <p className='text-muted-foreground text-sm'>For exploring the platform.</p>

          {/* Credits Progress Bar */}
          <div className='mt-4'>
            <div className='mb-2 flex items-center justify-between text-sm'>
              <span className='font-medium'>Credits Used</span>
              <span className='text-muted-foreground'>
                {userData?.creditsSpent || 0} / {userData?.totalCredits || 0}
              </span>
            </div>
            <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
              <div
                className='bg-muted-foreground/70 h-full transition-all'
                style={{
                  width: userData?.totalCredits
                    ? `${((userData?.creditsSpent || 0) / userData.totalCredits) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='bg-card mb-6 rounded-4xl border p-8 shadow-sm'>
        <h2 className='mb-6 text-xl font-semibold'>Credit History</h2>

        <div className='overflow-hidden rounded-3xl border'>
          <Table className='w-full overflow-y-auto text-nowrap'>
            <TableHeader className='bg-input/30 text-left text-sm font-medium'>
              <TableRow>
                <TableHead className='w-[40%] px-6 py-3'>Source</TableHead>
                <TableHead className='px-6 py-3'>Added Date</TableHead>
                <TableHead className='px-6 py-3'>Expiration Date</TableHead>
                <TableHead className='w-[10%] px-6 py-3 text-right'>Credits</TableHead>
                <TableHead className='px-6 py-3'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='divide-y'>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='p-4'>
                    <div className='space-y-2'>
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-destructive px-6 py-8 text-center'>
                    Failed to load credit history. Please try again.
                  </TableCell>
                </TableRow>
              ) : (
                userData?.history &&
                userData.history.length > 0 &&
                userData.history.map((h) => {
                  // consider "used" status as well
                  const isActive = h.status === 'active'
                  return (
                    <TableRow key={h.id} className='hover:bg-muted/30 transition-colors'>
                      <TableCell className='px-6 py-4 text-sm font-medium'>{getCreditTypeLabel(h.source)}</TableCell>
                      <TableCell className='px-6 py-4 text-sm'>
                        <div className='flex items-center gap-2'>
                          <HugeiconsIcon icon={Calendar03Icon} />
                          {formatDate(h.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className='px-6 py-4 text-sm'>
                        <div className='flex items-center gap-2'>
                          <HugeiconsIcon icon={Calendar03Icon} />
                          {formatDate(h.expirationDate || '20.10.20')}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'px-6 py-4 text-right text-sm font-semibold',
                          isActive ? 'text-green-600' : 'text-muted-foreground/80'
                        )}
                      >
                        +{h.creditAmount}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'px-6 py-4 text-sm capitalize',
                          isActive ? 'text-green-600' : 'text-muted-foreground/80'
                        )}
                      >
                        {h.status}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invoice History */}
      <div className='bg-card mb-6 rounded-4xl border p-8 shadow-sm'>
        <h2 className='mb-6 text-xl font-semibold'>Invoice History</h2>

        <div className='overflow-hidden rounded-3xl border'>
          <Table className='w-full'>
            <TableHeader className='bg-input/30'>
              <TableRow>
                <TableHead className='px-6 py-3 text-left text-sm font-medium'>Date</TableHead>
                <TableHead className='px-6 py-3 text-left text-sm font-medium'>Description</TableHead>
                <TableHead className='px-6 py-3 text-left text-sm font-medium'>Status</TableHead>
                <TableHead className='px-6 py-3 text-right text-sm font-medium'>Amount</TableHead>
                <TableHead className='px-6 py-3 text-right text-sm font-medium'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='divide-y'>
              {mockInvoices?.map((invoice) => (
                <TableRow key={invoice.id} className='hover:bg-muted/30 transition-colors'>
                  <TableCell className='px-6 py-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <HugeiconsIcon icon={Calendar03Icon} className='text-muted-foreground size-4' />
                      {formatDate(invoice.date)}
                    </div>
                  </TableCell>
                  <TableCell className='px-6 py-4 text-sm'>{invoice.description}</TableCell>
                  <TableCell className='px-6 py-4 text-sm'>
                    <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className='px-6 py-4 text-right text-sm font-semibold'>
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className='px-6 py-4 text-right'>
                    <Button variant='ghost' size='sm' className='text-secondary-foreground'>
                      <HugeiconsIcon icon={CreditCardIcon} />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!mockInvoices.length && (
            <div className='py-2 text-center'>
              <Button variant='link' size='sm' asChild className='text-blue-500 hover:text-blue-600'>
                <Link href='/pricing'>Upgrade your plan to receive invoices.</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
