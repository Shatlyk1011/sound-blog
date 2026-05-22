import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase-server'
import {
  ALLOWED_AUDIO_TYPES,
  buildR2PublicUrl,
  createPresignedR2PutUrl,
  extensionFromFileName,
  getR2VoiceConfig,
  MAX_AUDIO_FILE_SIZE_BYTES,
} from '../_shared'

type PresignUploadBody = {
  contentType?: unknown
  fileName?: unknown
  size?: unknown
}

const toNumber = (value: unknown) =>
  typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) : NaN

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as PresignUploadBody
    const fileName = typeof body.fileName === 'string' ? body.fileName : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const size = toNumber(body.size)

    if (!fileName || !contentType || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Missing audio upload metadata' }, { status: 400 })
    }

    if (!ALLOWED_AUDIO_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Unsupported audio file type' }, { status: 415 })
    }

    if (size > MAX_AUDIO_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Audio file is too large' }, { status: 413 })
    }

    const r2Config = getR2VoiceConfig()

    if (!r2Config) {
      console.error('Missing R2 environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const key = `voice-records/${supabaseUser.id}/${randomUUID()}${extensionFromFileName(fileName)}`

    return NextResponse.json({
      success: true,
      file: {
        uploadUrl: createPresignedR2PutUrl({
          config: r2Config,
          key,
          contentType,
        }),
        url: buildR2PublicUrl(r2Config.publicUrl, key),
        key,
        fileName,
        contentType,
        size,
      },
    })
  } catch (err: unknown) {
    console.error('Error creating voice record upload URL:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
