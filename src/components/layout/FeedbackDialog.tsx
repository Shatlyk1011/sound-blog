'use client'

import { type SubmitEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FEEDBACK_TYPE_OPTIONS, type FeedbackType } from '@/lib/feedback'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface FeedbackFormState {
  type: FeedbackType
  email: string
  message: string
}

const getDefaultFeedbackForm = (email?: string): FeedbackFormState => ({
  type: 'improvement',
  email: email ?? '',
  message: '',
})

interface FeedbackDialogProps {
  email?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ email, open, onOpenChange }: FeedbackDialogProps) {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormState>(() => getDefaultFeedbackForm(email))
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  useEffect(() => {
    setFeedbackForm((currentValue) => ({
      ...currentValue,
      email: currentValue.email || email || '',
    }))
  }, [email])

  const handleFeedbackFieldChange = (field: keyof FeedbackFormState, value: string) => {
    setFeedbackForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const handleFeedbackSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitFeedback()
  }

  const submitFeedback = async () => {
    if (isSubmittingFeedback) return

    const normalizedMessage = feedbackForm.message.trim()

    if (!normalizedMessage) {
      toast.error('Add your feedback before sending.')
      return
    }

    setIsSubmittingFeedback(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackForm.type,
          email: feedbackForm.email.trim(),
          message: normalizedMessage,
        }),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to submit feedback')
      }

      toast.success('Feedback sent. Thanks.')
      onOpenChange(false)
      setFeedbackForm(getDefaultFeedbackForm(email))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            Share what works, what blocks you, or what should improve next. Your message is saved directly in the
            product feedback inbox.
          </DialogDescription>
        </DialogHeader>

        <form className='space-y-4' onSubmit={handleFeedbackSubmit}>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='grid gap-2'>
              <span className='text-sm font-medium'>Feedback type</span>
              <select
                className='border-input bg-input/30 text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-4xl border px-3 text-sm transition outline-none focus-visible:ring-[3px]'
                value={feedbackForm.type}
                onChange={(event) => handleFeedbackFieldChange('type', event.target.value)}
                disabled={isSubmittingFeedback}
              >
                {FEEDBACK_TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className='grid gap-2'>
              <span className='text-sm font-medium'>Your email</span>
              <Input
                type='email'
                placeholder='you@example.com'
                value={feedbackForm.email}
                onChange={(event) => handleFeedbackFieldChange('email', event.target.value)}
                disabled={isSubmittingFeedback}
              />
            </label>
          </div>

          <label className='grid gap-2'>
            <span className='text-sm font-medium'>Feedback</span>
            <textarea
              className='border-input bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-36 w-full resize-none rounded-[1.75rem] border px-4 py-3 text-sm transition outline-none focus-visible:ring-[3px]'
              placeholder='Tell me what you liked, what felt off, or what should change.'
              value={feedbackForm.message}
              onChange={(event) => handleFeedbackFieldChange('message', event.target.value)}
              disabled={isSubmittingFeedback}
              required
            />
          </label>

          <DialogFooter showCloseButton>
            <Button type='submit' disabled={isSubmittingFeedback}>
              {isSubmittingFeedback ? 'Sending...' : 'Send feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
