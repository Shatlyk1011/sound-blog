import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TTS_VOICE_HEADER_URL } from '@/lib/constants'

export type TTSStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface UseTTSOptions {
  /** The blog document ID — used to persist the TTS URL and invalidate the blog query. */
  blogId?: string
  /** The record ID — used as the React Query key to invalidate after saving the TTS URL. */
  recordId?: string
  /** If the blog already has a TTS voice URL, pass it here to skip the API call. */
  existingTtsUrl?: string | null
}

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

export function useTTS(
  text: string,
  lang: string,
  { blogId, recordId, existingTtsUrl }: UseTTSOptions = {}
): UseTTSReturn {
  const [status, setStatus] = useState<TTSStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const objectUrlRef = useRef<string | null>(null)
  const queryClient = useQueryClient()

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

    // If a pre-generated TTS URL already exists, use it directly
    if (existingTtsUrl) {
      setAudioUrl(existingTtsUrl)
      setStatus('playing')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang, blogId }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'TTS request failed' }))
        throw new Error(json.error ?? 'TTS request failed')
      }

      // If the route persisted the audio to R2, it returns the URL in this header
      const persistedUrl = res.headers.get(TTS_VOICE_HEADER_URL)

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setAudioUrl(url)
      setStatus('playing')

      // Invalidate the blog query so the persisted ttsVoiceUrl is reflected in the UI
      if (persistedUrl && recordId) {
        queryClient.invalidateQueries({ queryKey: ['blog', recordId] })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown TTS error'
      setError(message)
      setStatus('error')
    }
  }, [text, lang, blogId, recordId, existingTtsUrl, queryClient])

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
