/**
 * ═══════════════════════════════════════════════════════════════
 * GET /api/health/tracking
 * Retorna status das variáveis de ambiente necessárias para tracking
 * (sem expor valores de secrets)
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { jsonResponse } from '../../../lib/apiResponse';

export const prerender = false;

export const GET: APIRoute = async () => {
  // ═══════════════════════════════════════════════════════════
  // Verificar variáveis de ambiente (sem expor valores)
  // ═══════════════════════════════════════════════════════════
  
  const checks = {
    // Supabase (obrigatórias)
    supabase: {
      url: {
        name: 'SUPABASE_URL',
        configured: Boolean(process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL),
        required: true,
      },
      serviceRoleKey: {
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        required: true,
      },
      anonKey: {
        name: 'PUBLIC_SUPABASE_ANON_KEY',
        configured: Boolean(process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
        required: false, // Só necessário se usar client-side Supabase
      },
    },
    
    // PerfectPay Webhook (TODO: Quando receber o novo webhook da PerfectPay)
    perfectpay: {
      webhookSecret: {
        name: 'PERFECTPAY_WEBHOOK_SECRET',
        configured: Boolean(process.env.PERFECTPAY_WEBHOOK_SECRET || process.env.PERFECTPAY_WEBHOOK_TOKEN),
        required: false, // TODO: Atualizar quando receber novo webhook
      },
    },
    
    // Meta/Facebook (opcionais - para Pixel/CAPI)
    meta: {
      pixelId: {
        name: 'PUBLIC_FB_PIXEL_ID',
        configured: Boolean(process.env.PUBLIC_FB_PIXEL_ID?.trim()),
        required: false,
      },
      capiToken: {
        name: 'META_CAPI_ACCESS_TOKEN',
        configured: Boolean(process.env.META_CAPI_ACCESS_TOKEN?.trim()),
        required: false, // Server-only, nunca exposto no client bundle
      },
    },
    
    // Google Analytics (opcional)
    analytics: {
      gaId: {
        name: 'PUBLIC_GA_ID',
        configured: Boolean(process.env.PUBLIC_GA_ID),
        required: false,
      },
    },
    
    // CORS/Site (opcional)
    site: {
      siteUrl: {
        name: 'PUBLIC_SITE_URL',
        configured: Boolean(process.env.PUBLIC_SITE_URL),
        required: false,
      },
      allowedOrigins: {
        name: 'ALLOWED_ORIGINS',
        configured: Boolean(process.env.ALLOWED_ORIGINS),
        required: false,
      },
    },
  };
  
  // Calcular status geral
  const requiredChecks = [
    checks.supabase.url,
    checks.supabase.serviceRoleKey,
  ];
  
  const allRequiredConfigured = requiredChecks.every(c => c.configured);
  const optionalConfigured = [
    checks.perfectpay.webhookSecret,
    checks.meta.pixelId,
    checks.meta.capiToken,
    checks.analytics.gaId,
  ].filter(c => c.configured).length;
  
  return jsonResponse({
    status: allRequiredConfigured ? 'ready' : 'missing_required',
    summary: {
      required: {
        total: requiredChecks.length,
        configured: requiredChecks.filter(c => c.configured).length,
      },
      optional: {
        total: 5,
        configured: optionalConfigured,
      },
    },
    checks,
    timestamp: new Date().toISOString(),
  });
};

