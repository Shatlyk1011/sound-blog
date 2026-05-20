import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className='scrollbar-gutter-stable relative min-h-full overflow-hidden px-6 py-8 max-sm:px-3 max-sm:py-4'>
      <div className='relative mx-auto max-w-4xl'>
        <RecordClient recordId={id} />
      </div>
    </div>
  )
}
