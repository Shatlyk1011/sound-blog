import { VoiceRecord } from '@/payload-types'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import VoiceRecordCard from '../VoiceRecordsGrid/VoiceRecordCard'

const DEMO_RECORD: VoiceRecord = {
  createdAt: '2026-04-24T13:11:56.728Z',
  updatedAt: '2026-04-24T13:12:32.633Z',
  userId: '69eb55f7c91f77f32f72b7dc',
  fileUrl:
    'https://pub-22d9ce529cfb4b3891eb3bc8dfa9dc22.r2.dev/1777036314037-voice-record-1777036309664.webm',
  fileName: 'voice-record-1777036309664.webm',
  duration: 10,
  status: 'completed',
  id: 'voice-record-1777036309664-4226',
}

const DemoSection = () => {
  return (
    <section
      className='text-card-foreground mx-auto w-full max-w-7xl rounded-4xl px-4 pt-16 sm:px-10'
      id='demo'
    >
      <div className='mb-16 flex flex-col items-center'>
        <h2 className='mb-4 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Demo Sound Blog
        </h2>
        <p className='text-muted-foreground max-w-2xl text-center text-lg'>
          Here is how your voice recordings will appear.
        </p>
      </div>

      <div className='flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-24'>
        <div className='relative w-full max-w-md max-lg:order-2'>
          <div className='bg-primary/10 absolute -inset-4 -z-10 rounded-[2.5rem] blur-xl'></div>
          <div className='bg-background border-border relative z-10 rounded-3xl border p-2 shadow-xl'>
            <VoiceRecordCard record={DEMO_RECORD} />
          </div>
        </div>

        <div className='relative flex max-w-sm flex-col items-center lg:items-start'>
          {/* Arrow pointing Left (for Desktop) */}
          <div className='text-primary absolute top-1/2 -left-20 -translate-y-1/2 max-lg:hidden'>
            <HugeiconsIcon size={64} icon={ArrowLeft02Icon} />
          </div>

          <div className='space-y-5 text-center lg:text-left'>
            <span className='bg-primary/10 text-primary inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium'>
              Interactive Demo
            </span>
            <h3 className='text-3xl font-bold tracking-tight'>
              Your Voice Record
            </h3>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              Every recording you make will be displayed with its{' '}
              <strong>title</strong>, <strong>status</strong>, a built-in{' '}
              <strong>Audio Player</strong>.
            </p>
            <p className='text-muted-foreground/80 text-base leading-relaxed'>
              Click it to see details{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default DemoSection
