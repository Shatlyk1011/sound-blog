import AIVoice from './VoiceRecord'


const Hero = () => {
  return (
    <section className='px-10 py-30'>
      <div className='rounded-3xl px-10 py-16 border bg-secondary'>

        <h1 className='text-xl tracking-tight font-medium'>Record or Drop your voice record file </h1>
        <AIVoice />
      </div>
    </section>
  )
}
export default Hero
