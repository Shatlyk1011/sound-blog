import DemoSection from '@/components/DemoSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className='bg-background mt-14 flex min-h-screen flex-col items-center justify-start pb-8'>
      <Hero />
      <DemoSection />
      <FAQ />
      <Footer />
    </main>
  )
}
