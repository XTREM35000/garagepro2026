import './globals.css'
import React from 'react'
import { Providers } from './Providers'

export const metadata = {
  title: 'SaaS Starter',
  description: 'SaaS multi-tenant starter'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
