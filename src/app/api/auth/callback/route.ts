import { NextResponse } from 'next/server'
import { getClientByUserId, createClientRecord, createInitialCredits } from '@/lib/credit-helpers'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const existingClient = await getClientByUserId(user.id)
        if (!existingClient) {
          const provider = user.app_metadata?.provider as string | undefined

          await Promise.all([
            createClientRecord(
              user.id,
              user.email ?? undefined,
              (provider || 'n/a') as 'email' | 'google' | 'github' | 'n/a' | null | undefined
            ),
            createInitialCredits(user.id),
          ])
        }
      }

      return NextResponse.redirect(new URL(safeNext, appUrl))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', appUrl))
}
