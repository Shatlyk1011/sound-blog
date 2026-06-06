import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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
      limit: 1,
    })

    if (users.length === 0) {
      return NextResponse.json({ record: null })
    }

    const { docs } = await payload.find({
      collection: 'voice-records',
      where: {
        and: [{ id: { equals: id } }, { userId: { equals: users[0].id } }],
      },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })

    if (docs.length === 0) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ record: docs[0] })
  } catch (err: unknown) {
    console.error('Error fetching voice record:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
