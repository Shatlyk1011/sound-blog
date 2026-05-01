'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useWavesurfer as useWavesurferLib } from '@wavesurfer/react';
import { useDropzone } from 'react-dropzone';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

export type RecordStatus = 'idle' | 'recording' | 'recorded'

/* ── Helpers ─────────────────────────────────── */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function useAudioRecorder(isDark: boolean) {
  /* ── Recording state ─────────────────────────────── */
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<number | undefined>()

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
    progressColor: !isDark ? '#23ba7d' : '#49af7e',
    barWidth: 3,
    barGap: 2,
    barRadius: 3,
    barHeight: 3,
    height: 56,
    url: status === 'recorded' && audioUrl ? audioUrl : undefined,
    plugins: useMemo(() => [recordPlugin], [recordPlugin]),
  })

  /* ── Dropzone ─────────────────────────────── */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const url = URL.createObjectURL(file)
        setAudioUrl(url)
        setStatus('recorded')
        setDuration(wavesurfer?.getDuration())
        wavesurfer?.load(url)
      }
    },
    [wavesurfer]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [] },
    maxFiles: 1,
    noClick: true,
    onDropAccepted: async (acceptedFiles) => {
      if (acceptedFiles.length >= 1) {
        const duration = wavesurfer?.getDuration()
        console.log('duration', duration)
      }
    },
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

  /* ── Recording actions ───────────────────────────── */
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
    setStatus('idle')
    setAudioUrl(null)
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
