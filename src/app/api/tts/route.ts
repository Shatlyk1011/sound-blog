import { NextRequest, NextResponse } from 'next/server';




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
    const { text, lang } = await req.json()

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

    console.log('workerRes', workerRes)

    if (!workerRes.ok) {
      const errorBody = await workerRes.text()
      console.error('Worker TTS error:', errorBody)
      return NextResponse.json({ error: 'TTS generation failed', details: errorBody }, { status: workerRes.status })
    }

    // MeloTTS worker returns raw binary MP3 with Content-Type: audio/mpeg
    const audioBuffer = await workerRes.arrayBuffer()

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    console.error('TTS route error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
