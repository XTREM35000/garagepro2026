export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          subscription_id: string | null
          subscription_status: string | null
          customer_id: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          customer_id?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          customer_id?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          price_id: string | null
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id: string
          user_id: string
          status: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          organisation_id: string | null
        }
        Insert: {
          id: string
          email?: string | null
          organisation_id?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          organisation_id?: string | null
        }
      }
      organisations: {
        Row: {
          id: string
          name: string | null
          stripe_id: string | null
          plan: string | null
        }
        Insert: {
          id: string
          name?: string | null
          stripe_id?: string | null
          plan?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          stripe_id?: string | null
          plan?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Lightweight Auth user shape used across the app to avoid importing
// the User type directly from the Supabase SDK (prevents namespace/type issues)
export type AuthUser = {
  id: string
  name?: string
  avatarUrl?: string | null
  role?: string
  email?: string | null
  phone?: string | null
  app_metadata?: Record<string, unknown> | null
  user_metadata?: {
    full_name?: string | null
    avatar_url?: string | null
    avatarUrl?: string | null
    [key: string]: any
  } | null
}