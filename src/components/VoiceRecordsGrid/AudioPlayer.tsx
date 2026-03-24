'use client'
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useRef, useState } from "react"

function MiniAudioPlayer({ fileUrl }: { fileUrl?: string }) {
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
      className="flex flex-col gap-2 mt-2 mb-3 w-full bg-card rounded-2xl p-3 border border-border/50"
    >
      <audio ref={audioRef} src={fileUrl} preload="metadata" />
      
      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full dark:bg-accent bg-accent-foreground/80 border text-accent/80 dark:text-accent-foreground active:scale-95 transition-all shadow-sm"
        >
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} className="size-4" />
        </button>

        <div className="flex flex-col grow gap-1.5 pt-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="w-full h-1.5 bg-input rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 dark:[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:bg-accent-foreground [&::-webkit-slider-thumb]:rounded-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniAudioPlayer