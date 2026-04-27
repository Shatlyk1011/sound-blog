import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <main className='bg-background mt-14 py-20 flex min-h-screen flex-col items-center justify-start pb-24'>
      <h1 className='text-4xl font-bold font-sans'>Sound Blog</h1>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </main>
  )
}
