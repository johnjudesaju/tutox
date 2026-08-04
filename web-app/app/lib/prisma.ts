import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Establish a connection pool using the DATABASE_URL environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma PostgreSQL adapter with the connection pool
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  // 3. Pass the adapter directly into the PrismaClient constructor options
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 4. Export the global instance to prevent multiple client instances in development mode
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
