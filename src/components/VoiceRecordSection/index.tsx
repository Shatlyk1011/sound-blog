import VoiceRecord from './VoiceRecord'

const VoiceRecordSection = () => {
  return (
    <section className='p-10 w-full max-w-3xl'>
      <div className='bg-card rounded-3xl border px-12 pt-12 pb-8 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Record your voice</h1>
        <span className='text-foreground/70 mb-2 inline-block text-base'>
          or <strong>drop</strong> an audio file to get started
        </span>
        <VoiceRecord />
      </div>
    </section>
  )
}
export default VoiceRecordSection
