import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine classes avec tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats monétaires
export const formatPrice = (price: number) => {
  // Format as localized number and append FCFA (XOF)
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(price)
  return `${formatted} FCFA`
}

// Validation email simple
export const isValidEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

// Génère un slug depuis un texte
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}