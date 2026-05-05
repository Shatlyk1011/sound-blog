import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  hidden: boolean
}

const BlogLoading = ({ hidden }: Props) => {
  return (
    <div hidden={hidden} className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {/* Title Skeleton */}
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-14 w-full max-w-200' />
        <Skeleton className='h-14 w-2/3' />
      </div>

      {/* Metadata Skeleton */}
      <div className='mb-4 flex items-center gap-4 py-4'>
        <Skeleton className='h-8 w-24 rounded-full' />
        <Skeleton className='h-8 w-24 rounded-full' />
        <Skeleton className='ml-4 h-5 w-32' />
      </div>

      {/* ActionBar Skeleton */}
      <div className='mb-4 flex min-h-14 items-start gap-2'>
        <Skeleton className='h-10 w-32 rounded-lg' />
        <Skeleton className='h-10 w-40 rounded-lg' />
        <div className='flex flex-1 justify-end'>
          <Skeleton className='h-10 w-10 rounded-lg' />
        </div>
      </div>

      {/* TabSwitcher Skeleton */}
      <div className='border-border mb-2 border-b pt-2 pb-0'>
        <div className='flex gap-4 pb-2'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-7 w-32' />
        </div>
      </div>

      {/* Content Skeleton */}
      <article className='w-full space-y-4 py-8'>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>

        <div className='space-y-3 pt-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
        </div>

        <div className='space-y-3 pt-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </article>
    </div>
  )
}

export default BlogLoading
