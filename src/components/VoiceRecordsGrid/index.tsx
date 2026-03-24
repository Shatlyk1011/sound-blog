'use client'

import {
  Calendar04Icon,
  Clock03Icon,
  FileAudioIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import MiniAudioPlayer from './AudioPlayer'

// Mock Data as per user request
const mockRecords = [
  {
    id: 'rec-1',
    fileName: 'Project Ideas Brainstorm.webm',
    duration: 125, // seconds
    status: 'completed',
    createdAt: new Date('2024-03-20T10:00:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3',
  },
  {
    id: 'rec-2',
    fileName: 'Client Meeting Notes.webm',
    duration: 340,
    status: 'processing',
    createdAt: new Date('2024-03-21T14:30:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3',
  },
  {
    id: 'rec-3',
    fileName: 'Personal Voice Diary.webm',
    duration: 65,
    status: 'completed',
    createdAt: new Date('2024-03-24T09:15:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3',
  },
  {
    id: 'rec-4',
    fileName: 'App Feature Demo.webm',
    duration: 210,
    status: 'failed',
    createdAt: new Date('2024-03-24T16:45:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3',
  },
]

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-green-500 bg-green-50 dark:bg-green-500/10'
    case 'processing':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
    case 'failed':
      return 'text-red-500 bg-red-50 dark:bg-red-500/10'
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-500/10'
  }
}

export default function VoiceRecordsGrid() {
  return (
    <section className='mx-auto w-full max-w-6xl px-6 py-10 max-md:px-4'>
      <div className='mb-6 flex flex-col items-start justify-between gap-1'>
        <h2 className='text-2xl font-bold tracking-tight'>Your Recordings</h2>
        <p className='text-muted-foreground text-sm'>
          Manage and view your voice records
        </p>
      </div>

      <div className='grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-6'>
        {mockRecords.map((record) => (
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
                {formatDuration(record.duration)}
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
      </div>
    </section>
  )
}
