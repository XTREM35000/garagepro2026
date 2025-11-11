export type SiteConfig = {
  name: string
  description: string
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: string
} & (
    | {
      href: string
      items?: never
    }
    | {
      href?: string
      items: NavItem[]
    }
  )

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
  price: number
  features: string[]
}

export type UserRole = 'super_admin' | 'admin' | 'agent' | 'viewer'

export type Organisation = {
  id: string
  name: string
  tenant_id: string
  stripe_id?: string
  plan?: string
  trial_ends?: Date
  created_at: Date
  settings?: Settings
  users: User[]
}

export type User = {
  id: string
  email: string
  name?: string
  role: UserRole
  organisation_id: string
  organisation?: Organisation
  created_at: Date
}

export type Settings = {
  id: string
  logo_url?: string
  company_name: string
  slogan?: string
  theme?: 'light' | 'dark'
  rccm?: string
  organisation_id: string
  organisation?: Organisation
}