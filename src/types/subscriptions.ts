export interface SubscriptionPlan {
  name: string
  description: string
  stripePriceId: string
  price: number
  features: string[]
  interval?: 'month' | 'year'
  currency?: string
  popular?: boolean
  metadata?: Record<string, unknown>
}

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'unpaid'
  | 'paused'

export interface CustomerSubscription {
  id: string
  status: SubscriptionStatus
  priceId: string
  quantity: number
  cancelAtPeriodEnd: boolean
  created: string
  currentPeriodStart: string
  currentPeriodEnd: string
  endedAt: string | null
  cancelAt: string | null
  canceledAt: string | null
  trialStart: string | null
  trialEnd: string | null
  customer: {
    id: string
    email: string
    name: string | null
  }
}

export interface StripeMetadata {
  userId: string
  priceId: string
}