import { useCallback, useEffect, useRef, useState } from 'react'

export type TTSStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface UseTTSReturn {
  status: TTSStatus
  progress: number // 0–1
  duration: number // seconds
  currentTime: number // seconds
  play: () => void
  pause: () => void
  toggle: () => void
  stop: () => void
  error: string | null
}

export function useTTS(text: string): UseTTSReturn {
  const [status, setStatus] = useState<TTSStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Clean up object URL and audio when unmounting or text changes
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setStatus('idle')
    setProgress(0)
    setDuration(0)
    setCurrentTime(0)
    setError(null)
  }, [])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup, text])

  const fetchAndPlay = useCallback(async () => {
    if (!text.trim()) return

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'TTS request failed' }))
        throw new Error(json.error ?? 'TTS request failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
        setProgress(audio.duration > 0 ? audio.currentTime / audio.duration : 0)
      })

      audio.addEventListener('ended', () => {
        setStatus('idle')
        setProgress(0)
        setCurrentTime(0)
      })

      audio.addEventListener('error', () => {
        setError('Audio playback error')
        setStatus('error')
      })

      await audio.play()
      setStatus('playing')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown TTS error'
      setError(message)
      setStatus('error')
    }
  }, [text])

  const play = useCallback(() => {
    if (status === 'idle' || status === 'error') {
      fetchAndPlay()
    } else if (status === 'paused' && audioRef.current) {
      audioRef.current.play()
      setStatus('playing')
    }
  }, [status, fetchAndPlay])

  const pause = useCallback(() => {
    if (status === 'playing' && audioRef.current) {
      audioRef.current.pause()
      setStatus('paused')
    }
  }, [status])

  const toggle = useCallback(() => {
    if (status === 'playing') {
      pause()
    } else {
      play()
    }
  }, [status, play, pause])

  const stop = useCallback(() => {
    cleanup()
  }, [cleanup])

  return { status, progress, duration, currentTime, play, pause, toggle, stop, error }
}
