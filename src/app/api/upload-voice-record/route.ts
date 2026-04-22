import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { createClient } from '@/lib/supabase-server';








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

    // 5. Upload to Cloudflare R2
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!accessKeyId || !secretAccessKey || !publicUrl) {
      console.error('Missing R2 environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_VOICE_RECORD_BUCKET, // Cloudflare R2 bucket name
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type || 'audio/webm',
      })
    )

    const fileUrl = `${publicUrl}/${uniqueFileName}`

    const audioTitle = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')
    const customId = `${audioTitle}-${Math.floor(1000 + Math.random() * 9000)}`

    // 6. Create VoiceRecord in Payload CMS
    const newRecord = await payload.create({
      collection: 'voice-records',
      data: {
        id: customId,
        fileUrl,
        fileName: file.name,
        userId: payloadUserId as string, // Payload document ID
        duration,
        status: 'uploaded',
      },
    })

    // 5.5 Send request to worker
    const workerUrl = process.env.WORKER_URL
    if (workerUrl) {
      try {
        const workerResponse = await fetch(`${workerUrl}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recordId: customId,
            key: uniqueFileName,
            fileName: file.name,
            contentType: file.type || 'audio/webm',
            size: file.size,
          }),
        })

        if (!workerResponse.ok) {
          console.error('Failed to notify worker:', await workerResponse.text())
          // We can choose to fail the request or just log it. We'll proceed with creating the record for now.
        }
      } catch (workerErr) {
        console.error('Error notifying worker:', workerErr)
      }
    } else {
      console.warn('Missing WORKER_URL environment variable')
    }

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
