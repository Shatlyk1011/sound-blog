import Hero from '@/components/Hero'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className='bg-background mt-14 flex h-full items-center justify-center px-10 py-30 font-sans'>
      <Hero />
    </main>
  )
}
