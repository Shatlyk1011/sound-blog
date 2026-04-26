import { NextResponse } from 'next/server';
import { getClientByUserId, createClientRecord, createInitialCredits } from '@/lib/credit-helpers';
import { createClient } from '@/lib/supabase-server';











export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const user = data.session?.user

      console.log('XXXX', user)
      if (user) {
        const existingClient = await getClientByUserId(user.id)
        if (!existingClient) {
          const provider = user.app_metadata?.provider as string | undefined
          const validProvider =
            provider && ['google', 'github', 'email'].includes(provider)
              ? (provider as 'google' | 'github' | 'email')
              : 'n/a'

          await createClientRecord(
            user.id,
            user.email ?? undefined,
            validProvider
          )
          await createInitialCredits(user.id)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
