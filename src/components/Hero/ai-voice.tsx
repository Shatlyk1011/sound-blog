'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckmarkSquare01Icon, Mic01Icon, PauseIcon, PlayCircle02Icon, Rotate01Icon, SquareIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  console.log('render')

  return (
    <div className='w-full py-4'>
      <div className='relative mx-auto flex w-full max-w-xl flex-col items-center gap-2'>

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
            <button
              className='group flex h-16 w-16 items-center justify-center rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              type='button'
              onClick={startRecording}
              aria-label='Start recording'
            >
              <HugeiconsIcon
                icon={Mic01Icon}
                className='h-6 w-6 text-black/90 dark:text-white/90 transition-transform group-hover:scale-110'
              />
            </button>

            {/* Static flat waveform */}
            <span className='font-mono text-sm text-black/30 dark:text-white/30'>
              00:00
            </span>
            <div className='flex h-4 w-64 items-center justify-center gap-0.5'>
              {[...Array(BAR_COUNT)].map((_, i) => (
                <div
                  key={i}
                  className='h-1 w-0.5 rounded-full bg-black/10 dark:bg-white/10'
                />
              ))}
            </div>
            <p className='h-4 text-xs text-black/30 dark:text-white/30'>
              Click to speak
            </p>
          </>
        )}

        {/* ── RECORDING ──────────────────────── */}
        {status === 'recording' && (
          <>
            {/* Pulsing stop button */}
            <button
              className='flex h-16 w-16 items-center justify-center rounded-xl transition-colors'
              type='button'
              onClick={stopRecording}
              aria-label='Stop recording'
            >
              <div
                className='h-6 w-6 animate-spin rounded-sm bg-black dark:bg-white'
                style={{ animationDuration: '3s' }}
              />
            </button>

            {/* Live timer */}
            <span className='font-mono text-sm text-black/70 dark:text-white/70'>
              {formatTime(recordingTime)}
            </span>

            {/* Animated waveform bars */}
            <WaveForm/>


            <p className='h-4 text-xs text-black/70 dark:text-white/70'>
              Listening…
            </p>

            {/* Stop button */}
            <button
              type='button'
              onClick={stopRecording}
              className='mt-3 flex items-center gap-1.5 rounded-lg border border-black/20 dark:border-white/20 px-4 py-1.5 text-xs font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
            >
            <HugeiconsIcon icon={SquareIcon} className='h-3 w-3 fill-current' />
              Stop Recording
            </button>
          </>
        )}

        {/* ── RECORDED ───────────────────────── */}
        {status === 'recorded' && (
          <>
            {/* Play / Pause button */}
            <button
              className='flex h-16 w-16 items-center justify-center rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              type='button'
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <HugeiconsIcon icon={PauseIcon} className='h-6 w-6 text-black/90 dark:text-white/90' />
              ) : (
                <HugeiconsIcon icon={PlayCircle02Icon} className='h-6 w-6 text-black/90 dark:text-white/90' />
              )}
            </button>

            {/* Playback timer */}
            <span className='font-mono text-sm text-black/70 dark:text-white/70'>
              {formatTime(
                (playbackProgress / 100) * totalDuration,
              )}{' '}
              /{' '}
              {formatTime(totalDuration)}
            </span>

            <p className='h-4 text-xs text-black/70 dark:text-white/70'>
              Recording ready
            </p>

            {/* Actions */}
            <div className='mt-3 flex items-center gap-3'>
              <button
                type='button'
                onClick={resetRecording}
                className='flex items-center gap-1.5 rounded-lg border border-black/20 dark:border-white/20 px-4 py-1.5 text-xs font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
              >
                <HugeiconsIcon icon={Rotate01Icon} className='h-3 w-3'/>
                Re-record
              </button>
              <button
                type='button'
                className='flex items-center gap-1.5 rounded-lg bg-black dark:bg-white px-4 py-1.5 text-xs font-medium text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-colors'
              >
                <HugeiconsIcon icon={CheckmarkSquare01Icon} className='h-3 w-3' />
                Use Audio
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

