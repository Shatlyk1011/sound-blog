'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../ui/button'

const FeedbackDialog = dynamic(() => import('../layout/FeedbackDialog').then((mod) => mod.FeedbackDialog), {
  ssr: false,
})

const FAQ_ITEMS = [
  {
    question: 'Can I try Sound Blog without signing in?',
    answer: 'Yes. The demo shows the voice card, audio player, status, and blog workflow before you create an account.',
  },
  {
    question: 'What happens after I upload a recording?',
    answer: 'Sound Blog prepares your audio, turns it into a transcript, and helps shape it into a clean blog draft.',
  },
  {
    question: 'Can I control the final writing style?',
    answer:
      'You can choose tone, length, structure, and enhancements so the article feels like your voice. Also you can edit your final blog article once it created.',
  },
]

const FAQ = () => {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

  return (
    <>
      <section className='mx-auto w-full max-w-7xl px-4 py-40 max-sm:py-20 sm:px-10'>
        <div className='grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start'>
          <div className='border-border bg-foreground text-background rounded-[2rem] border p-8 shadow-xl'>
            <span className='bg-background/10 mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase'>
              FAQ
            </span>
            <h3 className='font-serif text-3xl font-bold tracking-tight max-sm:text-2xl max-sm:text-balance'>
              Questions before you try it?
            </h3>
            <p className='text-background/70 mt-4 text-sm leading-6 max-sm:text-balance'>
              See how the demo fits into the full workflow, then share what you want us to improve next.
            </p>
            <Button
              className='bg-background text-foreground hover:bg-background/90 mt-6'
              size='lg'
              type='button'
              onClick={() => setIsFeedbackDialogOpen(true)}
            >
              Write a review
            </Button>
          </div>

          <div className='grid gap-4'>
            {FAQ_ITEMS.map((item) => (
              <article
                key={item.question}
                className='border-border bg-card rounded-[1.75rem] border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg max-sm:text-balance'
              >
                <h4 className='text-lg font-bold max-sm:text-base'>{item.question}</h4>
                <p className='text-muted-foreground mt-2 font-serif leading-7 max-sm:text-sm max-sm:leading-relaxed'>
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isFeedbackDialogOpen && <FeedbackDialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />}
    </>
  )
}

export default FAQ
