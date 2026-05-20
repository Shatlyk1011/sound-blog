import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className='min-h-full py-20'>
      <div className='mx-auto max-w-4xl px-16'>
        <RecordClient recordId={id} />
      </div>
    </div>
  )
}
