import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    // Désactive les prepared statements pour le pooler transaction mode
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Désactive les prepared statements au niveau du client
if (process.env.DATABASE_URL?.includes('6543')) {
  prisma.$use(async (params, next) => {
    // Force l'utilisation de query raw pour éviter les prepared statements
    return next(params);
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;