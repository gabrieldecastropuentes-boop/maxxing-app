// ═══════════════════════════════════════════════════════════════
// Supabase Client Singleton
// Configurado para funcionar com Vercel Serverless Functions
// ═══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// GLOBAL SUPABASE CLIENT (para Vercel Serverless)
// ═══════════════════════════════════════════════════════════════
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined;
};

// ═══════════════════════════════════════════════════════════════
// CRIAR CLIENTE SUPABASE
// ═══════════════════════════════════════════════════════════════
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] ⚠️ SUPABASE_URL e SUPABASE_ANON_KEY não configurados');
}

export const supabase =
  globalForSupabase.supabase ??
  createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      persistSession: false, // Serverless não precisa de sessão
    },
  });

// Em desenvolvimento, salvar na variável global para evitar múltiplas instâncias
if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}

export default supabase;

