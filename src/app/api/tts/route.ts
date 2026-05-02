import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { TTS_VOICE_HEADER_URL } from '@/lib/constants'

const WORKER_URL = process.env.WORKER_URL

/**
 * Strips markdown/MDX syntax from text to produce clean plain text for TTS.
 */
function stripMarkdown(md: string): string {
  return (
    md
      // Remove frontmatter
      .replace(/^---[\s\S]*?---\n?/m, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Remove links, keep label
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove headings hashes
      .replace(/^#{1,6}\s+/gm, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // Remove bold/italic
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      // Remove strikethrough
      .replace(/~~([^~]+)~~/g, '$1')
      // Remove unordered list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // Remove ordered list markers
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Collapse multiple blank lines
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

export async function POST(req: NextRequest) {
  try {
    const { text, lang, blogId } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text field' }, { status: 400 })
    }

    const cleanText = stripMarkdown(text)

    if (!WORKER_URL) {
      return NextResponse.json({ error: 'Worker URL not configured' }, { status: 500 })
    }

    const workerRes = await fetch(`${WORKER_URL}/text-to-sound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, lang }),
    })

    if (!workerRes.ok) {
      const errorBody = await workerRes.text()
      console.error('Worker TTS error:', errorBody)
      return NextResponse.json({ error: 'TTS generation failed', details: errorBody }, { status: workerRes.status })
    }

    // Worker returns { audio: "<base64 encoded MP3>" }
    const audio = await workerRes.json()
    if (!audio) {
      return NextResponse.json({ error: 'No audio returned from worker' }, { status: 502 })
    }

    const audioBuffer = Buffer.from(audio, 'base64')

    // --- Upload to Cloudflare R2 & persist URL to Payload ---
    let ttsVoiceUrl: string | null = null

    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const publicUrl = process.env.R2_PUBLIC_URL
    const ttsBucket = process.env.R2_TTS_BUCKET || 'voice-records/tts'

    if (accessKeyId && secretAccessKey && publicUrl && ttsBucket) {
      try {
        const s3 = new S3Client({
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT_URL,
          credentials: { accessKeyId, secretAccessKey },
        })

        const fileName = `tts-${blogId ?? Date.now()}-${Date.now()}.mp3`

        await s3.send(
          new PutObjectCommand({
            Bucket: ttsBucket,
            Key: fileName,
            Body: audioBuffer,
            ContentType: 'audio/mpeg',
          })
        )

        ttsVoiceUrl = `${publicUrl}/${fileName}`

        console.log('ttsVoiceUrl', ttsVoiceUrl)

        // Persist URL to the blog document if blogId was provided
        if (blogId && typeof blogId === 'string') {
          try {
            const payload = await getPayload({ config: configPromise })
            await payload.update({
              collection: 'blogs',
              id: blogId,
              data: { ttsVoiceUrl },
            })
          } catch (payloadErr) {
            console.error('Failed to save ttsVoiceUrl to blog doc:', payloadErr)
            // Non-fatal — audio still returned to client
          }
        }
      } catch (r2Err) {
        console.error('R2 TTS upload error:', r2Err)
        // Non-fatal — fall through and still return audio
      }
    } else {
      console.warn('R2 TTS env vars not fully configured; skipping upload')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    }

    if (ttsVoiceUrl) {
      headers[TTS_VOICE_HEADER_URL] = ttsVoiceUrl
    }

    return new NextResponse(audioBuffer, { status: 200, headers })
  } catch (err: unknown) {
    console.error('TTS route error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
