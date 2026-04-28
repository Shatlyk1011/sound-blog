'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Blog, Transcript, VoiceRecord } from '@/payload-types'
import { Close, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, Transition } from 'motion/react'
import { motion } from 'motion/react'
import { stringify } from 'qs-esm'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'
import { ActionBar } from './ui/ActionBar'
import TabSwitcher from './ui/TabSwitch'

interface RecordClientProps {
  recordId: string
}

const animationVariants = {
  hidden: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export function RecordClient({ recordId }: RecordClientProps) {
  const [showOriginalAudio, setShowOriginalAudio] = useState(false)
  const [activeTab, setActiveTab] = useState<'generated' | 'raw'>('generated')

  const stringifiedQuery = stringify(
    {
      where: { recordId: { equals: recordId } },
      depth: 1,
      limit: 1,
    },
    { addQueryPrefix: true }
  )

  const {
    data: blogsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', recordId],
    queryFn: async () => {
      const res = await fetch(`/api/blogs${stringifiedQuery}`)
      if (!res.ok) {
        throw new Error('Failed to fetch blog')
      }
      return res.json()
    },
  })

  const blog: Blog = blogsData?.docs?.[0]

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
    toast.success('Blog copied successfully!', { position: 'top-center' })
  }

  return (
    <section className='gap-6 px-4'>
      {isLoading && (
        <div className='text-muted-foreground flex items-center gap-2 text-center'>
          <HugeiconsIcon
            icon={Loading03Icon}
            className='animate-spin duration-2000'
          />
          <p>Loading blog...</p>
        </div>
      )}

      {error && (
        <div className='text-destructive'>
          Error loading blog: {(error as Error).message}
        </div>
      )}

      {blog && (
        <>
          <h1 className='text-5xl leading-[130%] font-bold tracking-tight'>
            {blog.title}
          </h1>

          <div className='flex min-h-20 items-start justify-between'>
            <div className='flex items-center text-sm font-medium'>
              <ul className='flex items-center gap-2 py-4'>
                {blog.tone && (
                  <Badge variant={'outline'}>Tone: {blog.tone}</Badge>
                )}
              </ul>
              <span className='mx-2 text-lg'>•</span>
              <time className='text-muted-foreground' dateTime={blog.createdAt}>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'long',
                }).format(new Date(blog.createdAt))}
              </time>
            </div>

            <div className='flex flex-col'>
              {!showOriginalAudio ? (
                <Button
                  variant={'outline'}
                  size='sm'
                  onClick={() => setShowOriginalAudio(true)}
                  className='text-xs font-medium'
                >
                  Show original audio
                </Button>
              ) : (
                <div className='relative w-full'>
                  <MiniAudioPlayer
                    classes='border border-border w-64 '
                    fileUrl={(blog.recordId as VoiceRecord).fileUrl}
                  />
                  <button
                    onClick={() => setShowOriginalAudio(false)}
                    className='bg-muted text-muted-foreground/60 absolute -top-2 -right-2 rounded-full p-0.5'
                  >
                    <HugeiconsIcon icon={Close} size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='w-full'>
            <ActionBar handleCopy={() => handleCopy(blog.content!)} />
          </div>

          <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />

          <article className='bg-card w-full rounded-3xl border p-8 text-left shadow-sm'>
            <AnimatePresence mode='wait'>
              {activeTab === 'generated' ? (
                <motion.div
                  key='generated'
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={animationVariants}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <div className='prose prose-sm sm:prose-base dark:prose- max-w-none font-serif'>
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key='raw'
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={animationVariants}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <p>{(blog.transcriptId as Transcript).rawText}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        </>
      )}

      {!isLoading && !blog && !error && (
        <div className='bg-card w-full max-w-3xl rounded-xl border p-8 text-center shadow-sm'>
          <p className='text-muted-foreground'>
            No blog found for this record yet. The AI might still be processing
            it.
          </p>
        </div>
      )}
    </section>
  )
}
