import VoiceRecord from './VoiceRecord'

const VoiceRecordSection = () => {
  return (
    <section className='w-full max-w-4xl px-8 max-md:px-4'>
      <div className='border-border/80 bg-card/80 relative overflow-hidden rounded-[2rem] border px-10 pt-10 pb-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.06)] max-sm:px-4'>
        <div className='bg-chart-2/10 absolute -top-28 -left-24 size-60 rounded-full blur-3xl' />
        <div className='bg-chart-1/15 absolute -right-20 -bottom-24 size-56 rounded-full blur-3xl' />
        <div className='border-border/70 bg-background/65 text-muted-foreground relative mx-auto mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur'>
          <span className='bg-chart-2 size-1.5 rounded-full' />
          Audio to article studio
        </div>

        <h1 className='relative mb-3 text-4xl leading-tight font-bold tracking-tight max-sm:text-3xl'>
          Record your voice
        </h1>
        <p className='text-muted-foreground relative mx-auto mb-7 max-w-xl text-base leading-7'>
          Capture a quick thought, upload existing audio, then turn it into a polished blog draft with your preferred
          tone and structure.
        </p>
        <VoiceRecord />
      </div>
    </section>
  )
}
export default VoiceRecordSection
