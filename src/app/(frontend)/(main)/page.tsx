import Hero from '@/components/Hero'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Home() {
  return (
    <main className='bg-background mt-15 flex min-h-screen flex-col items-center justify-start font-sans pb-24'>
      <Hero />
      <VoiceRecordsGrid />
    </main>
  )
}
