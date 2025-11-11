# SaaS Manager — Multi-tenant Garage Management Platform

[![Status](https://img.shields.io/badge/status-Ready%20for%20Production-brightgreen)](./docs/DELIVERY_CHECKLIST.md)
[![Node](https://img.shields.io/badge/node-18%2B-green)](https://nodejs.org)

**SaaS Manager** est une plateforme SaaS moderne pour la gestion multi-tenant de garages. Construite avec **Next.js 14**, **Prisma**, **Supabase** et déployable sur **Vercel**.

## ✨ Features

- ✅ Authentification sécurisée (Supabase Auth + JWT Bearer)
- ✅ Dashboards dynamiques par rôle (8 rôles)
- ✅ KPI + Sparklines 7 jours
- ✅ API REST sécurisée (role-based access)
- ✅ Multi-tenant isolation
- ✅ Prisma ORM + PostgreSQL

## 🚀 Démarrage rapide

```bash
npm install
# Créer .env.local avec clés Supabase
npx prisma migrate deploy
npm run dev
# http://localhost:3000 ✅
```

## 📖 Documentation

👉 **[📋 DELIVERY_CHECKLIST.md](./docs/DELIVERY_CHECKLIST.md)** ← START HERE

- [📚 instructions.md](./docs/instructions.md) — Installation → Deployment
- [📊 structure.md](./docs/structure.md) — Schéma Prisma
- [🔗 signup-trigger-setup.md](./docs/signup-trigger-setup.md) — Setup trigger

## 🛠️ Commandes

```bash
npm run dev              # Start dev
npm run build            # Production build
npm run lint             # ESLint
npm run type-check       # TypeScript
```

## 📄 License

MIT

**Version** : 1.0.0 | **Status** : ✅ Ready | **Date** : 11 nov 2025
