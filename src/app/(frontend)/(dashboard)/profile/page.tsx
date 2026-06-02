'use client'

import { CreditHistory } from '@/payload-types'
import { useUserCreditsQuery } from '@/services/user-credits'
import { CreditCardIcon, Crown03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getUserInitials } from '@/components/ui/composables/utils'
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

export default function ProfilePage() {
  const { user: SBUser } = useUser()

  const { data: userData, isLoading, isError } = useUserCreditsQuery(SBUser?.id)

  const getCreditTypeLabel = (type: CreditHistory['source']) => {
    switch (type) {
      case 'signup_bonus':
        return 'Signup Bonus'
      case 'purchased':
        return 'Purchased Credits'
      case 'monthly_free':
        return 'Monthly Free'
      case 'gift':
        return 'Gift'
      default:
        return 'Credits'
    }
  }

  const isProPlan = userData?.currentPlan === 'paid'

  return (
    <div className='mx-auto w-full max-w-6xl px-8 pt-24 pb-16 max-lg:px-6 max-sm:px-4'>
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

        <div className='font-snas mb-10 flex gap-4 text-sm font-medium'>
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
          <h2 className='-tracking-two flex items-center gap-2 text-xl font-medium'>
            <span>Current Plan:</span>{' '}
            {isLoading ? (
              <Skeleton className='inline-block h-6 w-20' />
            ) : (
              <span className={cn('text-primary -tracking-two font-bold', isProPlan && 'text-chart-2')}>
                {isProPlan ? 'Pro Plan' : 'Free Plan'}
              </span>
            )}
          </h2>

          {!isProPlan && (
            <Button asChild>
              <Link href='/pricing' prefetch={false}>
                <HugeiconsIcon icon={Crown03Icon} />
                Upgrade
              </Link>
            </Button>
          )}
        </div>

        <div className='bg-input/30 rounded-3xl p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{userData?.currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}</h3>
            <span className='text-muted-foreground text-sm'>
              {Math.round((userData?.totalCredits || 0) / 60)} minutes remaining
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
                <TableHead className='w-[35%] px-6 py-3'>Source</TableHead>
                <TableHead className='w-[20%] px-6 py-3'>Dates</TableHead>
                <TableHead className='w-[15%] px-6 py-3 text-right'>Credits</TableHead>
                <TableHead className='w-[15%] px-6 py-3'>Status</TableHead>
                <TableHead className='w-[15%] px-6 py-3 text-right'>Action</TableHead>
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
                        <div className='flex flex-col gap-1'>
                          <div className='text-muted-foreground flex items-center gap-2'>
                            <span className='w-12'>Added:</span>
                            <span className='text-foreground'>{formatDate(h.createdAt)}</span>
                          </div>
                          <div className='text-muted-foreground flex items-center gap-2'>
                            <span className='w-12'>Expires:</span>
                            <span className='text-foreground'>{formatDate(h.expirationDate || '20.10.20')}</span>
                          </div>
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
                      <TableCell className='px-6 py-4 text-right'>
                        {h.invoiceUrl ? (
                          <Button variant='ghost' size='sm' className='text-secondary-foreground' asChild>
                            <Link href={h.invoiceUrl} target='_blank'>
                              <HugeiconsIcon icon={CreditCardIcon} />
                              <span className='ml-2'>Invoice</span>
                            </Link>
                          </Button>
                        ) : (
                          <span className='text-muted-foreground text-xs'>N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
