import { FC } from 'react'
import { VoiceRecord } from '@/payload-types'
import {
  Calendar04Icon,
  Clock03Icon,
  FileAudioIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { formatDuration, getStatusColor } from '@/lib/utils'
import MiniAudioPlayer from './AudioPlayer'

interface Props {
  record: VoiceRecord
}

const VoiceRecordCard: FC<Props> = ({ record }) => {
  return (
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
  )
}
export default VoiceRecordCard
