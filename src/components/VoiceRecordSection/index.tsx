import VoiceRecord from './VoiceRecord'

const VoiceRecordSection = () => {
  return (
    <section className='w-full max-w-3xl px-10'>
      <div className='px-12 pt-12 pb-8 text-center'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight'>Record your voice</h1>
        <span className='text-foreground/70 mb-6 inline-block text-lg'>
          or <strong>drop</strong> an audio file to get started
        </span>
        <VoiceRecord />
      </div>
    </section>
  )
}
export default VoiceRecordSection
