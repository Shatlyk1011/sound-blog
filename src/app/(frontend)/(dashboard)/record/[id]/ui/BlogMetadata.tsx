import { FC } from 'react'
import { ALL_FILTERS, FilterValue } from '@/lib/constants'

interface Props {
  createdAt: string
  fileUrl: string
  filters?: string | null
}

const BlogMetadata: FC<Props> = ({ createdAt, filters }: Props) => {
  const filtersArr = JSON.parse(filters || '')

  return (
    <div className='mb-4 flex items-start justify-between'>
      <div className='flex items-center text-sm font-medium'>
        <ul className='flex items-center gap-2 py-4'>
          {filtersArr.map((filter: string) => (
            <li key={filter} className='border-border rounded-full border px-2.5 py-1 text-sm'>
              {ALL_FILTERS[filter as FilterValue]}
            </li>
          ))}
        </ul>
        <time className='text-muted-foreground ml-4' dateTime={createdAt}>
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
          }).format(new Date(createdAt))}
        </time>
      </div>
    </div>
  )
}
export default BlogMetadata
