import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer';
import { Blog } from '@/payload-types';
import { Close } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FC, useState } from 'react';

interface Props {
  createdAt: string
  fileUrl: string
  tone?:Blog['tone']
};

const BlogMetadata: FC<Props> = ({ createdAt, tone, fileUrl }: Props) => {
  const [showOriginalAudio, setShowOriginalAudio] = useState(false)

  return (
    <>
      <div className='flex items-center text-sm font-medium'>
        <ul className='flex items-center gap-2 py-4'>
          {tone && (
            <Badge variant={'outline'}>Tone: {tone}</Badge>
          )}
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
            variant={'outline'}
            size='sm'
            onClick={() => setShowOriginalAudio(true)}
            className='text-xs font-medium'
          >
            Show original audio
          </Button>
        ) : (
          <div className='relative w-full'>
            <MiniAudioPlayer
              classes='border border-border w-64 '
              fileUrl={fileUrl}
            />
            <button
              onClick={() => setShowOriginalAudio(false)}
              className='bg-muted text-muted-foreground/60 absolute -top-2 -right-2 rounded-full p-0.5'
            >
              <HugeiconsIcon icon={Close} size={12} />
            </button>
          </div>
        )}
      </div>
    </>

  )
};
export default BlogMetadata