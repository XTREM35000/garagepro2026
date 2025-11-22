// src/app/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AvatarUploader from "@/components/auth/avatar-uploader";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import Card3D from "@/components/ui/Card3D";
import BackButton from "@/components/ui/BackButton";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { useAuth } from "@/lib/auth-context";

/**
 * Profile page (premium)
 * - No full page reload on submit
 * - Uses updateUser from auth context when available
 * - Fallback to PUT /api/auth/user/:id
 * - Nice animation + cards
 */

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth();

  // local editable state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fill initial values from API or auth user
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      // optimistic load from user object
      const name = (user as any).name || `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim();
      const [first = "", ...rest] = name.split(" ");
      const last = rest.join(" ");

      if (mounted) {
        setFirstName(first);
        setLastName(last);
        setEmail(user.email || "");
        setAvatarUrl((user as any).avatarUrl || (user as any).avatar_url || null);
      }

      // try to fetch server-side copy (non-blocking)
      try {
        if (!user?.id) return;
        const res = await fetch(`/api/auth/user/${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        // prefer server values
        const fullName = data.name || name;
        const [f = "", ...r] = (fullName || "").split(" ");
        setFirstName(f);
        setLastName(r.join(" "));
        setEmail(data.email || user.email || "");
        setAvatarUrl((prev) => data.avatarUrl || data.avatar_url || prev);
      } catch {
        // ignore fetch errors; we already have auth user values
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [user]);

  // password strength helper (simple)
  const calcStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = calcStrength(password);

  // Controlled, non-reloading submit
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError(null);
    setMessage(null);

    if (!user?.id) {
      setError("Utilisateur non trouvé (pas d'ID).");
      return;
    }

    setLoadingSave(true);

    // Prepare payload (only send fields that changed / allowed)
    const payload: any = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      avatarUrl,
    };
    if (password) payload.password = password;

    try {
      // Prefer auth context updateUser if available — it may update client state + provider
      if (updateUser) {
        const updated = await updateUser(payload);
        if (updated?.error) {
          setError(updated.error || "Impossible de mettre à jour le profil");
        } else {
          setMessage("Profil mis à jour avec succès !");
          // clear password after success
          setPassword("");
        }
      } else {
        // Fallback: direct API call (PUT)
        const res = await fetch(`/api/auth/user/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const contentType = res.headers.get("content-type") || "";
          let json: any = null;
          if (contentType.includes("application/json")) json = await res.json();
          const text = json?.error || json?.message || (await res.text().catch(() => "Erreur serveur"));
          setError(text);
        } else {
          setMessage("Profil mis à jour avec succès !");
          setPassword("");
        }
      }
    } catch (err: any) {
      console.error("profile update error:", err);
      setError(err?.message || "Erreur inconnue lors de la mise à jour.");
    } finally {
      setLoadingSave(false);
      setTimeout(() => setMessage(null), 4000);
      setTimeout(() => setError(null), 8000);
    }
  };

  // small local component for password strength bar
  const StrengthBar = ({ level }: { level: number }) => {
    const width =
      level === 0 ? "w-0" : level === 1 ? "w-1/4" : level === 2 ? "w-1/2" : level === 3 ? "w-3/4" : "w-full";
    const color =
      level === 0 ? "bg-transparent" : level === 1 ? "bg-red-500" : level === 2 ? "bg-yellow-400" : level === 3 ? "bg-green-400" : "bg-emerald-600";

    return (
      <div className="h-2 w-full bg-gray-200 rounded overflow-hidden mt-2">
        <div className={`h-2 ${width} ${color} rounded transition-all`} />
      </div>
    );
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
              className="relative -mt-8"
            >
              {/* Hero banner small with page title (no huge banner per request) */}
              <div className="hero card-3d p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <AnimatedLogoGarage size={56} animated showText={false} />
                    <div>
                      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Mon profil</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Gère tes informations et paramètres de compte</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <BackButton />
                    <motion.button
                      onClick={() => void handleSubmit()}
                      whileHover={{ scale: 1.03 }}
                      className="btn"
                      style={{ padding: "10px 16px" }}
                    >
                      Enregistrer
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main content card */}
            <motion.form
              onSubmit={(e) => void handleSubmit(e)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left column - profile form */}
              <div className="space-y-4">
                <div className="card-3d p-6">
                  <h2 className="text-lg font-semibold mb-3">Informations personnelles</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Avatar</label>
                    <AvatarUploader
                      value={avatarUrl}
                      bucket="avatars"
                      upload
                      onUpload={(url) => setAvatarUrl(url)}
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="card-3d p-6">
                  <h2 className="text-lg font-semibold mb-3">Sécurité</h2>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nouveau mot de passe (laisser vide pour conserver)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-200"
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                    <StrengthBar level={strength} />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void handleSubmit()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow"
                      disabled={loadingSave}
                    >
                      {loadingSave ? "Enregistrement…" : "Enregistrer les modifications"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        // reset to auth user values
                        const name = (user as any).name || `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim();
                        const [first = "", ...rest] = name.split(" ");
                        setFirstName(first);
                        setLastName(rest.join(" "));
                        setEmail(user.email || "");
                        setAvatarUrl((user as any).avatarUrl || (user as any).avatar_url || null);
                        setPassword("");
                        setMessage("Modifications annulées");
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      className="px-3 py-2 rounded-xl border"
                    >
                      Annuler
                    </button>
                  </div>

                  {error && <div className="mt-3 text-sm text-red-600 bg-red-50 rounded p-2">{error}</div>}
                  {message && <div className="mt-3 text-sm text-emerald-700 bg-emerald-50 rounded p-2">{message}</div>}
                </div>
              </div>

              {/* Right column - summary / actions / activity */}
              <div className="space-y-4">
                <div className="card-3d p-6">
                  <h3 className="text-lg font-semibold mb-3">Compte</h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Rôle</div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{(user as any).role || "Utilisateur"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">ID</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{user.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Dernière connexion</div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{(user as any).last_sign_in_at || "—"}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Email vérifié</div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{(user as any).email_confirmed_at ? "Oui" : "Non"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-3d p-6">
                  <h3 className="text-lg font-semibold mb-3">Actions récentes</h3>
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {/* Replace with real activity feed when available */}
                    <Card3D title="Connexion" subtitle="22 Nov 2025 — 09:12" />
                    <Card3D title="Mise à jour profil" subtitle="20 Nov 2025 — 14:07" />
                    <Card3D title="Téléchargement avatar" subtitle="18 Nov 2025 — 11:32" />
                  </div>
                </div>

                <div className="card-3d p-6">
                  <h3 className="text-lg font-semibold mb-3">Préférences</h3>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Mode</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">Personnalise ton thème et préférences d&#39;affichage</div>
                    </div>

                    <div>
                      {/* theme toggle moved to header; keep placeholder */}
                      <div className="px-3 py-2 rounded-xl border text-sm">Gérer</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          </div>
        </main>
      </div>
    </div>
  );
}
