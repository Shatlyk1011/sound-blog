'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Mic01Icon, PauseIcon, PlayCircle02Icon, Refresh03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

type RecordStatus = 'idle' | 'recording' | 'recorded'

const BAR_COUNT = 48

export default function AIVoice() {
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop()
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  /* ── Recording ───────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setStatus('recorded')
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setStatus('recording')
      setRecordingTime(0)
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Microphone error:', err)
      alert('Could not access microphone. Please grant permission and try again.')
    }
  }

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setStatus('idle')
    setAudioUrl(null)
    setRecordingTime(0)
    setPlaybackProgress(0)
    setDuration(0)
    setIsPlaying(false)
  }

  /* ── Playback ────────────────────────────────── */
  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying((prev) => !prev)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      )
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setPlaybackProgress(0)
  }

  /* ── Helpers ─────────────────────────────────── */
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const totalDuration = duration || recordingTime

  const handleSubmit = () => {
    console.log('submit')
  }

  return (
    <div className='w-full py-4'>
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
            <WaveForm isStatic />

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
            <WaveForm/>

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

            <WaveForm isStatic={!isPlaying} containerClasses={cn(!isPlaying && 'items-end')} classes={cn(isPlaying ? 'h-auto' : 'max-h-1 items-end')} />

            <p className='h-4 text-xs text-foreground/70 '>
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
                Re-record
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

const WaveForm = ({ isStatic = false, containerClasses, classes }: { isStatic?: boolean, containerClasses?: string, classes?: string }) => {
  const animations = ['wave1', 'wave2', 'wave3', 'wave4', 'wave5', 'wave6'];

    return (
      <div className={cn('h-4 flex', containerClasses)}>
        <div className={cn('relative flex h-full items-center justify-center gap-0.5 overflow-hidden', classes)}>
          {[...Array(BAR_COUNT)].map((_, i) => {
            const animationName = isStatic ? 'none' : animations[i % animations.length];
            return (
              <div
                key={i}
                className={cn("w-[3px] h-[inherit] bg-muted-foreground/70 origin-bottom",)}
                style={{
                  height: '100%',
                  animationName,
                  animationDuration: `${1 + (i % 6) * 0.15}s`,
                  animationDelay: `-${i * 0.1}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                }}
              />
            );
          })}
        </div>
      </div>
    )
}
