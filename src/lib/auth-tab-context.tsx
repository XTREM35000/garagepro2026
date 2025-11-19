"use client"

import { createContext, useContext, useState, useEffect } from 'react'

type AuthTabContextType = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const AuthTabContext = createContext<AuthTabContextType | undefined>(undefined)

export function AuthTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('login')

  // On mount, check URL search params for initial tab (e.g., ?tab=signup)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'signup' || tab === 'login') {
        setActiveTab(tab)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <AuthTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AuthTabContext.Provider>
  )
}

export function useAuthTab() {
  const context = useContext(AuthTabContext)
  if (!context) {
    throw new Error('useAuthTab doit être utilisé à l\'intérieur d\'un AuthTabProvider')
  }
  return context
}
