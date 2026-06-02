import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { deleteR2ObjectFromUrl } from '@/lib/r2'
import { createClient } from '@/lib/supabase-server'
import {
  ALLOWED_AUDIO_TYPES,
  buildR2PublicUrl,
  getR2VoiceConfig,
  MAX_AUDIO_DURATION_SECONDS,
  MAX_AUDIO_FILE_SIZE_BYTES,
  sanitizeAudioTitle,
  trimSlashes,
} from './_shared'

type ProcessVoiceRecordBody = {
  contentType?: unknown
  duration?: unknown
  fileName?: unknown
  fileUrl?: unknown
  filters?: unknown
  key?: unknown
  size?: unknown
}

const toNumber = (value: unknown) =>
  typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) : NaN

export async function POST(req: NextRequest) {
  let uploadedFileUrl: string | null = null

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

    // 2. Parse R2 upload metadata. The file has already been uploaded directly from the browser to R2.
    const body = (await req.json()) as ProcessVoiceRecordBody
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl : ''
    const key = typeof body.key === 'string' ? trimSlashes(body.key) : ''
    const fileName = typeof body.fileName === 'string' ? body.fileName : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const size = toNumber(body.size)
    const duration = Math.ceil(toNumber(body.duration))
    const filters = typeof body.filters === 'string' ? body.filters : JSON.stringify(body.filters ?? [])

    if (!fileUrl || !key || !fileName || !contentType || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Missing uploaded audio metadata' }, { status: 400 })
    }

    uploadedFileUrl = fileUrl

    if (!key.startsWith(`voice-records/${supabaseUser.id}/`)) {
      return NextResponse.json({ error: 'Invalid uploaded audio key' }, { status: 400 })
    }

    if (!ALLOWED_AUDIO_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Unsupported audio file type' }, { status: 415 })
    }

    if (size > MAX_AUDIO_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Audio file is too large' }, { status: 413 })
    }

    if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_AUDIO_DURATION_SECONDS) {
      return NextResponse.json({ error: 'Invalid audio duration' }, { status: 400 })
    }

    const r2Config = getR2VoiceConfig()

    if (!r2Config) {
      console.error('Missing R2 environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (fileUrl !== buildR2PublicUrl(r2Config.publicUrl, key)) {
      return NextResponse.json({ error: 'Uploaded audio URL does not match storage configuration' }, { status: 400 })
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint: r2Config.endpoint,
      credentials: {
        accessKeyId: r2Config.accessKeyId,
        secretAccessKey: r2Config.secretAccessKey,
      },
    })

    const uploadedObject = await s3.send(
      new HeadObjectCommand({
        Bucket: r2Config.voiceBucket,
        Key: key,
      })
    )

    if (uploadedObject.ContentType && uploadedObject.ContentType !== contentType) {
      return NextResponse.json({ error: 'Uploaded audio content type mismatch' }, { status: 400 })
    }

    if (typeof uploadedObject.ContentLength === 'number' && uploadedObject.ContentLength !== size) {
      return NextResponse.json({ error: 'Uploaded audio size mismatch' }, { status: 400 })
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
      await deleteR2ObjectFromUrl({
        bucket: r2Config.voiceBucket,
        logPrefix: 'VoiceRecordProcess',
        url: uploadedFileUrl,
      })

      return NextResponse.json({ error: 'User profile not found in database' }, { status: 404 })
    }

    const payloadUser = users[0]
    const payloadDocId = payloadUser.id as string

    // 4. Validate credits
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
      await deleteR2ObjectFromUrl({
        bucket: r2Config.voiceBucket,
        logPrefix: 'VoiceRecordProcess',
        url: uploadedFileUrl,
      })

      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: duration,
          available: availableCredits,
        },
        { status: 402 }
      )
    }

    const audioTitle = sanitizeAudioTitle(fileName)
    const customRecordId = `${audioTitle || 'recording'}-${randomUUID()}`

    // 5. Create VoiceRecord in Payload CMS
    const newRecord = await payload.create({
      collection: 'voice-records',
      data: {
        id: customRecordId,
        fileUrl,
        fileName,
        userId: payloadDocId,
        duration,
        status: 'uploaded',
      },
    })

    // 6. Send request to worker
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
            key,
            fileName,
            contentType,
            size,
            filters,
          }),
        })

        if (!workerResponse.ok) {
          console.error('Failed to notify worker:', await workerResponse.text())
        }
      } catch (workerErr) {
        console.error('Error notifying worker:', workerErr)
      }
    } else {
      console.warn('Missing WORKER_URL environment variable')
    }

    // 7. Deduct credits after the record exists and the worker has been notified
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
    console.error('Error processing uploaded voice record:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
