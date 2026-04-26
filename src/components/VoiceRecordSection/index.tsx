import AIVoice from './VoiceRecord'

const VoiceRecordSection = () => {
  return (
    <section className='px-10 py-16'>
      <div className='bg-card rounded-3xl border px-12 pt-12 pb-8 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Record your voice</h1>
        <span className='text-foreground/70 mb-2 inline-block text-sm'>
          or <strong>drop</strong> an audio file to get started
        </span>
        <AIVoice />
      </div>
    </section>
  )
}
export default VoiceRecordSection
