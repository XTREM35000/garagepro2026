"use client"

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import LogoAnimated from '@/components/ui/logo-animated'
import LoginForm from './login-form'
import SignupForm from './signup-form'
import { motion } from 'framer-motion'

export default function AuthCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-md w-full rounded-lg bg-white p-6 shadow">
      <div className="flex items-center gap-4 mb-6">
        <LogoAnimated className="w-12 h-12" />
        <div>
          <h2 className="text-xl font-bold">Bienvenue</h2>
          <p className="text-sm text-gray-600">Connectez-vous ou créez un compte</p>
        </div>
      </div>

      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
