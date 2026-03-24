import AIVoice from './VoiceRecord'


const Hero = () => {
  return (
    <section className='px-10 py-16'>
      <div className='rounded-3xl text-center px-12 py-12 border bg-card '>
        <h1 className='text-2xl font-bold tracking-tight'>Record your voice</h1>
        <span className='text-sm text-foreground/70 inline-block mb-2'>or drop an audio file to get started</span>
        <AIVoice />
      </div>
    </section>
  )
}
export default Hero
