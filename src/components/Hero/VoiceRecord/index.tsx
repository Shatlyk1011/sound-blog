'use client'

import { Check, Mic01Icon, PauseIcon, PlayCircle02Icon, Refresh03Icon, Upload01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import SoundWave from './SoundWave'
import { SubmitEventHandler } from 'react'

export default function VoiceRecord() {
  const {
    status,
    recordingTime,
    audioUrl,
    isPlaying,
    playbackProgress,
    audioRef,
    getRootProps,
    getInputProps,
    isDragActive,
    startRecording,
    stopRecording,
    resetRecording,
    togglePlayback,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    formatTime,
    totalDuration
  } = useAudioRecorder()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit')
    console.log('audioUrl', audioUrl)
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full py-4 relative rounded-xl transition-colors',
        isDragActive ? 'bg-primary/5 border-2 border-dashed border-primary' : 'border-2 border-transparent'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 rounded-xl">
          <HugeiconsIcon icon={Upload01Icon} className="size-12 text-primary mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-primary">Drop audio file here</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className='relative mx-auto flex w-full max-w-xl flex-col items-center gap-2.5'>

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className='hidden'
          />
        )}

        {/* ── IDLE ───────────────────────────── */}
            {status === 'idle' && (
              <>
                <Button
                  className='group flex h-20 w-20 items-center justify-center transition-colors '
                  type='button'
                  variant="outline"
                  onClick={startRecording}
                  aria-label='Start recording'
                >
                  <HugeiconsIcon
                    icon={Mic01Icon}
                    className='size-6 text-foreground/90 group-hover:scale-108 group-hover:-translate-y-0.5 transition duration-300'
                  />
                </Button>

                <span className='font-mono text-sm text-foreground/70'>
                  00:00
                </span>

                {/* Static flat waveform */}
                <SoundWave isStatic />

                <p className='text-xs text-foreground/70'>
                  Click to speak
                </p>

                <Button
                  type='button'
                  onClick={startRecording}
                  variant="secondary"
                  aria-label='Start recording'
                >
                  Start Recording
                </Button>
              </>
            )}

            {/* ── RECORDING ──────────────────────── */}
            {status === 'recording' && (
              <>
                {/* Pulsing stop button */}
                <Button
                  className='group flex h-20 w-20 items-center justify-center transition-colors '
                  type='button'
                  variant="outline"
                  onClick={stopRecording}
                  aria-label='Stop recording'
                >
                  <div
                    className='h-6 w-6 bg-foreground/85 rounded-md animate-spin group-hover:scale-108 transition duration-300'
                    style={{ animationDuration: '3s' }}
                  />
                </Button>

                {/* Live timer */}
                <span className='font-mono text-sm text-foreground/70'>
                  {formatTime(recordingTime)}
                </span>

                {/* Animated waveform bars */}
                <SoundWave />

                <p className='text-xs text-foreground/70 '>
                  Listening…
                </p>

                {/* Stop button */}
                <Button
                  type='button'
                  variant="destructive"
                  onClick={stopRecording}
                >
                  Stop Recording
                </Button>
              </>
            )}

            {/* ── RECORDED ───────────────────────── */}
            {status === 'recorded' && (
              <>
            {/* Play / Pause button */}
            <Button
              className='group flex h-20 w-20 items-center justify-center transition-colors '
              type='button'
              variant="outline"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <HugeiconsIcon icon={PauseIcon} className='size-6 text-foreground/90 transition duration-300' />
              ) : (
                      <HugeiconsIcon icon={PlayCircle02Icon} className='size-6 text-foreground/90 transition duration-300' />
              )}
            </Button>

            {/* Playback timer */}
            <span className='font-mono text-sm text-foreground/70'>
              {formatTime(
                (playbackProgress / 100) * totalDuration,
              )}{' '}
              /{' '}
              {formatTime(totalDuration)}
            </span>

            <SoundWave isStatic={!isPlaying} containerClasses={cn(!isPlaying && 'items-end')} classes={cn(isPlaying ? 'h-auto' : 'max-h-1 items-end')} />

                <p className='h-4 text-xs text-foreground/70'>
              Recording ready
            </p>

            {/* Actions */}
            <div className='flex items-center gap-3'>
              <Button
                type='button'
                variant="outline"
                onClick={resetRecording}
                className='flex items-center gap-1.5'
                aria-label='Reset recording'
              >
                <HugeiconsIcon icon={Refresh03Icon} className='size-4' />
                Reset
              </Button>

              <Button
                type='submit'
                className='flex items-center gap-1.5'
                aria-label='Use recording'
              >
                <HugeiconsIcon icon={Check} className='size-4' />
                Use Audio
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
