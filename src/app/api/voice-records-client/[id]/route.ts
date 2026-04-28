import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const payloadUserId = users[0].id

    // Check if the record belongs to the user
    const record = await payload.findByID({
      collection: 'voice-records',
      id,
    })

    if (
      !record ||
      (typeof record.userId === 'object' ? record.userId.id : record.userId) !==
        payloadUserId
    ) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 404 }
      )
    }


    await Promise.all([
      payload.delete({
        collection: 'blogs',
        where: {
          recordId: {
            equals: id,
          },
        },
      }),
      payload.delete({
        collection: 'transcripts',
        where: {
          recordId: {
            equals: id,
          },
        },
      }),

      payload.delete({
        collection: 'voice-records',
        id: id,
      })
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Error deleting voice record:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
