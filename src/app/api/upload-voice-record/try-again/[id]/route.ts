import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'
import { ALLOWED_AUDIO_TYPES, getR2VoiceConfig, trimSlashes } from '../../_shared'

const keyFromR2PublicUrl = (publicUrl: string, fileUrl: string) => {
  const publicBase = `${publicUrl.replace(/\/+$/, '')}/`

  if (!fileUrl.startsWith(publicBase)) {
    return null
  }

  return trimSlashes(decodeURIComponent(fileUrl.slice(publicBase.length)))
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const r2Config = getR2VoiceConfig()

    if (!r2Config) {
      console.error('Missing R2 environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const workerUrl = process.env.WORKER_URL

    if (!workerUrl) {
      return NextResponse.json({ error: 'Worker URL not configured' }, { status: 500 })
    }

    const payload = await getPayload({ config: configPromise })

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        userId: {
          equals: supabaseUser.id,
        },
      },
      limit: 1,
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found in database' }, { status: 404 })
    }

    const payloadUserId = users[0].id as string

    const record = await payload.findByID({
      collection: 'voice-records',
      id,
      depth: 0,
      overrideAccess: true,
    })

    const recordUserId = typeof record.userId === 'object' ? record.userId.id : record.userId

    if (recordUserId !== payloadUserId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    if (record.status !== 'failed') {
      return NextResponse.json({ error: 'Only failed voice records can be retried' }, { status: 400 })
    }

    const key = keyFromR2PublicUrl(r2Config.publicUrl, record.fileUrl)

    if (!key || !key.startsWith(`voice-records/${supabaseUser.id}/`)) {
      return NextResponse.json({ error: 'Stored audio URL does not match storage configuration' }, { status: 400 })
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

    const contentType = uploadedObject.ContentType
    const size = uploadedObject.ContentLength

    if (!contentType || !ALLOWED_AUDIO_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Stored audio file has an unsupported content type' }, { status: 415 })
    }

    if (typeof size !== 'number' || size <= 0) {
      return NextResponse.json({ error: 'Stored audio file is missing size metadata' }, { status: 400 })
    }

    await payload.update({
      collection: 'voice-records',
      id: record.id,
      data: {
        status: 'uploaded',
      },
      overrideAccess: true,
    })

    try {
      const workerResponse = await fetch(`${workerUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: payloadUserId,
          recordId: record.id,
          key,
          fileName: record.fileName,
          contentType,
          size,
          filters: '[]',
        }),
      })

      if (!workerResponse.ok) {
        await payload.update({
          collection: 'voice-records',
          id: record.id,
          data: {
            status: 'failed',
          },
          overrideAccess: true,
        })

        return NextResponse.json(
          { error: 'Failed to notify worker', details: await workerResponse.text() },
          { status: workerResponse.status }
        )
      }
    } catch (workerErr) {
      await payload.update({
        collection: 'voice-records',
        id: record.id,
        data: {
          status: 'failed',
        },
        overrideAccess: true,
      })

      console.error('Error notifying worker for voice record retry:', workerErr)
      return NextResponse.json({ error: 'Error notifying worker' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Error retrying voice record generation:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
