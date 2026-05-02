import VoiceRecord from './VoiceRecord'

const VoiceRecordSection = () => {
  return (
    <section className='w-full max-w-3xl px-10'>
      <div className='px-12 pt-12 pb-8 text-center'>
        <h1 className='text-4xl font-bold tracking-tight mb-2'>Record your voice</h1>
        <span className='text-foreground/70 inline-block text-lg mb-6'>
          or <strong>drop</strong> an audio file to get started
        </span>
        <VoiceRecord />
      </div>
    </section>
  )
}
export default VoiceRecordSection
