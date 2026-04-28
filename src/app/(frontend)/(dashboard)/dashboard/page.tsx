import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <main className='bg-background mt-14 ml-0 relative flex min-h-svh border border-sidebar-border rounded-l-2xl flex-col items-center justify-start pt-20 pb-10'>
      <div className='absolute w-full h-full -top-32 -left-1 bg-sidebar -z-10'></div>
      <h1 className='font-sans text-4xl font-bold'>Sound Blog</h1>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </main>
  )
}
