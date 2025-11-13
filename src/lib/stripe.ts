import Stripe from 'stripe'

let stripe: Stripe | null = null

export const getStripeInstance = (): Stripe => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripe = new Stripe(key, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripe
}

export const getStripeCustomer = async (email: string) => {
  const stripeInstance = getStripeInstance()
  const customers = await stripeInstance.customers.list({ email })
  return customers.data[0]
}

export const createStripeCustomer = async (email: string, name?: string) => {
  const stripeInstance = getStripeInstance()
  return stripeInstance.customers.create({
    email,
    name,
  })
}

export const createStripeSession = async ({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
}) => {
  const stripeInstance = getStripeInstance()
  return stripeInstance.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

export const getStripePortalSession = async (customerId: string, returnUrl: string) => {
  const stripeInstance = getStripeInstance()
  return stripeInstance.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}