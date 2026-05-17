import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * Stripe webhook handler.
 *
 * Register this URL in the Stripe Dashboard under
 * Developers → Webhooks → Add endpoint:
 *   https://yourdomain.com/api/stripe/webhook
 *
 * Events to listen for:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent> extends Promise<infer T>
    ? T
    : ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err)
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId

        console.log(`[stripe/webhook] checkout.session.completed | userId=${userId} planId=${planId}`)

        // TODO: Update your database here.
        // Example: update the user's subscription tier in Supabase
        // await supabase.from('subscriptions').upsert({ user_id: userId, plan_id: planId, ... })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log(`[stripe/webhook] subscription updated | id=${subscription.id} status=${subscription.status}`)
        // TODO: sync subscription status to your DB
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log(`[stripe/webhook] subscription deleted | id=${subscription.id}`)
        // TODO: downgrade user to free tier
        break
      }

      default:
        console.log(`[stripe/webhook] unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
