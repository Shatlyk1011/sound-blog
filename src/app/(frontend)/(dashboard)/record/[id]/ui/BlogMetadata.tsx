import { FC, useState } from 'react'
import { Blog } from '@/payload-types'
import { Close } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'

interface Props {
  createdAt: string
  fileUrl: string
  tone?: Blog['tone']
}

const BlogMetadata: FC<Props> = ({ createdAt, tone, fileUrl }: Props) => {
  const [showOriginalAudio, setShowOriginalAudio] = useState(false)

  return (
    <div className='flex min-h-20 items-start justify-between'>
      <div className='flex items-center text-sm font-medium'>
        <ul className='flex items-center gap-2 py-4'>
          {tone && <li className='border-border rounded-full border px-2.5 py-1 text-xs'>Tone: {tone}</li>}
        </ul>
        <span className='mx-2 text-lg'>•</span>
        <time className='text-muted-foreground' dateTime={createdAt}>
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
          }).format(new Date(createdAt))}
        </time>
      </div>
      <div className='flex flex-col'>
        {!showOriginalAudio ? (
          <Button
            variant={'ghost'}
            size='sm'
            onClick={() => setShowOriginalAudio(true)}
            className='text-xs font-medium opacity-70'
          >
            Show original audio
          </Button>
        ) : (
          <div className='relative w-full'>
            <MiniAudioPlayer classes='border border-border w-64  my-0' fileUrl={fileUrl} />
            <button
              onClick={() => setShowOriginalAudio(false)}
              className='bg-muted text-muted-foreground/60 absolute -top-5 -right-0 rounded-full p-0.5'
            >
              <HugeiconsIcon icon={Close} size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default BlogMetadata
