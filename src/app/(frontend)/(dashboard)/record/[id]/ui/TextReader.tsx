'use client'

import { useTTS, TTSStatus } from '@/hooks/use-tts'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PauseIcon,
  PlayIcon,
  Loading03Icon,
  StopIcon,
  VoiceIcon,
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

interface TextReaderProps {
  text: string
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

export default function TextReader({ text, className }: TextReaderProps) {
  const { status, progress, duration, currentTime, toggle, stop, error } = useTTS(text)

  const isLoading = status === 'loading'
  const isPlaying = status === 'playing'
  const isActive = status === 'playing' || status === 'paused'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-1 py-1 transition-all duration-300',
        isActive
          ? 'border-primary/30 bg-primary/5 shadow-sm'
          : 'border-border bg-background hover:border-border/70',
        className
      )}
    >
      {/* Play / Pause / Loading button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="text-reader-toggle"
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={toggle}
            className={cn(
              'h-8 w-8 shrink-0 rounded-full transition-all duration-200',
              isPlaying
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            aria-label={isPlaying ? 'Pause reading' : 'Play reading'}
          >
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
            ) : isPlaying ? (
              <HugeiconsIcon icon={PauseIcon} size={16} />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={16} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{STATUS_LABEL[status]}</p>
        </TooltipContent>
      </Tooltip>

      {/* Progress bar + time — only visible when active */}
      {isActive && (
        <div className="flex items-center gap-2 pr-1">
          {/* Mini waveform / progress bar */}
          <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="bg-primary absolute inset-y-0 left-0 rounded-full transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
            />
            {/* Animated pulse at playhead when playing */}
            {isPlaying && (
              <div
                className="bg-primary/60 absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full animate-ping"
                style={{ left: `calc(${progress * 100}% - 6px)` }}
              />
            )}
          </div>

          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {formatTime(currentTime)}
            {duration > 0 && ` / ${formatTime(duration)}`}
          </span>

          {/* Stop button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="text-reader-stop"
                variant="ghost"
                size="icon"
                onClick={stop}
                className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-full"
                aria-label="Stop reading"
              >
                <HugeiconsIcon icon={StopIcon} size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Stop</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Idle label */}
      {status === 'idle' && (
        <span className="text-muted-foreground flex items-center gap-1 pr-2 text-xs font-medium">
          <HugeiconsIcon icon={VoiceIcon} size={13} />
          Listen
        </span>
      )}

      {/* Error hint */}
      {status === 'error' && (
        <span className="text-destructive pr-2 text-xs font-medium" title={error ?? undefined}>
          Failed — tap to retry
        </span>
      )}
    </div>
  )
}
