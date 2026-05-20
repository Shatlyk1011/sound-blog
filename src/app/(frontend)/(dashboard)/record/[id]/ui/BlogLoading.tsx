import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  hidden: boolean
}

const BlogLoading = ({ hidden }: Props) => {
  return (
    <div hidden={hidden} className='animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500'>
      <div className='border-border/70 bg-card/80 rounded-[2rem] border p-6 shadow-sm'>
        <Skeleton className='mb-6 h-8 w-40 rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-14 w-full max-w-200' />
          <Skeleton className='h-14 w-2/3' />
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <Skeleton className='h-8 w-40 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
          <Skeleton className='h-8 w-28 rounded-full' />
        </div>
      </div>

      <div className='border-border/70 bg-card/80 overflow-hidden rounded-[2rem] border shadow-sm'>
        <div className='border-border/70 border-b p-5'>
          <div className='mb-4 flex min-h-12 items-start gap-2'>
            <Skeleton className='h-10 w-32 rounded-full' />
            <Skeleton className='h-10 w-40 rounded-full' />
            <div className='flex flex-1 justify-end'>
              <Skeleton className='h-10 w-10 rounded-full' />
            </div>
          </div>
          <Skeleton className='h-11 w-72 rounded-full' />
        </div>

        <article className='w-full space-y-4 p-8'>
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
    </div>
  )
}

export default BlogLoading
