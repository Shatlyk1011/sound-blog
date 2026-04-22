import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Parse incoming JSON body
    const body = await req.json()
    const { audioKey, transcript, wordCount, vtt } = body

    if (!audioKey || !transcript) {
      return NextResponse.json(
        { error: 'Missing audioKey or transcript in request body' },
        { status: 400 }
      )
    }

    // 2. Find the corresponding VoiceRecord by audioKey
    // The voice record fileUrl usually contains the audioKey
    const { docs: voiceRecords } = await payload.find({
      collection: 'voice-records',
      where: {
        fileUrl: {
          contains: audioKey,
        },
      },
    })

    if (voiceRecords.length === 0) {
      return NextResponse.json(
        { error: 'Corresponding VoiceRecord not found' },
        { status: 404 }
      )
    }

    const voiceRecord = voiceRecords[0]
    const userId =
      typeof voiceRecord.userId === 'object'
        ? voiceRecord.userId.id
        : voiceRecord.userId

    // 3. Create a new Transcript document
    const newTranscript = await payload.create({
      collection: 'transcripts',
      data: {
        audioId: voiceRecord.id,
        userId: userId as string,
        rawText: transcript,
        wordCount: wordCount,
        vtt: vtt,
      },
    })

    // 4. Update the VoiceRecord status to 'completed'
    await payload.update({
      collection: 'voice-records',
      id: voiceRecord.id,
      data: {
        status: 'completed',
      },
    })

    return NextResponse.json({
      success: true,
      transcript: newTranscript,
    })
  } catch (err: unknown) {
    console.error('Error uploading transcript:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
