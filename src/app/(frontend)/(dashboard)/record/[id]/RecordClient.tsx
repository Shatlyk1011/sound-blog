'use client'

import { useEffect, useState } from 'react'
import { Blog, Transcript, VoiceRecord } from '@/payload-types'
import { useBlogQuery, useUpdateBlogMutation } from '@/services/blogs'
import { ArrowLeft01Icon, BookOpenTextIcon, FileAudioIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'
import { ActionBar } from './ui/ActionBar'
import BlogLoading from './ui/BlogLoading'
import BlogMetadata from './ui/BlogMetadata'
import TabSwitcher from './ui/TabSwitch'
import TextReader from './ui/TextReader'

const MDEditor = dynamic(() => import('@uiw/react-md-editor/nohighlight'), { ssr: false })

interface RecordClientProps {
  recordId: string
}

const animationVariants = {
  hidden: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export type TabVariants = 'generated' | 'raw' | 'originalAudio'

export function RecordClient({ recordId }: RecordClientProps) {
  const [activeTab, setActiveTab] = useState<TabVariants>('generated')
  const [isEditing, setIsEditing] = useState(false)
  const [blogContent, setBlogContent] = useState<string>('')

  const { resolvedTheme } = useTheme()
  const { user } = useUser()

  const { data: blogsData, isLoading, error } = useBlogQuery(recordId, user?.id)

  const blog: Blog = blogsData?.docs?.[0]
  const voiceRecord = blog?.recordId as VoiceRecord | undefined

  useEffect(() => {
    if (blog && !isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlogContent(blog.content || '')
    }
  }, [blog, isEditing])

  const { mutate: updateBlogMutation, isPending } = useUpdateBlogMutation(recordId)

  const handleSave = () => {
    if (!blog) return
    updateBlogMutation(
      { blogId: blog.id, content: blogContent },
      {
        onSuccess: () => {
          toast.success('Article updated successfully!', {
            position: 'top-center',
          })
          setIsEditing(false)
        },
        onError: (error) => {
          toast.error(`Error updating article: ${(error as Error).message}`, {
            position: 'top-center',
          })
        },
      }
    )
  }

  const onEditClick = () => {
    setActiveTab('generated')
    setIsEditing(true)
  }

  const onCancelClick = () => {
    setIsEditing(false)
    setBlogContent(blog.content!)
  }

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
    toast.success('Blog copied successfully!', { position: 'top-center' })
  }

  return (
    <section className='space-y-6'>
      <BlogLoading hidden={!isLoading} />

      {error && (
        <div className='border-destructive/20 bg-destructive/5 text-destructive rounded-3xl border p-6'>
          <p className='text-sm font-medium'>Error loading blog: {(error as Error).message}</p>
        </div>
      )}

      {blog && (
        <>
          <div className='border-border/70 bg-card/80 relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur max-sm:p-4'>
            <div className='relative'>
              <Button asChild variant='ghost' size='sm' className='mb-5 -ml-2 rounded-full'>
                <Link href='/dashboard'>
                  <HugeiconsIcon icon={ArrowLeft01Icon} className='size-4' />
                  Back to recordings
                </Link>
              </Button>

              <div className='mb-4 flex flex-wrap items-center gap-2'>
                {isEditing && (
                  <span className='bg-chart-1/15 text-foreground absolute top-0 right-0 rounded-full px-3 py-1 text-xs font-semibold'>
                    Editing draft
                  </span>
                )}
              </div>

              <h1 className='max-w-4xl text-5xl leading-[115%] font-bold tracking-tight max-lg:text-4xl max-sm:text-3xl'>
                {blog.title}
              </h1>

              <BlogMetadata createdAt={blog.createdAt} filters={voiceRecord?.filters} />
            </div>
          </div>

          <div className='border-border/70 bg-card/80 overflow-hidden rounded-4xl border shadow-sm'>
            <div className='border-border/70 sticky top-0 z-20 flex justify-between rounded-t-4xl border-b px-5 pt-4 backdrop-blur-xl max-sm:px-3'>
              <TabSwitcher activeTab={activeTab} onChange={setActiveTab} disabled={isEditing} />
              <ActionBar
                handleCopy={() => handleCopy(blog.content!)}
                isEditing={isEditing}
                isSaving={isPending}
                onEditClick={onEditClick}
                onSaveClick={handleSave}
                onCancelClick={onCancelClick}
                postTitle={blog.title}
                textReaderSlot={
                  !isEditing && (
                    <TextReader
                      text={blog.content ?? ''}
                      lang={blog.language}
                      blogId={blog.id}
                      recordId={recordId}
                      existingTtsUrl={blog.ttsVoiceUrl}
                      isListeningAvailable={blog.language === 'en'}
                    />
                  )
                }
              />
            </div>

            <article className='w-full px-8 py-8 max-sm:px-4'>
              <AnimatePresence mode='wait'>
                {activeTab === 'generated' ? (
                  <motion.div
                    key='generated'
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    className='mx-auto max-w-4xl'
                    variants={animationVariants}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                  >
                    {isEditing ? (
                      <div data-color-mode={resolvedTheme} className='overflow-hidden rounded-3xl border'>
                        <MDEditor
                          value={blogContent}
                          onChange={(val) => setBlogContent(val || '')}
                          preview='edit'
                          commands={[]}
                          height={620}
                          className='sound-blog-md-editor w-full'
                        />
                      </div>
                    ) : (
                      <div className='prose prose-sm sm:prose-base dark:prose font-sans'>
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key='raw'
                    initial='initial'
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
                        {(blog.transcriptId as Transcript).rawText}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          </div>
        </>
      )}

      {!isLoading && !blog && !error && (
        <div className='border-border/70 bg-card mx-auto w-full max-w-4xl rounded-[2rem] border p-10 text-center shadow-sm'>
          <div className='bg-muted mx-auto mb-4 grid size-14 place-items-center rounded-2xl'>
            <HugeiconsIcon icon={BookOpenTextIcon} className='text-muted-foreground size-6' />
          </div>
          <h2 className='text-xl font-semibold'>Article is not ready yet</h2>
          <p className='text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6'>
            The workflow may still be processing this recording. Give it a few minutes, then refresh this page.
          </p>
          <Button asChild className='mt-6 rounded-full'>
            <Link href='/dashboard'>
              <HugeiconsIcon icon={ArrowLeft01Icon} className='size-4' />
              Back to dashboard
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
