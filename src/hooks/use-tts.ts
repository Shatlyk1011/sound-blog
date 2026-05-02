import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export type TTSStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface UseTTSReturn {
  status: TTSStatus
  progress: number // 0–1
  duration: number // seconds
  currentTime: number // seconds
  audioUrl: string | null
  play: () => void
  pause: () => void
  toggle: () => void
  stop: () => void
  error: string | null
}

export function useTTS(text: string, lang: string): UseTTSReturn {
  const [status, setStatus] = useState<TTSStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const objectUrlRef = useRef<string | null>(null)

  // Clean up object URL and audio when unmounting or text changes
  const cleanup = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setStatus('idle')
    setProgress(0)
    setDuration(0)
    setCurrentTime(0)
    setAudioUrl(null)
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
        body: JSON.stringify({ text, lang }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'TTS request failed' }))
        throw new Error(json.error ?? 'TTS request failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setAudioUrl(url)

      setStatus('playing')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown TTS error'
      setError(message)
      setStatus('error')
    }
  }, [text, lang])

  const play = useCallback(() => {
    if (status === 'idle' || status === 'error') {
      fetchAndPlay()
    } else if (status === 'paused') {
      setStatus('playing')
    }
  }, [status, fetchAndPlay])

  const pause = useCallback(() => {
    if (status === 'playing') {
      setStatus('paused')
    }
  }, [status])

  const toggle = useCallback(() => {
    if (status === 'loading') {
      toast.info('Please wait. Loading audio', { richColors: true })
      return
    }
    if (status === 'playing') {
      pause()
    } else {
      play()
    }
  }, [status, play, pause])

  const stop = useCallback(() => {
    cleanup()
  }, [cleanup])

  return { status, progress, duration, currentTime, audioUrl, play, pause, toggle, stop, error }
}
