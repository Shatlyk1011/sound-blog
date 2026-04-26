'use client'

import { Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { stringify } from 'qs-esm'
import { Blog } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import MiniAudioPlayer from '@/components/VoiceRecordsGrid/AudioPlayer'

interface RecordClientProps {
  recordId: string
}

export function RecordClient({ recordId }: RecordClientProps) {
  const stringifiedQuery = stringify(
    {
      where: { recordId: { equals: recordId } },
      depth: 1,
      limit: 1,
    },
    { addQueryPrefix: true }
  )

  const { data: blogsData, isLoading, error } = useQuery({
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
        <div className='flex items-center gap-2 text-muted-foreground'>
          <HugeiconsIcon icon={Loading03Icon} className='animate-spin duration-2000' />
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
          <h1 className='text-5xl leading-[130%]  font-bold tracking-tight'>{blog.title}</h1>

          <div className='flex justify-between'>
            <div className='flex items-center mb-6  text-sm font-medium'>

              <ul className='flex items-center gap-2 py-4'>
                <Badge variant={'secondary'}>Status: {blog.status}</Badge>
                {blog.tone && (
                  <Badge >
                    Tone: {blog.tone}
                  </Badge>
                )}
              </ul>
              <span className='mx-2 text-lg'>•</span>
              <time className='text-muted-foreground' dateTime={blog.createdAt}>
                {new Intl.DateTimeFormat(
                  'en-US',
                  {
                    dateStyle: 'long',
                  },
                ).format(new Date(blog.createdAt))}
              </time>
            </div>
            <MiniAudioPlayer />
          </div>

          <article className='bg-card w-full max-w-full rounded-3xl border p-8 text-left shadow-sm'>
            <div className='prose prose-sm sm:prose-base font-serif dark:prose- max-w-none'>
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </article>
        </>
      )}

      {!isLoading && !blog && !error && (
        <div className='bg-card w-full max-w-3xl rounded-xl border p-8 text-center shadow-sm'>
          <p className='text-muted-foreground'>
            No blog found for this record yet. The AI might still be processing it.
          </p>
        </div>
      )}
    </section>
  )
}
