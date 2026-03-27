import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma_v4: PrismaClient | undefined;
};

function createPrismaClient() {
  console.log("Initializing Prisma Client...");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not defined in environment variables!");
  }

  try {
    const pool = new Pool({ 
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });

    const adapter = new PrismaPg(pool as any);
    
    console.log("Prisma Adapter created. Connecting to client...");
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err) {
    console.error("FAILED TO CREATE PRISMA CLIENT:", err);
    throw err;
  }
}

export const prisma = globalForPrisma.prisma_v4 ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v4 = prisma;
}
