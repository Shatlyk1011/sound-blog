'use client'

import { useEffect, useState } from 'react'
import {
  CheckmarkCircle01Icon,
  Mic02Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion, Variants } from 'motion/react'
import Link from 'next/link'
import { Button } from '../ui/button'

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const bars = [
  {
    height: 12,
    duration: 1,
  },
  {
    height: 24,
    duration: 0.8,
  },
  {
    height: 16,
    duration: 0.9,
  },
  {
    height: 32,
    duration: 1,
  },
  {
    height: 20,
    duration: 0.8,
  },
  {
    height: 28,
    duration: 0.8,
  },
  {
    height: 14,
    duration: 0.5,
  },

  {
    height: 24,
    duration: 1.3,
  },
]

export default function Hero() {
  // Staggered animation variants

  return (
    <section className='relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden py-20'>
      <div className='relative z-10 container mx-auto max-w-7xl px-6'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='flex flex-col items-start text-left'
          >
            <motion.div
              variants={itemVariants}
              className='bg-secondary/70 border-foreground/10 mb-6 inline-flex items-center space-x-2 rounded-full border px-3 py-1'
            >
              <span className='flex h-2 w-2 animate-pulse rounded-full bg-violet-500' />
              <span className='text-secondary-foreground text-xs font-medium'>
                SoundBlog is now in beta
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className='font-heading mb-6 text-6xl leading-[1.1] font-extrabold tracking-tight'
            >
              Turn Your Voice Into <br className='hidden md:block' />
              <span className=''>Polished Blog Posts</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className='mb-8 max-w-lg text-lg leading-relaxed text-gray-400 md:text-xl'
            >
              Just speak naturally. SoundBlog&apos;s AI transforms your words
              into beautifully written, publish-ready articles in seconds.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='mb-8 flex w-full flex-col items-center space-y-4 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4'
            >
              <Button
                asChild
                className='w-max rounded-full px-8 py-6 font-semibold transition-all'
              >
                <Link href={'/sign-in'}>
                  <HugeiconsIcon className='h-5 w-5' icon={Mic02Icon} />
                  <span>Start Speaking</span>
                </Link>
              </Button>

              <Button
                asChild
                variant={'secondary'}
                className='w-max rounded-full px-8 py-6 font-semibold transition-all'
              >
                <a href='#demo'>
                  <span>See Demo</span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='flex items-center space-x-4 text-sm font-medium text-gray-500'
            >
              <div className='flex items-center'>
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className='mr-1.5 h-4 w-4 text-violet-500'
                />
                No credit card required
              </div>
              <div className='hidden items-center sm:flex'>
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className='mr-1.5 h-4 w-4 text-violet-500'
                />
                Free to start
              </div>
              <div className='flex items-center'>
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className='mr-1.5 h-4 w-4 text-violet-500'
                />
                1,000 free tokens
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <div className='flex w-full justify-center'>
            <WaveformVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

export function WaveformVisual() {
  const [typedText, setTypedText] = useState('')
  const fullText =
    'The future of content creation is here. Instead of staring at a blank page, just speak your thoughts and let AI do the rest...'
  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)
    return () => clearInterval(typingInterval)
  }, [])
  // Waveform bar heights and animation durations

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        delay: 0.2,
      }}
      className='relative mx-auto w-full max-w-md'
    >
      {/* Background Glow */}
      <div className='from-chart-1 to-chart-3 absolute -inset-1 hidden rounded-2xl bg-linear-to-r opacity-20 blur-xl dark:block' />

      {/* Main Card */}
      <div className='bg-card border-border relative overflow-hidden rounded-3xl border px-7 py-6'>
        {/* Top Section: Mic & Waveform */}
        <div className='border-border mb-6 flex items-center space-x-4 border-b pb-6'>
          <div className='bg-primary text-primary-foreground/70 relative flex h-12 w-12 items-center justify-center rounded-full'>
            <HugeiconsIcon className='size-5' icon={Mic02Icon} />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className='border-primary/30 absolute inset-0 rounded-full border'
            />
          </div>

          <div className='flex items-center space-x-1'>
            {bars.map((bar, i) => (
              <motion.div
                key={i}
                className='w-1.5 rounded-full bg-linear-to-t from-violet-500 to-blue-400'
                animate={{
                  height: [8, bar.height, 8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: bar.duration,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          <div className='ml-auto flex items-center space-x-2 rounded-full bg-emerald-600/10 px-2 py-1 text-xs text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-current' />
            <span>Recording</span>
          </div>
        </div>

        {/* Middle Section: Transcription */}
        <div className='mb-8 min-h-20'>
          <p className='text-card-foreground font-serif text-base leading-relaxed'>
            {typedText}
            <motion.span
              animate={{
                opacity: [1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
              }}
              className='ml-1 inline-block h-4 w-1.5 bg-current align-middle'
            />
          </p>
        </div>

        {/* Bottom Section: Polished Output Preview */}
        <div className='border-border relative mb-1 rounded-2xl border bg-white/3 p-4'>
          <div className='bg-chart-2 text-primary-foreground absolute -top-3 left-4 flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg'>
            <HugeiconsIcon icon={SparklesIcon} className='h-3 w-3' />
            <span>AI Polished</span>
          </div>

          <div className='mt-2'>
            <h4 className='mb-2 font-sans text-lg font-semibold'>
              The Future of Content Creation
            </h4>
            <div className='mb-3 flex items-center gap-2 text-xs text-gray-500'>
              <span>Today</span>
              <span>•</span>
              <span>Read 2 min</span>
            </div>
            <div className='space-y-2'>
              <div className='bg-foreground/10 h-2 w-full rounded-full' />
              <div className='bg-foreground/10 h-2 w-5/6 rounded-full' />
              <div className='bg-foreground/10 h-2 w-4/6 rounded-full' />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
