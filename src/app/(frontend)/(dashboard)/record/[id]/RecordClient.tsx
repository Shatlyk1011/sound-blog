'use client'

import { useState, useEffect } from 'react'
import { Blog, Transcript, VoiceRecord } from '@/payload-types'
import { useBlogQuery, useUpdateBlogMutation } from '@/services/blogs'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'
import { ActionBar } from './ui/ActionBar'
import BlogLoading from './ui/BlogLoading'
import BlogMetadata from './ui/BlogMetadata'
import TabSwitcher from './ui/TabSwitch'
import TextReader from './ui/TextReader'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

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
    <section className='gap-6'>
      <BlogLoading hidden={!isLoading} />

      {error && <div className='text-destructive'>Error loading blog: {(error as Error).message}</div>}

      {blog && (
        <>
          <h1 className='mb-2 text-5xl leading-[140%] font-bold tracking-tight'>{blog.title}</h1>

          <BlogMetadata
            createdAt={blog.createdAt}
            filters={blog.filters}
            fileUrl={(blog.recordId as VoiceRecord).fileUrl}
          />
          <div className='w-full'>
            <ActionBar
              handleCopy={() => handleCopy(blog.content!)}
              isEditing={isEditing}
              isSaving={isPending}
              onEditClick={onEditClick}
              onSaveClick={handleSave}
              onCancelClick={onCancelClick}
              textReaderSlot={
                !isEditing && (
                  <TextReader
                    text={blog.content ?? ''}
                    lang={blog.language}
                    blogId={blog.id}
                    recordId={recordId}
                    existingTtsUrl={blog.ttsVoiceUrl}
                  />
                )
              }
            />
          </div>
          <TabSwitcher activeTab={activeTab} onChange={setActiveTab} disabled={isEditing} />

          <article className='w-full rounded-3xl py-8'>
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
                  {isEditing ? (
                    <div data-color-mode={resolvedTheme}>
                      <MDEditor
                        value={blogContent}
                        onChange={(val) => setBlogContent(val || '')}
                        preview='edit'
                        commands={[]}
                        height={500}
                        className='w-full'
                      />
                    </div>
                  ) : (
                    <div className='prose prose-sm sm:prose-base dark:prose- max-w-none font-serif'>
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
                >
                  <div className='relative mb-10 flex w-full items-center gap-6'>
                    <MiniAudioPlayer
                      classes='border border-border w-64  my-0'
                      fileUrl={(blog.recordId as VoiceRecord).fileUrl}
                    />
                    <span className='text-sm font-medium'>Original Voice</span>
                  </div>
                  <p className='font-mono'>{(blog.transcriptId as Transcript).rawText}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        </>
      )}

      {!isLoading && !blog && !error && (
        <div className='bg-card w-full max-w-3xl rounded-xl border p-8 text-center shadow-sm'>
          <p className='text-muted-foreground'>
            No blog, no error found for this record yet. The workflow might still be processing. Please wait a few
            minutes and try reload.
          </p>
        </div>
      )}
    </section>
  )
}
