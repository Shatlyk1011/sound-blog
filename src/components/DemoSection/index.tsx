import { DEMO_SOUND_RECORD } from '@/data'
import { VoiceRecord } from '@/payload-types'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import VoiceRecordCard from '../VoiceRecordsGrid/VoiceRecordCard'

const DemoSection = () => {
  return (
    <section
      className='text-card-foreground relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] px-4 pt-16 sm:px-10'
      id='demo'
    >
      <div className='mb-12 flex flex-col items-center text-center'>
        <span className='border-border bg-background/80 text-muted-foreground mb-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase shadow-sm backdrop-blur'>
          Listen, polish, publish
        </span>
        <h2 className='mb-4 max-w-3xl font-serif text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl'>
          Demo Sound Blog
        </h2>
        <p className='text-muted-foreground max-w-2xl text-lg leading-8'>
          A quick look at how your raw voice note becomes an organized, playable, ready-to-edit blog draft.
        </p>
      </div>

      <div className='border-border/70 bg-card/80 relative grid items-center gap-10 overflow-hidden rounded-[2rem] border p-4 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'>
        <div className='relative w-full max-w-md justify-self-center max-lg:order-2'>
          <div className='border-border bg-background/95 relative z-10 rounded-3xl border p-2'>
            <VoiceRecordCard record={DEMO_SOUND_RECORD.recordId as VoiceRecord} />
          </div>
        </div>

        <div className='relative flex flex-col items-center lg:items-start'>
          <div className='text-primary absolute top-1/2 -left-20 -translate-y-1/2 max-lg:hidden'>
            <HugeiconsIcon size={64} icon={ArrowLeft02Icon} />
          </div>

          <div className='space-y-6 text-center lg:text-left'>
            <span className='bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold shadow-md'>
              Interactive Demo
            </span>
            <div className='space-y-3'>
              <h3 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Your voice record gets a beautiful home.
              </h3>
              <p className='text-muted-foreground text-lg leading-relaxed'>
                Every recording is displayed with its <strong>title</strong>, <strong>status</strong>, and built-in{' '}
                <strong>audio player</strong>, so your ideas stay easy to review.
              </p>
            </div>
            <div className='grid gap-3 sm:grid-cols-3'>
              {['Record', 'Generate', 'Refine'].map((step, index) => (
                <div key={step} className='border-border bg-background/80 rounded-2xl border p-4 shadow-sm'>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
                    0{index + 1}
                  </p>
                  <p className='mt-1 font-bold'>{step}</p>
                </div>
              ))}
            </div>
            <p className='text-muted-foreground/80 text-base leading-relaxed'>
              Click the demo card to see the details view.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default DemoSection
