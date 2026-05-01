'use client'

import { PauseIcon, PlayIcon, Loading03Icon, StopIcon, VoiceIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'
import { useTTS, TTSStatus } from '@/hooks/use-tts'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TextReaderProps {
  text: string
  lang: string
  className?: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const STATUS_LABEL: Record<TTSStatus, string> = {
  idle: 'Listen to article',
  loading: 'Generating audio…',
  playing: 'Playing…',
  paused: 'Paused',
  error: 'Retry audio',
}

export default function TextReader({ text, lang, className }: TextReaderProps) {
  const { status, progress, duration, currentTime, toggle, stop, error } = useTTS(text, lang)

  const isLoading = status === 'loading'
  const isPlaying = status === 'playing'
  const isActive = status === 'playing' || status === 'paused'
  const isError = status === 'error'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border transition-all duration-300',
        className
      )}
    >
      {/* Play / Pause / Loading button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id='text-reader-toggle'
            variant={isError && 'descrtuctive' || isPlaying ? "secondary" : 'outline'}
            size='icon-sm'
            onClick={toggle}
            className={cn(

            )}
            aria-label={isPlaying ? 'Pause reading' : 'Play reading'}
          >
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} size={16} className='animate-spin' />
            ) : isPlaying ? (
              <HugeiconsIcon icon={PauseIcon} size={16} />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={16} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side='top'>
          <p>{STATUS_LABEL[status]}</p>
        </TooltipContent>
      </Tooltip>

      {/* Progress bar + time — only visible when active */}
      {isActive && (
        <div className='flex items-center gap-2 pr-1'>
          {/* Mini waveform / progress bar */}
          <div className='bg-muted relative h-1.5 w-24 overflow-hidden rounded-full'>
            <div
              className='bg-primary absolute inset-y-0 left-0 rounded-full transition-all duration-200'
              style={{ width: `${progress * 100}%` }}
            />
            {/* Animated pulse at playhead when playing */}
            {isPlaying && (
              <div
                className='bg-primary/60 absolute top-1/2 h-3 w-3 -translate-y-1/2 animate-ping rounded-full'
                style={{ left: `calc(${progress * 100}% - 6px)` }}
              />
            )}
          </div>

          <span className='text-muted-foreground font-mono text-[11px] tabular-nums'>
            {formatTime(currentTime)}
            {duration > 0 && ` / ${formatTime(duration)}`}
          </span>

          {/* Stop button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id='text-reader-stop'
                variant='ghost'
                size='icon'
                onClick={stop}
                className='text-muted-foreground hover:text-foreground h-6 w-6 rounded-full'
                aria-label='Stop reading'
              >
                <HugeiconsIcon icon={StopIcon} size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Stop</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Error hint */}
      {isError && (
        <span className='text-destructive/80 pr-2 text-xs font-medium' title={error ?? undefined}>
          Failed — tap to retry
        </span>
      )}
    </div>
  )
}
