import { FC } from 'react'
import { Calendar03Icon, FilterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ALL_FILTERS, FilterValue } from '@/lib/constants'

interface Props {
  createdAt: string
  filters?: string | null
}

const BlogMetadata: FC<Props> = ({ createdAt, filters }: Props) => {
  let filtersArr: string[] = []

  try {
    const parsedFilters = filters ? JSON.parse(filters) : []
    filtersArr = Array.isArray(parsedFilters) ? parsedFilters : []
  } catch {
    filtersArr = []
  }

  return (
    <div className='mt-6 flex flex-wrap items-center gap-3 text-sm font-medium'>
      <time
        className='border-border/70 bg-background/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5'
        dateTime={createdAt}
      >
        <HugeiconsIcon icon={Calendar03Icon} className='size-4' />
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(new Date(createdAt))}
      </time>

      {filtersArr.length > 0 && (
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          <span className='text-muted-foreground inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase'>
            <HugeiconsIcon icon={FilterIcon} className='size-3.5' />
            Filters
          </span>
          {filtersArr.map((filter: string) => (
            <span
              key={filter}
              className='border-border/70 bg-background/70 text-foreground/80 rounded-full border px-3 py-1.5 text-xs'
            >
              {ALL_FILTERS[filter as FilterValue] ?? filter}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
export default BlogMetadata
