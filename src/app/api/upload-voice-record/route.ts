import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

const MAX_AUDIO_FILE_SIZE_BYTES = 25 * 1024 * 1024
const MAX_AUDIO_DURATION_SECONDS = 60 * 60
const ALLOWED_AUDIO_TYPES = new Set([
  'audio/aac',
  'audio/flac',
  'audio/m4a',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-m4a',
  'audio/x-wav',
])

const extensionFromFileName = (fileName: string) => {
  const extension = fileName.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]
  return extension ? `.${extension}` : '.webm'
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Supabase
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    const durationStr = formData.get('duration') as string | null
    const duration = durationStr ? Math.ceil(parseFloat(durationStr)) : 0

    const filtersStr = formData.get('filters')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_AUDIO_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported audio file type' }, { status: 415 })
    }

    if (file.size <= 0 || file.size > MAX_AUDIO_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Audio file is too large' }, { status: 413 })
    }

    if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_AUDIO_DURATION_SECONDS) {
      return NextResponse.json({ error: 'Invalid audio duration' }, { status: 400 })
    }

    // 3. Find corresponding Payload user
    const payload = await getPayload({ config: configPromise })

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        userId: {
          equals: supabaseUser.id,
        },
      },
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found in database' }, { status: 404 })
    }
    const payloadUser = users[0]
    const payloadDocId = payloadUser.id as string

    // 4. Validate credits
    // Sum all active (non-expired) credit grants for this user
    const now = new Date()
    const { docs: creditDocs } = await payload.find({
      collection: 'credit-history',
      where: {
        and: [
          { userId: { equals: supabaseUser.id } },
          { status: { equals: 'active' } },
          { expirationDate: { greater_than: now.toISOString() } },
        ],
      },
      limit: 1000,
    })

    const totalCredits = creditDocs.reduce(
      (sum, doc) => sum + (typeof doc.creditAmount === 'number' ? doc.creditAmount : 0),
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
    const endpoint = process.env.R2_ENDPOINT_URL
    const publicUrl = process.env.R2_PUBLIC_URL
    const voiceBucket = process.env.R2_VOICE_RECORD_BUCKET

    if (!accessKeyId || !secretAccessKey || !endpoint || !publicUrl || !voiceBucket) {
      console.error('Missing R2 environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const uniqueFileName = `voice-records/${randomUUID()}${extensionFromFileName(file.name)}`

    await s3.send(
      new PutObjectCommand({
        Bucket: voiceBucket,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const fileUrl = `${publicUrl}/${uniqueFileName}`

    const audioTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^\w-]+/g, '_')
      .slice(0, 80)
    const customRecordId = `${audioTitle || 'recording'}-${randomUUID()}`

    // 6. Create VoiceRecord in Payload CMS
    const newRecord = await payload.create({
      collection: 'voice-records',
      data: {
        id: customRecordId,
        fileUrl,
        fileName: file.name,
        userId: payloadDocId, // Payload document ID
        duration,
        status: 'uploaded',
      },
    })

    // 7 Send request to worker
    const workerUrl = process.env.WORKER_URL
    if (workerUrl) {
      try {
        const workerResponse = await fetch(`${workerUrl}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: payloadDocId,
            recordId: customRecordId,
            key: uniqueFileName,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            filters: filtersStr,
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

    // 8. Deduct credits — update creditsSpent on the User document
    await payload.update({
      collection: 'users',
      id: payloadDocId,
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
