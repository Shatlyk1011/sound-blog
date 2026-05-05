import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const recordId = searchParams.get('recordId')

    if (!recordId) {
      return NextResponse.json({ error: 'Missing recordId' }, { status: 400 })
    }

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

    const payloadUser = users[0]

    const { docs, totalDocs } = await payload.find({
      collection: 'blogs',
      where: {
        and: [{ recordId: { equals: recordId } }, { userId: { equals: payloadUser.id } }],
      },
      depth: 1,
      limit: 1,
      overrideAccess: true,
    })

    return NextResponse.json({ docs, totalDocs })
  } catch (err: unknown) {
    console.error('Error fetching blog:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
