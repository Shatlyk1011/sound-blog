import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className='mx-auto mt-14 max-w-4xl py-20'>
      <RecordClient recordId={id} />
    </main>
  )
}
