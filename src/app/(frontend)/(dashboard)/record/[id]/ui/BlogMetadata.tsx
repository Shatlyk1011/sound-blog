import { FC, useState } from 'react'
import { Blog } from '@/payload-types'

interface Props {
  createdAt: string
  fileUrl: string
  tone?: Blog['tone']
}

const BlogMetadata: FC<Props> = ({ createdAt, tone }: Props) => {

  return (
    <div className='flex min-h-20 items-start justify-between'>
      <div className='flex items-center text-sm font-medium'>
        <ul className='flex items-center gap-2 py-4'>
          {tone && <li className='border-border rounded-full border px-2.5 py-1 text-xs'>Tone: {tone}</li>}
        </ul>
        <span className='mx-2 text-lg'>•</span>
        <time className='text-muted-foreground' dateTime={createdAt}>
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
          }).format(new Date(createdAt))}
        </time>
      </div>

    </div>
  )
}
export default BlogMetadata
