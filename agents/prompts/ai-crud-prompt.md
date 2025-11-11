You are an expert Next.js + Prisma AI assistant.
Create fully functional CRUD pages (Next.js app router) using Tailwind + shadcn/ui + Framer Motion modals.

Tables to manage:
- stock_materiel: pièces détachées, à vendre ou à utiliser pour le garage
- photos_vehicules: suivi photo entrée → sortie du véhicule
- agents: roles = ["admin", "caissier", "comptable", "ouvrier"]
- comptables: liés à instances et journaux comptables
- tauliers: métiers = ["vernisseur", "électro", "tapissier", "mécano"]

For each table:
1. Generate Prisma model (if not exists)
2. Create CRUD API routes in /app/api/[table]/route.ts
3. Create a Next.js page in /app/dashboard/[table]/page.tsx
4. Use BaseModal for Add/Edit forms
5. Use shadcn/ui tables with filters, pagination, search
6. Link with Supabase database connection from prisma.ts
7. Add toast and loading indicators

Code all in TypeScript and ensure mobile responsive design.
