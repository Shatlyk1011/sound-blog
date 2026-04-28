import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
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
      return NextResponse.json({ docs: [] })
    }

    const payloadUserId = users[0].id

    const { docs, totalDocs, hasNextPage } = await payload.find({
      collection: 'voice-records',
      depth: 0,
      where: {
        userId: {
          equals: payloadUserId,
        },
      },
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({ docs, totalDocs, hasNextPage })
  } catch (err: unknown) {
    console.error('Error fetching voice records:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
