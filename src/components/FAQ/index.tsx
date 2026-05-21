import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

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
    answer: 'You can choose tone, length, structure, and enhancements so the article feels like your voice.',
  },
]

const FAQ = () => {
  return (
    <section className='mx-auto w-full max-w-7xl px-4 py-40 sm:px-10'>
      <div className='grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start'>
        <div className='border-border bg-foreground text-background rounded-[2rem] border p-8 shadow-xl'>
          <span className='bg-background/10 mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase'>
            FAQ
          </span>
          <h3 className='font-serif text-3xl font-bold tracking-tight'>Questions before you try it?</h3>
          <p className='text-background/70 mt-4 text-sm leading-6'>
            See how the demo fits into the full workflow, then share what you want us to improve next.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-background text-foreground hover:bg-background/90 mt-6' size='lg'>
                Write a review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Please write your review</DialogTitle>
                <DialogDescription>
                  Tell us what you think about the Sound Blog demo. Your feedback helps shape the product.
                </DialogDescription>
              </DialogHeader>
              <textarea
                className='border-input bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 min-h-32 w-full resize-none rounded-3xl border px-4 py-3 text-sm transition outline-none focus-visible:ring-[3px]'
                placeholder='Please write your review...'
              />
              <DialogFooter showCloseButton>
                <Button type='button'>Submit review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid gap-4'>
          {FAQ_ITEMS.map((item) => (
            <article
              key={item.question}
              className='border-border bg-card rounded-[1.75rem] border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              <h4 className='text-lg font-bold'>{item.question}</h4>
              <p className='text-muted-foreground mt-2 leading-7'>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
