import { FC } from 'react'
import { VoiceRecord } from '@/payload-types'
import {
  Calendar04Icon,
  Clock03Icon,
  MoreVerticalIcon,
  Delete01Icon,
  ProfileIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { formatDuration, getStatusColor } from '@/lib/utils'
import MiniAudioPlayer from './AudioPlayer'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface Props {
  record: VoiceRecord
}

const VoiceRecordCard: FC<Props> = ({ record }) => {
  return (
    <div
      key={record.id}
      className='group bg-card hover:border-accent/50 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 pb-4 shadow-sm transition-all hover:shadow-md'
    >
      <div>
        <div className='mb-3 flex items-center justify-between'>
          <div className='bg-input/70 rounded-xl p-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-id="element-30"><path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path></svg>
          </div>

          <div className='flex items-center gap-1'>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(record.status)}`}
            >
              {record.status}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon-sm'}>
                  <HugeiconsIcon icon={MoreVerticalIcon} className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/record/${record.id}`} className="cursor-pointer flex items-center gap-2">
                    <HugeiconsIcon icon={ProfileIcon} className='size-4' />
                    Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2">
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
  )
}
export default VoiceRecordCard
