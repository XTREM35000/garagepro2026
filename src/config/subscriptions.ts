import type { SubscriptionPlan } from '@/types/subscriptions'

export const pricingPlans: SubscriptionPlan[] = [
  {
    name: 'Free',
    description: 'Parfait pour démarrer',
    stripePriceId: '',
    price: 0,
    features: [
      '1 organisation',
      '3 utilisateurs maximum',
      'Fonctionnalités de base',
      'Support communautaire',
    ],
  },
  {
    name: 'Starter',
    description: 'Pour les petites équipes',
    stripePriceId: 'price_starter',
    price: 29,
    features: [
      'Jusqu\'à 10 utilisateurs',
      'Toutes les fonctionnalités Free',
      'Support par email',
      'API access',
      'Analytics de base',
    ],
  },
  {
    name: 'Pro',
    description: 'Pour les entreprises en croissance',
    stripePriceId: 'price_pro',
    price: 99,
    features: [
      'Utilisateurs illimités',
      'Toutes les fonctionnalités Starter',
      'Support prioritaire',
      'API illimitée',
      'Analytics avancées',
      'Personnalisation complète',
      'SSO / SAML',
    ],
  },
]