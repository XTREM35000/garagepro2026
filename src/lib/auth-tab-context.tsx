"use client"

import { createContext, useContext, useState } from 'react'

type AuthTabContextType = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const AuthTabContext = createContext<AuthTabContextType | undefined>(undefined)

export function AuthTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('login')

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
