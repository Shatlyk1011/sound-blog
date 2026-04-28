'use client'

import { useQuery } from '@tanstack/react-query'
import { Blog, VoiceRecord } from '@/payload-types'
import { Close, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { stringify } from 'qs-esm'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface RecordClientProps {
  recordId: string
}

export function RecordClient({ recordId }: RecordClientProps) {
  const [showOriginalAudio, setShowOriginalAudio] = useState(false)
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

  console.log('blog', blog)

  return (
    <section className='gap-6 px-4'>
      {isLoading && (
        <div className='text-muted-foreground flex items-center gap-2'>
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

          <div className='flex justify-between'>
            <div className='mb-6 flex flex-col text-sm font-medium'>
              <div className='flex items-center '>
                <ul className='flex items-center gap-2 py-4'>
                  {blog.tone && <Badge variant={'secondary'}>Tone: {blog.tone}</Badge>}
                </ul>
                <span className='mx-2 text-lg'>•</span>
                <time className='text-muted-foreground' dateTime={blog.createdAt}>
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'long',
                  }).format(new Date(blog.createdAt))}
                </time>
              </div>

              123

            </div>
            <div className='flex flex-col'>
              {!showOriginalAudio ? (
                <Button variant={'outline'} size="sm" onClick={() => setShowOriginalAudio(true)} className='text-xs text-muted-foreground font-medium'>Show original audio</Button>
              ) : (
                <div className='w-full relative'>
                  <MiniAudioPlayer classes='border border-border w-64 ' fileUrl={(blog.recordId as VoiceRecord).fileUrl} />
                  <button onClick={() => setShowOriginalAudio(false)} className=' absolute -top-2 -right-2 bg-muted text-muted-foreground/60 p-0.5 rounded-full'>
                    <HugeiconsIcon icon={Close} size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <article className='bg-card w-full max-w-full rounded-3xl border p-8 text-left shadow-sm'>
            <div className='prose prose-sm sm:prose-base dark:prose- max-w-none font-serif'>
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
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
