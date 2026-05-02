'use client'

import { Loading03Icon, SpeechIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'
import { useTTS, TTSStatus } from '@/hooks/use-tts'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'

interface TextReaderProps {
  text: string
  lang: string
  className?: string
}

const STATUS_LABEL: Record<TTSStatus, string> = {
  idle: 'Audio Speech',
  loading: 'Generating audio…',
  playing: 'Playing…',
  paused: 'Paused',
  error: 'Retry audio',
}

export default function TextReader({ text, lang, className }: TextReaderProps) {
  const { status, audioUrl, toggle, error } = useTTS(text, lang)

  const isLoading = status === 'loading'
  const isError = status === 'error'

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Trigger button — shown when no audio is ready yet */}
      {!audioUrl && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id='text-reader-toggle'
              variant={isError ? 'destructive' : 'outline'}
              size='sm'
              onClick={toggle}
              aria-label={STATUS_LABEL[status]}
              className='gap-2 w-9 h-9 rounded-full'
            >
              {isLoading ? (
                <HugeiconsIcon icon={Loading03Icon} size={16} className='animate-spin' />
              ) : (
                <HugeiconsIcon icon={SpeechIcon} size={16} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>{STATUS_LABEL[status]}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Error hint */}
      {isError && (
        <span className='text-destructive/80 text-xs font-medium' title={error ?? undefined}>
          Failed — tap to retry
        </span>
      )}

      {/* Audio player — shown once audio is generated */}
      {audioUrl && <AudioPlayer classes='px-2 py-2 m-0' fileUrl={'123'} autoPlay />}
    </div>
  )
}
