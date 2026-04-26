'use client'

import { motion, Variants } from 'motion/react'
import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon, Mic02Icon, SparklesIcon } from '@hugeicons/core-free-icons'
import { Button } from '../ui/button'
import Link from 'next/link'

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
    <section className="relative min-h-[80svh] py-20 w-full flex items-center justify-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col  items-start text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-secondary/70 border border-foreground/10 rounded-full px-3 py-1 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-medium text-secondary-foreground">
                SoundBlog is now in beta
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Turn Your Voice Into <br className="hidden md:block" />
              <span className="">
                Polished Blog Posts
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 max-w-lg mb-8 leading-relaxed"
            >
              Just speak naturally. SoundBlog&apos;s AI transforms your words into
              beautifully written, publish-ready articles in seconds.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mb-8"
            >
              <Button
                asChild
                className="w-max px-8 py-6 rounded-full font-semibold transition-all "
              >
                <Link href={'/sign-in'}>
                  <HugeiconsIcon className="w-5 h-5" icon={Mic02Icon} />
                  <span>Start Speaking</span>
                </Link>
              </Button>

              <Button variant={'secondary'} className="w-max px-8 py-6 rounded-full font-semibold transition-all">
                <span>See Demo</span>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-4 text-sm text-gray-500 font-medium"
            >
              <div className="flex items-center">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className='w-4 h-4 mr-1.5 text-violet-500' />
                No credit card required
              </div>
              <div className="hidden sm:flex items-center">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className='w-4 h-4 mr-1.5 text-violet-500' />
                Free to start
              </div>
              <div className="flex items-center">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className='w-4 h-4 mr-1.5 text-violet-500' />
                1,000 free tokens
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <div className="w-full flex justify-center ">
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
      className="relative w-full max-w-md mx-auto"
    >
      {/* Background Glow */}
      <div className="absolute hidden dark:block -inset-1 bg-linear-to-r from-chart-1 to-chart-3 rounded-2xl blur-xl opacity-20" />

      {/* Main Card */}
      <div className="relative bg-card border border-border rounded-3xl px-7 py-6 overflow-hidden">
        {/* Top Section: Mic & Waveform */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground/70">
            <HugeiconsIcon className="size-5" icon={Mic02Icon} />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute inset-0 rounded-full border border-primary/30"
            />
          </div>

          <div className="flex items-center space-x-1">
            {bars.map((bar, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-linear-to-t from-violet-500 to-blue-400 rounded-full"
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
          <div className="ml-auto flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-600/10 dark:text-emerald-400 dark:bg-emerald-400/10  px-2 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>Recording</span>
          </div>
        </div>

        {/* Middle Section: Transcription */}
        <div className="mb-8 min-h-20">
          <p className="text-base text-card-foreground font-serif leading-relaxed">
            {typedText}
            <motion.span
              animate={{
                opacity: [1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
              }}
              className="inline-block w-1.5 h-4 ml-1 bg-current align-middle"
            />
          </p>
        </div>

        {/* Bottom Section: Polished Output Preview */}
        <div
          className="relative bg-white/3 mb-1 border border-border rounded-2xl p-4"
        >
          <div className="absolute -top-3 left-4 bg-chart-2 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
            <HugeiconsIcon icon={SparklesIcon} className='w-3 h-3' />
            <span>AI Polished</span>
          </div>

          <div className="mt-2">
            <h4 className="font-sans font-semibold text-lg mb-2">
              The Future of Content Creation
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span>Today</span>
              <span>•</span>
              <span>Read 2 min</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-foreground/10 rounded-full w-full" />
              <div className="h-2 bg-foreground/10 rounded-full w-5/6" />
              <div className="h-2 bg-foreground/10 rounded-full w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
