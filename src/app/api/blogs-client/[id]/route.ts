import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createClient } from '@/lib/supabase-server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing blog id' }, { status: 400 })
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const payloadUser = users[0]

    const existingBlog = await payload.findByID({
      collection: 'blogs',
      id,
    })

    if (
      !existingBlog ||
      (typeof existingBlog.userId === 'object' ? existingBlog.userId.id : existingBlog.userId) !== payloadUser.id
    ) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    const updatedDoc = await payload.update({
      collection: 'blogs',
      id,
      data: {
        content: body.content,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ doc: updatedDoc })
  } catch (err: unknown) {
    console.error('Error updating blog:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
