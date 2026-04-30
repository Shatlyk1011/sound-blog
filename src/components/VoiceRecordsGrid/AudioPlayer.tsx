'use client'
import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'

interface Props {
  fileUrl: string
  classes?: string
}

function MiniAudioPlayer({ fileUrl, classes }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioRef.current || !fileUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!fileUrl) return null

  return (
    <div
      className={cn('bg-card border-border/50 mt-2 mb-3 flex w-full flex-col gap-2 rounded-2xl border p-3', classes)}
    >
      <audio ref={audioRef} src={fileUrl} preload='metadata' />

      <div className='flex items-center gap-3'>
        <button
          onClick={togglePlay}
          className='dark:bg-accent bg-accent-foreground/80 text-accent/80 dark:text-accent-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95'
        >
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} className='size-4' />
        </button>

        <div className='flex grow flex-col gap-1.5 pt-1'>
          <input
            type='range'
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => {
              e.stopPropagation()
            }}
            className='bg-input accent-primary hover:accent-primary/80 dark:[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:bg-accent-foreground h-1.5 w-full cursor-pointer appearance-none rounded-full transition-all [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full'
          />
          <div className='text-muted-foreground flex justify-between px-0.5 text-[11px] font-medium'>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniAudioPlayer
