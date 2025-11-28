'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import { AuthTabProvider, useAuthTab } from '@/lib/auth-tab-context';
import { ModalDraggable } from '@/components/ui/ModalDraggable';

function AuthCardContent() {
  const { activeTab, setActiveTab } = useAuthTab();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full bg-transparent"
      style={{ perspective: '1500px' }}
    >
      {/* Logo animé et titre */}
      <div className="flex items-center gap-4 mb-8">
        <AnimatedLogoGarage size={56} animated showText />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenue</h2>
          <p className="text-sm text-gray-600">Connectez-vous ou créez un compte</p>
        </div>
      </div>

      {/* Tabs Auth */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 rounded-xl p-1 mb-6 shadow-inner">
          <TabsTrigger value="login" className="flex-1 rounded-xl">
            Connexion
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex-1 rounded-xl">
            Inscription
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </div>
      </Tabs>

      {/* Décoratif bas modale */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-green-100/50 blur-2xl"
      />
    </motion.div>
  );
}

export default function AuthCard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ModalDraggable
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Auth - SaaS Manager"
      description="Connectez-vous ou créez un compte"
    >
      <AuthTabProvider>
        <AuthCardContent />
      </AuthTabProvider>
    </ModalDraggable>
  );
}
