import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter, log: ['error'] })
}

export const db = globalThis.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
