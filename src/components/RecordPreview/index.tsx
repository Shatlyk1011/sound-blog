'use client'

import { useState } from 'react'
import BlogMetadata from '@/app/(frontend)/(dashboard)/record/[id]/ui/BlogMetadata'
import TabSwitcher, { type TabVariants } from '@/app/(frontend)/(dashboard)/record/[id]/ui/TabSwitch'
import TextReader from '@/app/(frontend)/(dashboard)/record/[id]/ui/TextReader'
import { Blog, Transcript, VoiceRecord } from '@/payload-types'
import { ArrowLeft01Icon, BookOpenTextIcon, CopyIcon, FileAudioIcon, Sparkle } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'

interface RecordPreviewProps {
  blog: Blog
  backHref: string
  backLabel: string
  badge?: string
}

const animationVariants = {
  hidden: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export default function RecordPreview({ blog, backHref, backLabel, badge }: RecordPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabVariants>('generated')

  const voiceRecord = blog.recordId as VoiceRecord | undefined
  const transcript = blog.transcriptId as Transcript | undefined

  const handleCopy = async () => {
    await copyToClipboard(blog.content || '')
    toast.success('Article copied successfully!', { position: 'top-center' })
  }

  return (
    <section className='space-y-6'>
      <div className='border-border/70 bg-card/80 relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur max-sm:p-4'>
        <div className='relative'>
          <Button asChild variant='ghost' size='sm' className='mb-9 rounded-full'>
            <Link href={backHref} className='-ml-2'>
              <HugeiconsIcon icon={ArrowLeft01Icon} className='size-4' />
              {backLabel}
            </Link>
          </Button>

          {badge && (
            <span className='bg-chart-1/15 text-foreground absolute top-0 right-0 rounded-full px-3 py-1 text-xs font-semibold'>
              {badge}
            </span>
          )}

          <div className='max-w-4xl'>
            <h1 className='min-h-15 text-5xl leading-[115%] font-bold tracking-tight max-lg:text-4xl max-sm:text-3xl'>
              {blog.title}
            </h1>
          </div>

          <BlogMetadata createdAt={blog.createdAt} filters={voiceRecord?.filters} />
        </div>
      </div>

      <div className='border-border/70 bg-card/80 overflow-hidden rounded-4xl border shadow-sm'>
        <div className='border-border/70 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-t-4xl border-b px-5 pt-4 backdrop-blur-xl max-sm:px-3'>
          <TabSwitcher activeTab={activeTab} onChange={setActiveTab} disabled={false} />

          <div className='mb-3 flex flex-wrap items-center gap-2'>
            <Button variant='outline' className='rounded-full' onClick={handleCopy}>
              <HugeiconsIcon icon={CopyIcon} className='size-4' />
              Copy article
            </Button>

            <TextReader
              text={blog.content ?? ''}
              lang={blog.language}
              existingTtsUrl={blog.ttsVoiceUrl}
              isListeningAvailable={blog.language === 'en'}
            />
          </div>
        </div>

        <article className='w-full px-8 py-8 max-sm:px-4'>
          <AnimatePresence mode='wait'>
            {activeTab === 'generated' ? (
              <motion.div
                key='generated'
                initial='hidden'
                animate='animate'
                exit='exit'
                className='mx-auto max-w-4xl'
                variants={animationVariants}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                <div className='prose sm:prose-base dark:prose font-sans'>
                  <ReactMarkdown>{blog.content ?? ''}</ReactMarkdown>
                </div>
                {blog.gptAnalysis && (
                  <div className='border-border/70 dark:bg-card/30 mt-8 rounded-3xl border bg-[#fafafa]/50 p-6 shadow-sm backdrop-blur-sm'>
                    <div className='mb-4 flex items-center gap-3'>
                      <span className='bg-primary/10 text-primary grid size-10 place-items-center rounded-2xl'>
                        <HugeiconsIcon icon={Sparkle} className='size-5' />
                      </span>
                      <div>
                        <h3 className='text-foreground text-base font-semibold'>GPT Analysis</h3>
                        <p className='text-muted-foreground text-xs'>
                          Assessment of logic, credibility, and thoughts alignment.
                        </p>
                      </div>
                    </div>
                    <div className='prose prose-sm dark:prose-invert text-foreground/80 border-border/40 max-w-none border-t pt-4 font-sans leading-relaxed'>
                      <ReactMarkdown>{blog.gptAnalysis}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key='raw'
                initial='hidden'
                animate='animate'
                exit='exit'
                variants={animationVariants}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className='mx-auto max-w-4xl'
              >
                <div className='border-border/70 bg-muted/25 mb-8 rounded-3xl border p-5'>
                  <div className='mb-4 flex items-center gap-3'>
                    <span className='bg-chart-2/10 text-chart-2 grid size-10 place-items-center rounded-2xl'>
                      <HugeiconsIcon icon={FileAudioIcon} className='size-5' />
                    </span>
                    <div>
                      <h2 className='text-base font-semibold'>Original voice</h2>
                      <p className='text-muted-foreground text-sm'>Listen to the source audio for this draft.</p>
                    </div>
                  </div>
                  <MiniAudioPlayer
                    classes='border border-border/70 bg-background/80 w-full my-0'
                    fileUrl={voiceRecord?.fileUrl ?? ''}
                  />
                </div>

                <div className='border-border/70 bg-background rounded-3xl border p-6'>
                  <div className='mb-4 flex items-center gap-3'>
                    <span className='bg-muted text-muted-foreground grid size-9 place-items-center rounded-xl'>
                      <HugeiconsIcon icon={BookOpenTextIcon} className='size-4' />
                    </span>
                    <h2 className='text-base font-semibold'>Raw transcript</h2>
                  </div>
                  <p className='text-foreground/85 font-mono text-sm leading-7 whitespace-pre-wrap'>
                    {transcript?.rawText}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </div>
    </section>
  )
}
