import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Supabase
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const durationStr = formData.get('duration') as string | null
    const duration = durationStr ? Math.ceil(parseFloat(durationStr)) : 0

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 3. Find corresponding Payload user
    const payload = await getPayload({ config: configPromise })

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        userId: {
          equals: user.id,
        },
      },
    })

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User profile not found in database' },
        { status: 404 }
      )
    }
    const payloadUser = users[0]
    const payloadUserId = payloadUser.id

    // 4. Validate credits
    // Sum all active (non-expired) credit grants for this user
    const now = new Date()
    const { docs: creditDocs } = await payload.find({
      collection: 'credit-history',
      where: {
        and: [
          { userId: { equals: user.id } },
          { status: { equals: 'active' } },
          { expirationDate: { greater_than: now.toISOString() } },
        ],
      },
      limit: 1000,
    })

    const totalCredits = creditDocs.reduce(
      (sum, doc) =>
        sum + (typeof doc.creditAmount === 'number' ? doc.creditAmount : 0),
      0
    )
    const creditsSpent = payloadUser.creditsSpent!
    const availableCredits = totalCredits - creditsSpent

    if (duration > availableCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: duration,
          available: availableCredits,
        },
        { status: 402 }
      )
    }

    // 5. Upload to Cloudflare Worker
    const workerUrl = process.env.WORKER_URL
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!publicUrl || !workerUrl) {
      console.error('Missing R2_PUBLIC_URL or WORKER_URL environment variable')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const workerFormData = new FormData()
    workerFormData.append('audio', file)

    const workerRes = await fetch(workerUrl, {
      method: 'POST',
      body: workerFormData,
    })

    if (!workerRes.ok) {
      const errorText = await workerRes.text()
      console.error('Error from Cloudflare Worker:', errorText)
      return NextResponse.json(
        { error: 'Failed to upload audio to processing worker' },
        { status: 500 }
      )
    }

    const workerData = await workerRes.json()
    const fileUrl = `${publicUrl}/${workerData.key}`

    // 6. Create VoiceRecord in Payload CMS
    const newRecord = await payload.create({
      collection: 'voice-records',
      data: {
        fileUrl,
        fileName: file.name,
        userId: payloadUserId as string, // Payload document ID
        duration,
        status: 'uploaded',
      },
    })

    // 7. Deduct credits — update creditsSpent on the User document
    await payload.update({
      collection: 'users',
      id: payloadUserId as string,
      data: {
        creditsSpent: creditsSpent + duration,
      },
    })

    return NextResponse.json({
      success: true,
      record: newRecord,
      credits: {
        used: duration,
        remaining: availableCredits - duration,
      },
    })
  } catch (err: unknown) {
    console.error('Error uploading voice record:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
