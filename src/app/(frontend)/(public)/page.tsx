import VoiceRecordSection from '@/components/VoiceRecordSection'
import Hero from '@/components/Hero'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Home() {
  return (
    <main className='bg-background mt-14 flex min-h-screen flex-col items-center justify-start pb-24'>
      <Hero />
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </main>
  )
}
