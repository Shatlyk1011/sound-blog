'use client'

import { useEffect } from 'react'
import { useUserContext } from '@/app/_providers/user-provider'
import { useVoiceRecordsInfiniteQuery } from '@/services/voice-records'
import {
  Calendar04Icon,
  Clock03Icon,
  FileAudioIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from '@/components/ui/skeleton'
import MiniAudioPlayer from './AudioPlayer'

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100 dark:bg-green-500/10'
    case 'processing':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
    case 'failed':
      return 'text-red-500 bg-red-50 dark:bg-red-500/10'
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-500/10'
  }
}

export default function VoiceRecordsGrid() {
  const { user } = useUserContext()
  const { ref, inView } = useInView()

  const {
    data: recordsResponse,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVoiceRecordsInfiniteQuery(user?.id, true)


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const records = recordsResponse?.pages.flatMap((page) => page.docs) || []

  console.log('records', records)

  return (
    <section className='mx-auto w-full max-w-6xl px-6 py-10 max-md:px-4'>
      <div className='mb-6 flex flex-col items-start justify-between gap-1'>
        <h2 className='text-2xl font-bold tracking-tight'>Your Recordings</h2>
        <p className='text-muted-foreground text-sm'>
          Manage and view your voice records
        </p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-6'>
          {[...Array(6)].map((_, i) => (
            <VoiceRecordSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center'>
          <HugeiconsIcon
            icon={FileAudioIcon}
            className='text-muted-foreground mb-4 size-10'
          />
          <h3 className='mb-1 text-lg font-semibold'>No recordings yet</h3>
          <p className='text-muted-foreground text-sm'>
            Get started by creating a new voice record.
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-6'>
                {records.map((record) => (
              <div
                key={record.id}
                className='group bg-card hover:border-accent/50 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md'
              >
                <div>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='bg-input/50 text-foreground/80 rounded-xl p-3'>
                      <HugeiconsIcon icon={FileAudioIcon} className='size-6' />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <Link href={`/record/${record.id}`}>
                    <h3 className='hover:text-primary mt-4 mb-1 line-clamp-1 text-lg font-semibold transition-colors'>
                      {record.fileName}
                    </h3>
                  </Link>
                </div>

                <MiniAudioPlayer fileUrl={record.fileUrl} />

                <div className='text-muted-foreground mt-2 flex items-center justify-end gap-5 text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <HugeiconsIcon icon={Clock03Icon} className='size-4' />
                    {formatDuration(record.duration ?? 0)}
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <HugeiconsIcon icon={Calendar04Icon} className='size-4' />
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isFetchingNextPage &&
              [...Array(3)].map((_, i) => (
                <VoiceRecordSkeleton key={`skeleton-load-${i}`} />
              ))}
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
