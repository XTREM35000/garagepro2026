"use client";
import React, { useEffect, useState } from "react";
import SuperAdminForm from "./super-admin-form";
import TenantAdminForm from "./tenant-admin-form";
import { motion } from "framer-motion";

export default function SetupRoot() {
  const [step, setStep] = useState<'loading' | 'super_admin' | 'tenant_admin' | 'done'>('loading');

  useEffect(() => {
    // Appel API pour savoir ce qu'il faut afficher
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((data) => {
        if (!data.superAdminExists) setStep('super_admin');
        else if (!data.tenantAdminExists) setStep('tenant_admin');
        else setStep('done');
      });
  }, []);

  if (step === 'loading') return <div className="flex items-center justify-center min-h-screen">Chargement…</div>;
  if (step === 'done') {
    if (typeof window !== 'undefined') window.location.href = "/auth";
    return <div className="flex items-center justify-center min-h-screen">Redirection…</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        {step === 'super_admin' && <SuperAdminForm onSuccess={() => setStep('tenant_admin')} />}
        {step === 'tenant_admin' && <TenantAdminForm onSuccess={() => setStep('done')} />}
      </motion.div>
    </div>
  );
}
