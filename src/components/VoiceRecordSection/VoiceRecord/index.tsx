'use client'

import { SubmitEventHandler, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Check,
  Mic01Icon,
  PauseIcon,
  PlayCircle02Icon,
  Refresh03Icon,
  StopCircleIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAudioRecorder } from '@/hooks/use-wavesurfer'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import RecordFilter from '../RecordFilter'

export default function VoiceRecord() {
  const { resolvedTheme } = useTheme()

  const [isUploading, setIsUploading] = useState(false)
  const isDark = resolvedTheme === 'dark'

  const {
    status,
    recordingTime,
    audioUrl,
    getRootProps,
    getInputProps,
    isDragActive,
    startRecording,
    stopRecording,
    resetRecording,
    formatTime,
    totalDuration,
    containerRef,
    wavesurfer,
    isPlaying,
    wsCurrentTime,
  } = useAudioRecorder(isDark)

  const queryClient = useQueryClient()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!audioUrl) {
      toast.info('No audio recorded yet')
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()

      const file = new File([blob], `voice-record-${Date.now()}.webm`, {
        type: blob.type || 'audio/webm',
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('duration', totalDuration.toString())

      const uploadRes = await fetch('/api/upload-voice-record', {
        method: 'POST',
        body: formData,
      })

      const result = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(result.error || 'Failed to upload audio')
      }

      toast.success('Voice recording saved successfully!')
      queryClient.invalidateQueries({ queryKey: ['voice-records'] })
      resetRecording()
    } catch (error: unknown) {
      console.error('Upload failed:', error)
      const message = error instanceof Error ? error.message : 'Error uploading file'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative mt-4 w-full transition-colors',
        isDragActive ? 'bg-primary/5 border-primary border-2 border-dashed' : 'border-2 border-transparent'
      )}
    >
      <input tabIndex={-1} {...getInputProps()} />
      {isDragActive && (
        <div className='bg-background/80 absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm'>
          <HugeiconsIcon icon={Upload01Icon} className='text-primary mb-4 size-12 animate-bounce' />
          <p className='text-primary text-xl font-semibold'>Drop audio file here</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='relative mx-auto flex w-full max-w-xl min-w-66 flex-col items-center gap-2.5'
      >
        {/* ── TOP CONTROLS & TIMER ───────────────────────────── */}
        {status === 'idle' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group flex h-24 w-24 items-center justify-center'
                  type='button'
                  variant='outline'
                  onClick={startRecording}
                  aria-label='Start recording'
                >
                  <HugeiconsIcon
                    icon={Mic01Icon}
                    className='text-foreground/90 size-8 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-108'
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Click to start recording</TooltipContent>
            </Tooltip>
            <span className='text-foreground/70 font-mono text-sm'>00:00</span>
          </>
        )}

        {status === 'recording' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group flex h-24 w-24 items-center justify-center transition-colors'
                  type='button'
                  variant='outline'
                  onClick={stopRecording}
                  aria-label='Stop recording'
                >
                  <div
                    className='bg-foreground/85 size-8 animate-spin rounded-md transition duration-300 group-hover:scale-108'
                    style={{ animationDuration: '3s' }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop recording</TooltipContent>
            </Tooltip>
            <span className='text-foreground/70 font-mono text-sm'>{formatTime(recordingTime)}</span>
          </>
        )}

        {status === 'recorded' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group flex h-24 w-24 items-center justify-center transition-colors'
                  type='button'
                  variant='outline'
                  onClick={() => wavesurfer?.playPause()}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <HugeiconsIcon icon={PauseIcon} className='text-foreground/90 size-8 transition duration-300' />
                  ) : (
                    <HugeiconsIcon
                      icon={PlayCircle02Icon}
                      className='text-foreground/90 size-8 transition duration-300'
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
            </Tooltip>
            <span className='text-foreground/70 font-mono text-sm'>
              {formatTime(wsCurrentTime)} / {formatTime(totalDuration)}
            </span>
          </>
        )}

        {/* ── COMMON WAVEFORM AREA (Stable DOM Node) ──────────────────────── */}
        <div className='my-2 flex w-full flex-col items-center justify-center'>
          <div ref={containerRef} className={cn('h-14 w-full', status === 'idle' && 'hidden')} />
          {status === 'idle' && (
            <div className='flex h-14 w-full items-center justify-center gap-[3px] overflow-hidden'>
              {[...Array(128)].map((_, i) => (
                <div key={i} className='bg-muted-foreground/70 h-0.5 w-0.5' />
              ))}
            </div>
          )}
        </div>

        {status === 'recorded' && (
          <RecordFilter />
        )}

        {/* ── BOTTOM ACTIONS ───────────────────────────── */}
        {status === 'idle' && (
          <div className='flex h-20 w-full flex-col justify-end gap-2'>
            <p className='text-foreground/70 text-xs'>Click to speak</p>
            <Button type='button' onClick={startRecording} size='lg' aria-label='Start recording'>
              <HugeiconsIcon icon={Mic01Icon} className='size-4' />
              Start Recording
            </Button>
          </div>
        )}

        {status === 'recording' && (
          <div className='flex h-20 w-full flex-col justify-end gap-2'>
            <p className='text-foreground/70 text-xs'>Listening…</p>
            <Button type='button' size='lg' variant='destructive' onClick={stopRecording} className='w-full'>
              <HugeiconsIcon icon={StopCircleIcon} className='size-4' />
              Stop Recording
            </Button>
          </div>
        )}

        {status === 'recorded' && (
          <div className='flex h-20 w-full flex-col justify-end gap-2'>
            <p className='text-foreground/70 h-4 text-xs'>Recording ready</p>
            <div className='flex w-full items-center justify-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={resetRecording}
                size='lg'
                className='flex-1 items-center gap-1.5'
                aria-label='Reset recording'
              >
                <HugeiconsIcon icon={Refresh03Icon} className='size-4' />
                Reset
              </Button>

              <Button
                type='submit'
                disabled={isUploading}
                size='lg'
                className='min-w-30 flex-1 items-center gap-1.5'
                aria-label='Use recording'
              >
                {isUploading ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent bg-transparent' />
                ) : (
                  <>
                    <HugeiconsIcon icon={Check} className='size-4' />
                    Use Audio
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
