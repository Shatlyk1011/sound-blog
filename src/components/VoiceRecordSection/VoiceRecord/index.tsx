'use client'

import { SubmitEventHandler, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Mic01Icon,
  PauseIcon,
  PlayCircle02Icon,
  Refresh03Icon,
  Sparkle,
  StopCircleIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { FilterValue } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAudioRecorder } from '@/hooks/use-wavesurfer'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import RecordFilter from './RecordFilter'

const idleWaveBars = Array.from({ length: 72 }, () => 6)

export default function VoiceRecord() {
  const { resolvedTheme } = useTheme()

  const [isUploading, setIsUploading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>([])
  const uploadAbortControllerRef = useRef<AbortController | null>(null)

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

  const statusLabel = {
    idle: 'Ready to record',
    recording: 'Recording live',
    recorded: 'Ready to generate',
  }[status]

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (isUploading) return

    if (!audioUrl) {
      toast.info('No audio recorded yet')
      resetRecording()
      return
    }

    if (!Number.isFinite(totalDuration) || totalDuration <= 0) {
      toast.info('Audio is still loading. Please try again in a moment')
      return
    }

    const abortController = new AbortController()
    uploadAbortControllerRef.current = abortController
    setIsUploading(true)

    try {
      const response = await fetch(audioUrl, { signal: abortController.signal })
      const blob = await response.blob()

      const file = new File([blob], `voice-record-${Date.now()}.webm`, {
        type: blob.type || 'audio/webm',
      })

      const uploadRes = await fetch('/api/upload-voice-record/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
        signal: abortController.signal,
      })

      const uploadResult = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadResult.error || 'Failed to prepare audio upload')
      }

      const r2UploadRes = await fetch(uploadResult.file.uploadUrl, {
        method: 'PUT',
        body: file,
        signal: abortController.signal,
      })

      if (!r2UploadRes.ok) {
        throw new Error('Failed to upload audio to storage')
      }

      const processRes = await fetch('/api/upload-voice-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: uploadResult.file.url,
          key: uploadResult.file.key,
          fileName: uploadResult.file.fileName,
          contentType: uploadResult.file.contentType,
          size: uploadResult.file.size,
          duration: totalDuration,
          filters: selectedFilters,
        }),
        signal: abortController.signal,
      })

      const result = await processRes.json()

      if (!processRes.ok) {
        throw new Error(result.error || 'Failed to process audio')
      }

      toast.success('Your recording started processing', {
        richColors: true,
        duration: 8000,
        closeButton: true,
        icon: false,
      })
      queryClient.invalidateQueries({ queryKey: ['voice-records'] })
      resetRecording()
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast.info('Upload canceled')
        return
      }

      console.error('Upload failed:', error)
      const message = error instanceof Error ? error.message : 'Error uploading file'
      toast.error(message)
    } finally {
      uploadAbortControllerRef.current = null
      setIsUploading(false)
    }
  }

  const handleCancelUpload = () => {
    uploadAbortControllerRef.current?.abort()
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-border/70 bg-background/80 relative w-full overflow-hidden rounded-[1.75rem] border p-4 text-left shadow-inner transition-all duration-300 max-sm:p-3',
        isDragActive && 'border-chart-2 bg-chart-2/5 scale-[1.01] border-dashed shadow-[0_0_0_6px_rgba(45,98,239,0.08)]'
      )}
    >
      <input {...getInputProps()} tabIndex={-1} />
      {isDragActive && (
        <div className='bg-background/90 absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[1.75rem] backdrop-blur-md'>
          <div className='bg-chart-2/10 text-chart-2 mb-4 grid size-20 place-items-center rounded-3xl'>
            <HugeiconsIcon icon={Upload01Icon} className='size-10 animate-bounce' />
          </div>
          <p className='text-foreground text-xl font-semibold'>Drop your audio here</p>
          <p className='text-muted-foreground mt-1 text-sm'>We will prepare it for blog generation.</p>
        </div>
      )}

      {isUploading && (
        <div className='bg-background/90 absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[1.75rem] backdrop-blur-md'>
          <div className='relative flex items-center justify-center'>
            <div className='bg-chart-2/10 text-chart-2 grid size-14 place-items-center rounded-2xl'>
              <HugeiconsIcon icon={Upload01Icon} className='size-7 animate-pulse' />
            </div>
          </div>
          <div className='flex gap-1.5'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className='bg-chart-2 size-1.5 animate-bounce rounded-full'
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className='flex flex-col items-center gap-1'>
            <p className='text-foreground text-sm font-medium'>Uploading your recording…</p>
            <p className='text-muted-foreground text-xs'>This may take a moment</p>
          </div>
          <Button type='button' variant='outline' size='sm' className='rounded-xl' onClick={handleCancelUpload}>
            Cancel upload
          </Button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='relative mx-auto flex w-full max-w-2xl min-w-66 flex-col items-center gap-4 border-none'
      >
        <div className='flex w-full items-center justify-between gap-3 rounded-2xl px-1'>
          <div className='flex items-center gap-2'>
            <span
              className={cn(
                'size-2 rounded-full',
                status === 'recording' ? 'bg-destructive animate-pulse' : 'bg-chart-2'
              )}
            />
            <span className='text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase'>{statusLabel}</span>
          </div>
          <span className='bg-muted/70 text-foreground rounded-full px-3 py-1 font-mono text-xs'>
            {status === 'recorded'
              ? `${formatTime(wsCurrentTime)} / ${formatTime(totalDuration)}`
              : formatTime(recordingTime)}
          </span>
        </div>

        {status === 'idle' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group border-border/70 bg-card hover:bg-card hover:border-chart-2/40 relative flex size-30 items-center justify-center rounded-full shadow-[0_18px_45px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)]'
                  type='button'
                  variant='outline'
                  onClick={startRecording}
                  aria-label='Start recording'
                >
                  <HugeiconsIcon
                    icon={Mic01Icon}
                    className='text-foreground/90 size-9 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-108'
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Click to start recording</TooltipContent>
            </Tooltip>
          </>
        )}

        {status === 'recording' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group border-destructive/25 bg-destructive/10 hover:bg-destructive/15 relative flex size-30 items-center justify-center rounded-full shadow-[0_18px_45px_rgba(229,75,79,0.16)]'
                  type='button'
                  variant='outline'
                  onClick={stopRecording}
                  aria-label='Stop recording'
                >
                  <span className='bg-destructive/15 absolute inset-0 animate-ping rounded-full' />
                  <div
                    className='bg-destructive relative size-8 animate-spin rounded-md transition duration-300 group-hover:scale-108'
                    style={{ animationDuration: '3s' }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop recording</TooltipContent>
            </Tooltip>
          </>
        )}

        {status === 'recorded' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='group border-border/70 bg-card hover:bg-card hover:border-chart-2/40 flex size-30 items-center justify-center rounded-full shadow-[0_18px_45px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
                  type='button'
                  variant='outline'
                  onClick={() => wavesurfer?.playPause()}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <HugeiconsIcon icon={PauseIcon} className='text-foreground/90 size-9 transition duration-300' />
                  ) : (
                    <HugeiconsIcon
                      icon={PlayCircle02Icon}
                      className='text-foreground/90 size-9 transition duration-300'
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
            </Tooltip>
          </>
        )}

        <div className='border-border/70 bg-muted/25 flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border px-4 py-3'>
          <div ref={containerRef} className={cn('h-24 w-full', status === 'idle' && 'hidden')} />
          {status === 'idle' && (
            <div className='flex h-24 w-full items-center justify-between gap-1 overflow-hidden'>
              {idleWaveBars.map((height, i) => (
                <div key={i} className='bg-muted-foreground/35 w-1 rounded-full' style={{ height: `${height}px` }} />
              ))}
            </div>
          )}
        </div>

        <div
          hidden={status === 'recorded'}
          className='border-border/70 bg-card/60 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-3 text-center'
        >
          <HugeiconsIcon icon={Upload01Icon} className='text-muted-foreground size-4 shrink-0' />
          <p className='text-muted-foreground text-sm'>
            Drag and drop an audio file here, or use the microphone controls.
          </p>
        </div>

        {status === 'recorded' && (
          <RecordFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        )}

        {status === 'idle' && (
          <div className='flex w-full flex-col justify-end gap-2'>
            <Button
              type='button'
              onClick={startRecording}
              size='lg'
              className='bg-chart-2 hover:bg-chart-2/90 h-13 w-full rounded-2xl text-white shadow-[0_14px_35px_rgba(45,98,239,0.15)]'
              aria-label='Start recording'
            >
              <HugeiconsIcon icon={Mic01Icon} className='size-4' />
              Start Recording
            </Button>
          </div>
        )}

        {status === 'recording' && (
          <div className='flex w-full flex-col justify-end gap-2'>
            <Button
              type='button'
              size='lg'
              variant='destructive'
              onClick={stopRecording}
              className='h-13 w-full rounded-2xl shadow-[0_14px_35px_rgba(229,75,79,0.14)]'
            >
              <HugeiconsIcon icon={StopCircleIcon} className='size-4' />
              Stop Recording
            </Button>
          </div>
        )}

        {status === 'recorded' && (
          <div className='flex w-full flex-col justify-end gap-2'>
            <div className='flex w-full items-center justify-center gap-2 max-sm:flex-col'>
              <Button
                type='button'
                variant='outline'
                onClick={resetRecording}
                size='lg'
                className='h-13 flex-1 items-center gap-1.5 rounded-2xl max-sm:w-full'
                aria-label='Reset recording'
              >
                <HugeiconsIcon icon={Refresh03Icon} className='size-4' />
                Reset
              </Button>

              <Button
                type='submit'
                disabled={isUploading || totalDuration <= 0}
                size='lg'
                className='bg-chart-2 hover:bg-chart-2/90 h-13 min-w-30 flex-1 items-center gap-1.5 rounded-2xl text-white shadow-[0_14px_35px_rgba(45,98,239,0.25)] max-sm:w-full'
                aria-label='Use recording'
              >
                {isUploading ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent bg-transparent' />
                ) : (
                  <>
                    <HugeiconsIcon icon={Sparkle} className='size-4' />
                    Start Generating
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
