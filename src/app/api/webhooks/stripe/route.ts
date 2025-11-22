import { headers } from 'next/headers'
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
})

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) return
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session

          if (checkoutSession.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              checkoutSession.subscription as string
            )

            // Récupérer l'organisation via le customer_id
            const { data: orgRaw } = await (supabase.from('organisations') as any)
              .select('id')
              .eq('stripe_id', checkoutSession.customer)
              .single() as any

            const org = orgRaw as any

            if (org) {
              // Mettre à jour le plan de l'organisation
              await (supabase.from('organisations') as any)
                .update({
                  plan: subscription.items.data[0].price.lookup_key || subscription.items.data[0].price.id,
                  trial_ends: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
                })
                .eq('id', org.id)
            }
          }
          break

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription

          // Mettre à jour le statut de l'abonnement
          const { data: orgRaw } = await (supabase.from('organisations') as any)
            .select('id')
            .eq('stripe_id', subscription.customer)
            .single() as any

          const org = orgRaw as any

          if (org) {
            await (supabase.from('organisations') as any)
              .update({
                plan: event.type === 'customer.subscription.deleted' ? null : subscription.items.data[0].price.lookup_key,
                trial_ends: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              })
              .eq('id', org.id)
          }
          break

        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new NextResponse('Webhook error: "Webhook handler failed. View logs."', {
        status: 400,
      })
    }
  }

  return NextResponse.json({ received: true })
}
