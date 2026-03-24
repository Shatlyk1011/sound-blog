import Hero from '@/components/Hero'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Home() {
  return (
    <main className='bg-background mt-15 flex min-h-screen flex-col items-center justify-start pb-24 font-sans'>
      <Hero />
      <VoiceRecordsGrid />
    </main>
  )
}
