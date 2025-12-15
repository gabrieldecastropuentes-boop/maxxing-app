// ═══════════════════════════════════════════════════════════════
// Supabase Server Client (SERVICE_ROLE_KEY - somente server-side)
// Para operações administrativas e tracking
// ═══════════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// Supabase server client com validação estrita (Vercel safe)
// ═══════════════════════════════════════════════════════════════
let supabaseServer: SupabaseClient | undefined;

export function getSupabaseServer(): SupabaseClient {
  if (supabaseServer) return supabaseServer;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error('Missing/Invalid SUPABASE_URL. Set it in Vercel Environment Variables.');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY.');
  }

  supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseServer;
}

export { supabaseServer };

export default supabaseServer;

