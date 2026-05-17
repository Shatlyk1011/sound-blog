import { NextRequest, NextResponse } from 'next/server'
import { getPriceId, stripe } from '@/lib/stripe'
import type { PlanId } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { planId } = (await req.json()) as { planId: PlanId }

    if (!planId) {
      return NextResponse.json({ error: 'planId is required' }, { status: 400 })
    }

    // Get authenticated user (optional — checkout works without it too)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const priceId = getPriceId(planId)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ui_mode: 'embedded_page' as const,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user?.email,
      metadata: {
        userId: user?.id ?? '',
        planId,
      },
      return_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    console.error('[stripe/create-checkout]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
