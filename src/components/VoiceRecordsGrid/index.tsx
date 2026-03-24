"use client"

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar04Icon, Clock03Icon, FileAudioIcon } from '@hugeicons/core-free-icons'
import MiniAudioPlayer from './AudioPlayer'

// Mock Data as per user request
const mockRecords = [
  {
    id: 'rec-1',
    fileName: 'Project Ideas Brainstorm.webm',
    duration: 125, // seconds
    status: 'completed',
    createdAt: new Date('2024-03-20T10:00:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3'
  },
  {
    id: 'rec-2',
    fileName: 'Client Meeting Notes.webm',
    duration: 340,
    status: 'processing',
    createdAt: new Date('2024-03-21T14:30:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3'
  },
  {
    id: 'rec-3',
    fileName: 'Personal Voice Diary.webm',
    duration: 65,
    status: 'completed',
    createdAt: new Date('2024-03-24T09:15:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3'
  },
  {
    id: 'rec-4',
    fileName: 'App Feature Demo.webm',
    duration: 210,
    status: 'failed',
    createdAt: new Date('2024-03-24T16:45:00Z').toISOString(),
    fileUrl: 'https://filesamples.com/samples/audio/mp3/sample3.mp3'
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
    <section className="w-full max-w-6xl mx-auto py-10 px-6 max-md:px-4">
      <div className="flex flex-col gap-1 items-start justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Recordings</h2>
        <p className="text-muted-foreground text-sm">
          Manage and view your voice records
        </p>
      </div>
      
      <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 max-lg:gap-5 max-sm:gap-6 grid-cols-3 gap-6">
        {mockRecords.map((record) => (
          <div
            key={record.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-accent/50"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="rounded-xl bg-input/50 p-3 text-foreground/80">
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
                <h3 className="font-semibold text-lg line-clamp-1 mt-4 mb-1 hover:text-primary transition-colors">
                  {record.fileName}
                </h3>
              </Link>
            </div>
            
            <MiniAudioPlayer fileUrl={record.fileUrl} />

            <div className="mt-2 flex items-center justify-end gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Clock03Icon} className='size-4'/>
                {formatDuration(record.duration)}
              </div>
              <div className="flex items-center gap-1.5">
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
