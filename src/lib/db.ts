// ═══════════════════════════════════════════════════════════════
// Prisma Client Singleton
// Configurado para funcionar com Vercel Serverless Functions
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

// ═══════════════════════════════════════════════════════════════
// GLOBAL PRISMA CLIENT (para Vercel Serverless)
// ═══════════════════════════════════════════════════════════════
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ═══════════════════════════════════════════════════════════════
// CRIAR CLIENTE PRISMA
// ═══════════════════════════════════════════════════════════════
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Em desenvolvimento, salvar na variável global para evitar múltiplas instâncias
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Conectar ao banco
// ═══════════════════════════════════════════════════════════════
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('[DB] Conectado ao banco de dados');
  } catch (error) {
    console.error('[DB] Erro ao conectar:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Desconectar do banco
// ═══════════════════════════════════════════════════════════════
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('[DB] Desconectado do banco de dados');
  } catch (error) {
    console.error('[DB] Erro ao desconectar:', error);
  }
}

export default prisma;

