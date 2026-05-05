'use client'

import { useEffect } from 'react'
import { useUserContext } from '@/app/_providers/user-provider'
import { VoiceRecord } from '@/payload-types'
import { useVoiceRecordsInfiniteQuery } from '@/services/voice-records'
import { FileAudioIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from '@/components/ui/skeleton'
import VoiceRecordCard from './VoiceRecordCard'

const demo: VoiceRecord = {
  createdAt: '123',
  fileName: '123123',
  id: '123',
  status: 'processing',
  updatedAt: '123',
  fileUrl: '123123',
  userId: '123123',
  duration: 123,
}

export default function VoiceRecordsGrid() {
  const { user } = useUserContext()
  const { ref, inView } = useInView()
  let isRefetchAvailable = false

  const {
    data: recordsResponse,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVoiceRecordsInfiniteQuery(user?.id, isRefetchAvailable)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const records = recordsResponse?.pages.flatMap((page) => page.docs) || []

  isRefetchAvailable = records.some(({ status }) => status === 'processing')

  return (
    <section className='mx-auto w-full max-w-7xl px-12 py-10 max-md:px-4'>
      <div className='mb-6 flex flex-col items-start justify-between gap-1'>
        <h2 className='text-4xl font-bold tracking-tight'>Your Recordings</h2>
        <p className='text-muted-foreground text-base'>Explore your voice records</p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <VoiceRecordSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center'>
          <HugeiconsIcon icon={FileAudioIcon} className='text-muted-foreground mb-4 size-10' />
          <h3 className='mb-1 text-lg font-semibold'>No recordings yet</h3>
          <p className='text-muted-foreground text-sm'>Get started by creating a new voice record.</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-5 max-xl:grid-cols-2 max-xl:gap-5 max-md:grid-cols-1 max-sm:gap-6'>
            {records.map((record) => (
              <VoiceRecordCard key={record.id} record={record} />
            ))}
            {isFetchingNextPage && [...Array(3)].map((_, i) => <VoiceRecordSkeleton key={`skeleton-load-${i}`} />)}
          </div>
          <div ref={ref} className='h-4 w-full' />
        </>
      )}
    </section>
  )
}

function VoiceRecordSkeleton() {
  return (
    <div className='bg-card flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm'>
      <div>
        <div className='mb-2 flex items-start justify-between'>
          <Skeleton className='size-12 rounded-xl' />
          <Skeleton className='h-5 w-20 rounded-full' />
        </div>
        <Skeleton className='mt-4 mb-1 h-6 w-3/4' />
      </div>

      <div className='my-4'>
        <Skeleton className='h-10 w-full rounded-full' />
      </div>

      <div className='mt-2 flex justify-end gap-5'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-16' />
      </div>
    </div>
  )
}
