"use client"

import React, { useState } from 'react'
import LoginForm from './login-form'
import SignupForm from './signup-form'
import { motion } from 'framer-motion'

const tabs = [
  { key: 'login', label: 'Connexion' },
  { key: 'signup', label: 'Inscription' },
]

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  return (
    <motion.div
      className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex mb-6 justify-center gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'login' | 'signup')}
            className={`px-4 py-2 rounded-t font-medium transition-colors ${activeTab === tab.key ? 'bg-sky-600 text-white' : 'bg-slate-100 text-sky-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </motion.div>
  )
}
