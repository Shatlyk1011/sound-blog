import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { feedbackTypeValues, type FeedbackType } from '@/lib/feedback'
import { createClient } from '@/lib/supabase-server'

interface FeedbackRequestBody {
  type?: string
  email?: string
  message?: string
}

const isValidFeedbackType = (value: string): value is FeedbackType => {
  return feedbackTypeValues.includes(value as FeedbackType)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackRequestBody
    const feedbackType = body.type?.trim()
    const email = body.email?.trim() || undefined
    const message = body.message?.trim()

    if (!feedbackType || !isValidFeedbackType(feedbackType)) {
      return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: 'Feedback message is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        userId: {
          equals: user.id,
        },
      },
      limit: 1,
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const feedback = await payload.create({
      collection: 'feedback',
      data: {
        userId: users[0].id,
        email,
        type: feedbackType,
        message,
        source: 'dashboard-sidebar',
        status: 'new',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ doc: feedback }, { status: 201 })
  } catch (err: unknown) {
    console.error('Error creating feedback:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
