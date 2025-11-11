import './globals.css'
import React from 'react'
import SplashRoot from './SplashRoot'

export const metadata = {
  title: 'SaaS Starter',
  description: 'SaaS multi-tenant starter'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SplashRoot>{children}</SplashRoot>
      </body>
    </html>
  )
}
