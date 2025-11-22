import './globals.css'
import React from 'react'
import { Providers } from './Providers'
import SplashRoot from './SplashRoot'

export const metadata = {
  title: 'SaaS Starter',
  description: 'SaaS multi-tenant starter',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export const icons = {
  icon: '/logo.png',
  shortcut: '/logo.png',
  apple: '/logo.png',
}

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
