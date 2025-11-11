import './globals.css'
import React from 'react'

export const metadata = {
  title: 'SaaS Starter',
  description: 'SaaS multi-tenant starter'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
      </body>
    </html>
  )
}
