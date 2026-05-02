import { RecordClient } from './RecordClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className='border-sidebar-border relative mt-14 rounded-l-2xl border'>
      <div className='bg-sidebar absolute -top-32 -left-1 -z-10 h-full w-full'></div>
      <div className='bg-background min-h-[calc(100svh-56px)] w-full rounded-l-2xl py-20'>
        <div className='mx-auto max-w-4xl px-16'>
          <RecordClient recordId={id} />
        </div>
      </div>
    </main>
  )
}
