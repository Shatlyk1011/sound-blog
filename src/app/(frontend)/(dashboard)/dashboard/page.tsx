import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <main className='bg-background border-sidebar-border gap- relative mt-14 ml-0 flex min-h-svh flex-col items-center justify-start rounded-l-2xl border pt-20 pb-10'>
      <div className='bg-sidebar absolute -top-32 -left-1 -z-10 h-full w-full'></div>
      <h1 className='font-sans text-4xl font-bold'>Sound Blog</h1>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </main>
  )
}
