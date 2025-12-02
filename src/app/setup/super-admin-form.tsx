"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import AvatarUploader from "@/components/auth/avatar-uploader";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { EmailInput } from "@/components/ui/EmailInput";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";

export default function SuperAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const calcStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = calcStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/setup/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, avatarUrl }),
      });

      const contentType = res.headers.get("content-type") || "";
      let json: any = null;

      if (contentType.includes("application/json")) {
        json = await res.json();
      } else {
        // Response is not JSON (likely HTML error page) — capture text for debugging
        const text = await res.text();
        console.error("Non-JSON response from /api/setup/super-admin:", text);
        if (!res.ok) {
          setError(`Erreur serveur: ${res.status} - réponse non-JSON (voir console)`);
          setLoading(false);
          return;
        }
      }

      if (!res.ok) {
        setError(json?.error || json?.message || "Erreur création super admin");
      } else {
        setMessage("Super admin créé avec succès !");
        setTimeout(onSuccess, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-green-200 space-y-5"
    >

      {/* 🔥 HEADER + LOGO */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <AnimatedLogoGarage size={42} animated showText={false} />
        <h2 className="text-2xl font-bold text-green-700">Créer le Super Admin</h2>
      </div>

      <p className="text-sm text-gray-600 text-center">
        Ce compte contrôle la plateforme (gérants, abonnements, support…)
      </p>

      {error && <div className="text-sm text-red-600 bg-light-surface-2-50 dark:bg-dark-surface-2-50 p-2 rounded">{error}</div>}
      {message && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{message}</div>}

      {/* NOM + PRENOM */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Prénom"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
        />
        <input
          type="text"
          placeholder="Nom"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      <AvatarUploader
        value={avatarUrl}
        bucket="avatars"
        upload
        onUpload={(url) => setAvatarUrl(url)}
      />

      {/* TELEPHONE */}
      <PhoneInput
        value={phone}
        onChange={setPhone}
        label="Téléphone"
        required
      />

      {/* EMAIL */}
      <EmailInput
        value={email}
        onChange={setEmail}
        label="Email"
        required
      />

      {/* MOT DE PASSE */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-green-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "👁️" : "🙈"}
        </button>
      </div>

      {/* BARRE DE FORCE */}
      <div className="h-2 w-full bg-gray-200 rounded-xl overflow-hidden">
        <div
          className={`h-2 rounded transition-all ${strength === 0
            ? "w-0"
            : strength === 1
              ? "w-1/4 bg-amber-500"
              : strength === 2
                ? "w-1/2 bg-yellow-400"
                : strength === 3
                  ? "w-3/4 bg-green-400"
                  : "w-full bg-green-600"
            }`}
        />
      </div>

      {/* BOUTON */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl bg-green-600 text-white font-bold shadow-xl hover:bg-green-700 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Création…" : "Créer Super Admin"}
      </motion.button>
    </motion.form>
  );
}
