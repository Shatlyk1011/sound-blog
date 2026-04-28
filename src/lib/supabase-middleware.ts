import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that are publicly accessible (no auth required)
const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up', '/pricing']

// Routes that only unauthenticated users should access
// (authenticated users are redirected away from these)
const AUTH_ONLY_ROUTES = ['/sign-in', '/sign-up']

// Routes that bypass all auth checks entirely (Next.js middleware should also exclude these)
const BYPASS_ROUTES = ['/api/auth/callback', '/admin', '/api']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Refresh session if expired — must happen before any redirect checks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Bypass middleware entirely for Payload CMS admin routes and Supabase auth callback
  if (BYPASS_ROUTES.some((r) => pathname.startsWith(r))) {
    return supabaseResponse
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname)

  // Unauthenticated user trying to access a protected route → redirect to /sign-in
  if (!user && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/sign-in'
    return NextResponse.redirect(redirectUrl)
  }

  if (user && pathname === '/') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated user trying to access sign-in or sign-up → redirect to /
  if (user && isAuthOnlyRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
