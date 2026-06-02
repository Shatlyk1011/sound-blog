import type { User } from '@/payload-types'
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClientRecord, createInitialCredits, getClientByUserId } from '@/lib/credit-helpers'
import { createClient } from '@/lib/supabase-server'

const getAppUrl = (origin: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    return origin
  }

  try {
    return new URL(appUrl).origin
  } catch {
    console.warn('Invalid NEXT_PUBLIC_APP_URL. Falling back to request origin:', appUrl)
    return origin
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const appUrl = getAppUrl(origin)

  if (!code) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl))
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Supabase auth code exchange failed:', error.message)
      return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl))
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Supabase callback could not resolve user:', userError?.message)
      return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl))
    }

    const existingClient = await getClientByUserId(user.id)

    console.log('existingClient', existingClient)
    if (!existingClient) {
      const provider = user.app_metadata?.provider as string | undefined

      const appUserId = randomUUID()

      await createClientRecord({
        id: appUserId,
        userId: user.id,
        email: user.email,
        authProvider: (provider || 'n/a') as User['authProvider'],
      })
      await createInitialCredits(appUserId, user.id)
    }

    return NextResponse.redirect(new URL(safeNext, appUrl))
  } catch (err: unknown) {
    console.error('Error handling Supabase auth callback:', err)
    return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl))
  }
}
