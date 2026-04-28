import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className='relative mt-14 border border-sidebar-border'>
      <div className='absolute w-full h-full -top-32 -left-1 bg-sidebar -z-10'></div>
      <div className='bg-background w-full py-20'>
        <div className='max-w-4xl mx-auto'>
          <RecordClient recordId={id} />
        </div>
      </div>
    </div>
  )
}
