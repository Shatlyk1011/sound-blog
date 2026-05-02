'use client'

import { FC, useState } from 'react'
import { useUserContext } from '@/app/_providers/user-provider'
import { VoiceRecord } from '@/payload-types'
import { useDeleteVoiceRecordMutation } from '@/services/voice-records'
import {
  Calendar04Icon,
  Clock03Icon,
  MoreVerticalIcon,
  Delete01Icon,
  ProfileIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { formatDuration, getStatusColor } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import MiniAudioPlayer from './AudioPlayer'

interface Props {
  record: VoiceRecord
}

const VoiceRecordCard: FC<Props> = ({ record }) => {
  const { user } = useUserContext()
  const { mutate: deleteRecord, isPending } = useDeleteVoiceRecordMutation(user?.id)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  return (
    <>
      <div
        key={record.id}
        className='group bg-card hover:border-accent/50 relative flex flex-col justify-between overflow-hidden rounded-2xl border px-6 pt-5 pb-4 shadow-sm transition-all hover:shadow-md'
      >
        {isPending && (
          <div className='bg-card/80 absolute inset-0 flex items-center justify-center backdrop-blur-[2px]'>
            <span className='flex items-center gap-2'>
              <HugeiconsIcon icon={Loading03Icon} className='size-4 animate-spin delay-200 duration-3000 ease-in-out' />
              <span className='text-card-foreground/80 text-sm'>deleting...</span>
            </span>
          </div>
        )}
        <div>
          <div className='mb-3 flex items-start justify-between'>
            <div className='bg-input/70 rounded-xl p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
                data-id='element-30'
              >
                <path d='M2 10v3'></path>
                <path d='M6 6v11'></path>
                <path d='M10 3v18'></path>
                <path d='M14 8v7'></path>
                <path d='M18 5v13'></path>
                <path d='M22 10v3'></path>
              </svg>
            </div>

            <div className='flex items-center gap-1'>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(record.status)}`}
              >
                {record.status}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className='-mr-2'>
                  <Button variant={'ghost'} size={'icon-sm'}>
                    <HugeiconsIcon icon={MoreVerticalIcon} className='size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem asChild>
                    <Link href={`/record/${record.id}`} className='flex cursor-pointer items-center gap-2'>
                      <HugeiconsIcon icon={ProfileIcon} className='size-4' />
                      Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-destructive focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2'
                    onSelect={() => setShowDeleteAlert(true)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className='size-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Link href={`/record/${record.id}`}>
            <h3 className='hover:text-primary mb-1 line-clamp-2 text-lg font-semibold transition-colors'>
              {record.fileName}
            </h3>
          </Link>
        </div>

        <MiniAudioPlayer fileUrl={record.fileUrl} />

        <div className='text-muted-foreground mt-2 flex items-center justify-end gap-5 text-xs'>
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

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your record: <br /> <b>{record.fileName}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={'destructive'}
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                setShowDeleteAlert(false)
                deleteRecord(record.id)
              }}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
export default VoiceRecordCard
