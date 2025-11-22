import './globals.css'
import React from 'react'
import { Providers } from './Providers'
import SplashRoot from './SplashRoot'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi-Garages',
  description: 'SaaS multi-tenant starter',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

// Note: do not export a top-level `icons` binding — Next types expect only specific exports from layout modules.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SplashRoot>
          <Providers>{children}</Providers>
        </SplashRoot>
      </body>
    </html>
  )
}
