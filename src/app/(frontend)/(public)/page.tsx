import DemoSection from '@/components/DemoSection'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className='bg-background mt-14 flex min-h-screen flex-col items-center justify-start pb-24'>
      <Hero />
      <DemoSection />
    </main>
  )
}
