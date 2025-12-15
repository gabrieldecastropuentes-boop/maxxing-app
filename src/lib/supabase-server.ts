// ═══════════════════════════════════════════════════════════════
// Supabase Server Client (SERVICE_ROLE_KEY - somente server-side)
// Para operações administrativas e tracking
// ═══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// GLOBAL SUPABASE SERVER CLIENT (para Vercel Serverless)
// ═══════════════════════════════════════════════════════════════
const globalForSupabaseServer = globalThis as unknown as {
  supabaseServer: ReturnType<typeof createClient> | undefined;
};

// ═══════════════════════════════════════════════════════════════
// CRIAR CLIENTE SUPABASE SERVER
// ═══════════════════════════════════════════════════════════════
const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('[Supabase Server] ⚠️ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configurados');
}

export const supabaseServer =
  globalForSupabaseServer.supabaseServer ??
  createClient(supabaseUrl || '', supabaseServiceRoleKey || '', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

// Em desenvolvimento, salvar na variável global
if (process.env.NODE_ENV !== 'production') {
  globalForSupabaseServer.supabaseServer = supabaseServer;
}

export default supabaseServer;

