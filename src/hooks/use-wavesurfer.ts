'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { extensionFromFileName } from '@/app/api/upload-voice-record/_shared'
import { useWavesurfer as useWavesurferLib } from '@wavesurfer/react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

export type RecordStatus = 'idle' | 'recording' | 'recorded'

/* ── Helpers ─────────────────────────────────── */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const getAudioDurationFromUrl = (url: string) =>
  new Promise<number>((resolve, reject) => {
    const audio = document.createElement('audio')

    const cleanup = () => {
      audio.removeAttribute('src')
      audio.load()
    }

    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      const duration = audio.duration
      cleanup()

      if (Number.isFinite(duration) && duration > 0) {
        resolve(duration)
      } else {
        reject(new Error('Could not read audio duration'))
      }
    }
    audio.onerror = () => {
      cleanup()
      reject(new Error('Could not read audio duration'))
    }
    audio.src = url
  })

export function useAudioRecorder(isDark: boolean) {
  /* ── Recording state ─────────────────────────────── */
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | undefined>()
  const latestAudioUrlRef = useRef<string | null>(null)

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── WaveSurfer + RecordPlugin ───────────────────── */
  const containerRef = useRef<HTMLDivElement>(null)

  const recordPlugin = useMemo(
    () =>
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      }),
    []
  )

  const {
    wavesurfer,
    isPlaying,
    currentTime: wsCurrentTime,
  } = useWavesurferLib({
    container: containerRef,
    waveColor: isDark ? '#eee' : '#808080',
    progressColor: !isDark ? '#4393e1' : '#5194d5',
    barWidth: 3,
    barGap: 2,
    barRadius: 3,
    barHeight: 3,
    height: 96,
    url: status === 'recorded' && audioUrl ? audioUrl : undefined,
    plugins: useMemo(() => [recordPlugin], [recordPlugin]),
  })

  /* ── Dropzone ─────────────────────────────── */
  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: File[], fileRejections: any[]) => {
      const allFiles = [...acceptedFiles, ...fileRejections.map((r) => r.file)]
      if (allFiles.length > 0) {
        const file = allFiles[0] as File
        const supportedFormats = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
        const fileExtension = file.name.split('.').pop()?.toLowerCase()

        if (!fileExtension || !supportedFormats.includes(fileExtension)) {
          toast.error(
            `Invalid file format. Supported formats: ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']`
          )
          return
        }

        const url = URL.createObjectURL(file)
        latestAudioUrlRef.current = url
        setAudioUrl(url)
        setAudioFile(file)
        setRecordingTime(0)
        setStatus('recorded')
        wavesurfer?.load(url)

        try {
          const fileDuration = await getAudioDurationFromUrl(url)
          if (latestAudioUrlRef.current === url) {
            setDuration(fileDuration)
          } else {
            setDuration(undefined)
          }
        } catch (err) {
          console.error('Audio duration error:', err)
        }
      }
    },
    [wavesurfer]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/flac': ['.flac'],
      'audio/x-flac': ['.flac'],
      'audio/m4a': ['.m4a'],
      'audio/x-m4a': ['.m4a'],
      'audio/mp3': ['.mp3'],
      'audio/mpeg': ['.mp3', '.mpeg', '.mpga'],
      'audio/mp4': ['.mp4', '.m4a'],
      'audio/ogg': ['.ogg', '.oga'],
      'audio/wav': ['.wav'],
      'audio/x-wav': ['.wav'],
      'audio/webm': ['.webm'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  })

  /* ── Cleanup on unmount ─────────────────────────── */
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  useEffect(() => {
    if (!wavesurfer) return

    return wavesurfer.on('ready', (loadedDuration) => {
      if (Number.isFinite(loadedDuration) && loadedDuration > 0) {
        setDuration(loadedDuration)
      }
    })
  }, [wavesurfer])

  /* ── Recording actions ───────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: `audio/webm` })
        const fileObj = new File([blob], `voice-record-${Date.now()}.webm`, {
          type: 'audio/webm',
        })
        const url = URL.createObjectURL(blob)
        latestAudioUrlRef.current = url
        setAudioUrl(url)
        setAudioFile(fileObj)
        setDuration(undefined)
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    latestAudioUrlRef.current = null
    setStatus('idle')
    setAudioUrl(null)
    setAudioFile(null)
    setRecordingTime(0)
    setDuration(0)
  }

  const totalDuration = duration || recordingTime

  /* Start / stop mic alongside recording status */
  useEffect(() => {
    if (status === 'recording') {
      recordPlugin.startMic()
    } else {
      recordPlugin.stopMic()
    }
  }, [status, recordPlugin])

  return {
    // recording state
    status,
    recordingTime,
    audioUrl,
    audioFile,
    totalDuration,
    formatTime,
    // actions
    startRecording,
    stopRecording,
    resetRecording,
    // dropzone
    getRootProps,
    getInputProps,
    isDragActive,
    // wavesurfer
    containerRef,
    wavesurfer,
    isPlaying,
    wsCurrentTime,
  }
}
