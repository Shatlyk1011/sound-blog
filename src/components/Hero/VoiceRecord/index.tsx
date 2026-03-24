'use client'

import { Check, Mic01Icon, PauseIcon, PlayCircle02Icon, Refresh03Icon, Upload01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import SoundWave from './SoundWave'
import { useState } from 'react'

const TabItems = [
  {
    title: 'Record',
    value: 'record'
  }, 
  {
    title: 'Upload',
    value: 'upload'
  }
]

export default function VoiceRecord() {
  const [tab, setTab] = useState<'record' | 'upload'>('record')

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
          <Tabs defaultValue="record" onValueChange={(value) => setTab(value as 'record' | 'upload')} className="w-full flex flex-col items-center">
            <TabsList className="mb-4 w-48" >
              {TabItems.map(({title, value}) => (
                <TabsTrigger key={value} disabled={status !== 'idle'} value={value} className={cn(tab === value ? 'text-foreground! ' : 'text-foreground/60! hover:text-foreground! ')}>{title}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent  value="record" className="w-full flex flex-col items-center gap-2.5">
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
            </TabsContent>

            <TabsContent data-active={tab === 'upload'} value="upload" className="w-full flex flex-col items-center gap-2.5">
              <div 
                {...getRootProps()} 
                className={cn(
                  "flex flex-col items-center justify-center w-full max-w-sm h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors px-6 text-center",
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <input {...getInputProps()} />
                <HugeiconsIcon icon={Upload01Icon} className="size-8 text-muted-foreground mb-3" />
                <p className="text-sm text-foreground/80 font-medium">
                  {isDragActive ? "Drop audio file here..." : "Drag & drop audio here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            </TabsContent>
          </Tabs>
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
            <SoundWave/>

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