const WaveForm = () => {
  const animations = ['wave1', 'wave2', 'wave3', 'wave4', 'wave5', 'wave6'];

    return (
      <div className='relative flex h-4 w-64 items-center justify-center gap-0.5 overflow-hidden'>
        {[...Array(BAR_COUNT)].map((_, i) => {
          const animationName = animations[i % animations.length];

          return (
            <div
              key={i}
              className="w-0.5 bg-black/70 dark:bg-white/70 origin-bottom"
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
    )
}

// "use client";

// /**
//  * @author: @kokonutui
//  * @description: AI Voice
//  * @version: 1.0.0
//  * @date: 2025-06-26
//  * @license: MIT
//  * @website: https://kokonutui.com
//  * @github: https://github.com/kokonut-labs/kokonutui
//  */

// import { Mic } from "lucide-react";
// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";

// export default function AI_Voice() {
//     const [submitted, setSubmitted] = useState(false);
//     const [time, setTime] = useState(0);
//     const [isClient, setIsClient] = useState(false);
//     const [isDemo, setIsDemo] = useState(true);

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     useEffect(() => {
//         let intervalId: NodeJS.Timeout;

//         if (submitted) {
//             intervalId = setInterval(() => {
//                 setTime((t) => t + 1);
//             }, 1000);
//         } else {
//             setTime(0);
//         }

//         return () => clearInterval(intervalId);
//     }, [submitted]);

//     const formatTime = (seconds: number) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, "0")}:${secs
//             .toString()
//             .padStart(2, "0")}`;
//     };

//     /**
//      * Remove that, only used for demo
//      */
//     useEffect(() => {
//         if (!isDemo) return;

//         let timeoutId: NodeJS.Timeout;
//         const runAnimation = () => {
//             setSubmitted(true);
//             timeoutId = setTimeout(() => {
//                 setSubmitted(false);
//                 timeoutId = setTimeout(runAnimation, 1000);
//             }, 3000);
//         };

//         const initialTimeout = setTimeout(runAnimation, 100);
//         return () => {
//             clearTimeout(timeoutId);
//             clearTimeout(initialTimeout);
//         };
//     }, [isDemo]);

//     const handleClick = () => {
//         if (isDemo) {
//             setIsDemo(false);
//             setSubmitted(false);
//         } else {
//             setSubmitted((prev) => !prev);
//         }
//     };

//     return (
//         <div className="w-full py-4">
//             <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
//                 <button
//                     className={cn(
//                         "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
//                         submitted
//                             ? "bg-none"
//                             : "bg-none hover:bg-black/5 dark:hover:bg-white/5"
//                     )}
//                     type="button"
//                     onClick={handleClick}
//                 >
//                     {submitted ? (
//                         <div
//                             className="w-6 h-6 rounded-sm animate-spin bg-black  dark:bg-white cursor-pointer pointer-events-auto"
//                             style={{ animationDuration: "3s" }}
//                         />
//                     ) : (
//                         <Mic className="w-6 h-6 text-black/90 dark:text-white/90" />
//                     )}
//                 </button>

//                 <span
//                     className={cn(
//                         "font-mono text-sm transition-opacity duration-300",
//                         submitted
//                             ? "text-black/70 dark:text-white/70"
//                             : "text-black/30 dark:text-white/30"
//                     )}
//                 >
//                     {formatTime(time)}
//                 </span>

//                 <div className="h-4 w-64 flex items-center justify-center gap-0.5">
//                     {[...Array(48)].map((_, i) => (
//                         <div
//                             key={i}
//                             className={cn(
//                                 "w-0.5 rounded-full transition-all duration-300",
//                                 submitted
//                                     ? "bg-black/50 dark:bg-white/50 animate-pulse"
//                                     : "bg-black/10 dark:bg-white/10 h-1"
//                             )}
//                             style={
//                                 submitted && isClient
//                                     ? {
//                                           height: `${20 + Math.random() * 80}%`,
//                                           animationDelay: `${i * 0.05}s`,
//                                       }
//                                     : undefined
//                             }
//                         />
//                     ))}
//                 </div>

//                 <p className="h-4 text-xs text-black/70 dark:text-white/70">
//                     {submitted ? "Listening..." : "Click to speak"}
//                 </p>
//             </div>
//         </div>
//     );
// }
