import { NextResponse } from 'next/server'
import { stripe, createStripeSession } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'
import { z } from 'zod'
import type { Database } from '@/types/supabase'
import type Stripe from 'stripe'

const checkoutSchema = z.object({
  priceId: z.string().min(1),
})

type CheckoutRequest = z.infer<typeof checkoutSchema>

interface CreateSessionParams {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
  metadata?: Stripe.Metadata
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { priceId } = checkoutSchema.parse(json)

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: userDataRaw, error: userError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single() as any

    const userData = userDataRaw as any

    if (userError || !userData?.organisation_id) {
      return new NextResponse('Organisation non trouvée', { status: 404 })
    }

    // Récupérer l'organisation avec son stripe_id
    const { data: orgRaw, error: orgError } = await supabase
      .from('organisations')
      .select('stripe_id, name')
      .eq('id', userData.organisation_id)
      .single() as any

    const org = orgRaw as any

    if (orgError) {
      return new NextResponse('Erreur lors de la récupération de l\'organisation', { status: 500 })
    }

    let customerId = org?.stripe_id

    // Créer un client Stripe si nécessaire
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: org?.name || undefined,
        metadata: {
          organisation_id: userData.organisation_id,
          user_id: user.id
        },
      })
      customerId = customer.id

      // Mettre à jour l'organisation avec le stripe_id
      const { error: updateError } = await (supabase
        .from('organisations') as any)
        .update({ stripe_id: customerId })
        .eq('id', userData.organisation_id)

      if (updateError) {
        throw new Error('Erreur lors de la mise à jour du stripe_id')
      }
    }

    const headersList = headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL

    if (!origin) {
      throw new Error('Origin header is required')
    }

    // Créer la session de paiement
    const sessionParams: CreateSessionParams = {
      priceId,
      customerId,
      successUrl: `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pricing?canceled=true`,
      metadata: {
        organisation_id: userData.organisation_id,
        user_id: user.id
      }
    }

    const session = await createStripeSession(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur de checkout:', error)

    if (error instanceof z.ZodError) {
      return new NextResponse('Données de requête invalides', { status: 400 })
    }

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse('Erreur interne', { status: 500 })
  }
}