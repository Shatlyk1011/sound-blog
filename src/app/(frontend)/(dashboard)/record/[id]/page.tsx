import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className='relative mt-14 border h-full border-sidebar-border rounded-l-2xl'>
      <div className='absolute w-full h-full -top-32 -left-1 bg-sidebar -z-10'></div>
      <div className='bg-background rounded-l-2xl w-full min-h-[calc(100svh-56px)] py-20'>
        <div className='max-w-4xl mx-auto'>
          <RecordClient recordId={id} />
        </div>
      </div>
    </main>
  )
}
