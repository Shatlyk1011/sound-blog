import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <main className='bg-background mt-14 flex min-h-screen flex-col items-center justify-start py-20 pb-24'>
      <h1 className='font-sans text-4xl font-bold'>Sound Blog</h1>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </main>
  )
}
