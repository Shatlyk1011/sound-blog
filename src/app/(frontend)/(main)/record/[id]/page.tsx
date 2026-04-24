import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className='mt-14 py-20 max-w-4xl mx-auto'>
      <RecordClient recordId={id} />
    </main>
  )
}
