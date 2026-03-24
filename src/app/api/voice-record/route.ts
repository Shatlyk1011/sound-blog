import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
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
    const duration = durationStr ? parseFloat(durationStr) : 0

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
    const payloadUserId = users[0].id

    // 4. Upload to Cloudflare R2
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

    // 5. Create VoiceRecord in Payload CMS
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

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: unknown) {
    console.error('Error uploading voice record:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
