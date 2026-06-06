import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Editorial Guide',
  description: 'Learn how to turn voice recordings into polished, SEO-aware, GEO-ready blog drafts in Sound Blog.',
}

const workflowSteps = [
  {
    eyebrow: '01',
    title: 'Record your voice',
    description:
      'Capture a thought directly in the dashboard, or <strong class="font-semibold">drop</strong> in an existing audio file. Sound Blog prepares the audio before it leaves the page.',
  },
  {
    eyebrow: '02',
    title: 'Adjust filters',
    description:
      'Choose tone, target length, and optional enhancements like headings, TLDR, examples, storytelling, intro hook, or bullet points.',
  },
  {
    eyebrow: '03',
    title: 'Start generation',
    description:
      'The app uploads your optimized audio, creates a voice record, sends it to the worker, and tracks the draft while it is processing.',
  },
  {
    eyebrow: '04',
    title: 'Read, edit, and listen',
    description:
      'Open the generated record to review the article, compare it with the raw transcript and original audio, edit Markdown, copy, or generate speech.',
  },
]

const quickTips = [
  'The project currently works best with English or Russian recordings.',
  'Use shorter recordings for quick drafts and longer recordings for deeper articles.',
  'Keep the original tone when you want the writing to sound closest to you.',
  'Add headings and summaries when the article needs to be easier to scan.',
  'Rewrite vague spoken phrases into specific names, topics, locations, and keywords.',
]

export default function EditorialPage() {
  return (
    <div className='relative min-h-full overflow-hidden px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12 lg:px-8 lg:py-10'>
      <section className='relative'>
        <div className='mb-8 max-w-2xl'>
          <h2 className='text-2xl font-semibold tracking-tight sm:text-3xl'>How the Sound Blog works</h2>
        </div>

        <div className='grid gap-4 lg:grid-cols-2 lg:gap-5'>
          {workflowSteps.map((step) => (
            <article
              key={step.title}
              className='border-border/70 bg-card/90 rounded-[1.5rem] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur sm:rounded-[1.75rem] sm:p-6'
            >
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <div className='text-chart-2 mb-2 text-xs font-bold tracking-[0.18em]'>{step.eyebrow}</div>
                  <h3 className='text-xl font-semibold tracking-tight sm:text-2xl'>{step.title}</h3>
                </div>
              </div>
              <p
                className='text-muted-foreground mt-3 max-w-3xl text-sm leading-6'
                dangerouslySetInnerHTML={{ __html: step.description }}
              ></p>
            </article>
          ))}
        </div>
      </section>

      <section className='relative mt-10 grid gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-2 lg:gap-8'>
        <div className='border-border/70 bg-card/80 rounded-[1.5rem] border p-5 shadow-sm sm:rounded-[1.75rem] sm:p-6'>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>Editorial tips</h2>
          <p className='text-muted-foreground mt-2 text-sm leading-6'>
            A better input creates a better draft. Think in sections, speak naturally, and use filters only when you
            want the article to move away from the raw recording.
          </p>
          <ul className='mt-5 space-y-3'>
            {quickTips.map((tip) => (
              <li key={tip} className='flex gap-3 text-sm leading-6'>
                <span className='bg-chart-2 mt-2 size-1.5 shrink-0 rounded-full' />
                <span className='text-muted-foreground'>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='border-border/70 bg-card/80 rounded-[1.5rem] border p-5 shadow-sm sm:rounded-[1.75rem] sm:p-6'>
          <div className='border-border/70 bg-background/70 text-muted-foreground mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
            Pricing note
          </div>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>Need more generation room?</h2>
          <p className='text-muted-foreground mt-3 text-sm leading-6'>
            Credits are tied to audio duration: one credit equals one second of audio. If you plan to turn longer
            conversations, interviews, or frequent voice notes into posts, visit pricing for more credits/tokens.
          </p>
          <Button
            asChild
            size='sm'
            className='bg-chart-2 hover:bg-chart-2/90 mt-5 w-full rounded-full text-white sm:w-auto'
          >
            <Link href='/pricing' prefetch={false}>
              View pricing
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
