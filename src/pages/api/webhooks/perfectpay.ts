/**
 * PerfectPay Webhook - Tracking de Compras Completo
 * 
 * Funcionalidades:
 * - Validação de secret via PERFECTPAY_WEBHOOK_SECRET
 * - Parsing robusto de payload (product_code, order_id, status, etc.)
 * - Mapeamento de produtos (MAIN, BUMP_1-5, UNKNOWN)
 * - Idempotência baseada em provider_event_id
 * - Modo de teste seguro (apenas em dev)
 * - Integração com tracking de sessão
 */

import type { APIRoute } from 'astro';
import { getSupabaseServer } from '../../../lib/supabase-server';
import { jsonError, jsonResponse } from '../../../lib/apiResponse';
import { mapProductCode, findProductCodeInPayload, type OfferType } from '../../../lib/perfectpay-products';

export const prerender = false;

interface PerfectPayWebhookPayload {
  // Identificadores
  sale_id?: string;
  transaction_id?: string;
  id?: string;
  code?: string;
  order_id?: string;
  orderId?: string;
  
  // Status
  sale_status?: string;
  sale_status_enum_key?: string;
  sale_status_detail?: string;
  status?: string;
  
  // Valor
  sale_amount?: number;
  amount?: number;
  price?: number;
  total?: number;
  currency?: string;
  
  // Produto
  product_code?: string;
  productCode?: string;
  product_id?: string;
  productId?: string;
  sku?: string;
  items?: Array<{
    product_code?: string;
    productCode?: string;
    sku?: string;
    code?: string;
    [key: string]: any;
  }>;
  line_items?: Array<{
    product_code?: string;
    productCode?: string;
    sku?: string;
    code?: string;
    [key: string]: any;
  }>;
  products?: Array<{
    code?: string;
    product_code?: string;
    sku?: string;
    [key: string]: any;
  }>;
  
  // Afiliado
  affiliate_code?: string;
  affiliateCode?: string;
  affiliate?: string;
  
  // Sessão/Cliente
  session_id?: string;
  sessionId?: string;
  external_reference?: string;
  externalReference?: string;
  customer?: {
    email?: string;
    name?: string;
    phone?: string;
    doc?: string;
    [key: string]: any;
  };
  buyer?: {
    email?: string;
    name?: string;
    phone?: string;
    doc?: string;
    [key: string]: any;
  };
  metadata?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    src?: string;
    session_id?: string;
    [key: string]: any;
  };
  
  // Evento
  event_type?: string;
  eventType?: string;
  timestamp?: string | number;
  created_at?: string;
  
  // Autenticação (não usar no payload, apenas para validação)
  token?: string;
  public_token?: string; // Token no body (para postbacks que não permitem custom header)
  
  [key: string]: any;
}

/**
 * Valida o webhook usando apenas PERFECTPAY_WEBHOOK_SECRET
 * Validação na ordem: x-webhook-secret → x-webhook-token → authorization → public_token (body)
 */
function validateWebhook(rawBody: string, payload: PerfectPayWebhookPayload, headers: Headers): { ok: boolean; error?: string } {
  const secret = process.env.PERFECTPAY_WEBHOOK_SECRET;
  
  if (!secret) {
    return { ok: false, error: 'missing webhook secret' };
  }

  // 1. Tentar header x-webhook-secret (principal)
  const headerSecret = headers.get('x-webhook-secret');
  if (headerSecret && headerSecret === secret) {
    return { ok: true };
  }

  // 2. Fallback: x-webhook-token
  const headerToken = headers.get('x-webhook-token');
  if (headerToken && headerToken === secret) {
    return { ok: true };
  }

  // 3. Fallback: authorization (Bearer ou direto)
  const authHeader = headers.get('authorization');
  if (authHeader) {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch && bearerMatch[1] === secret) {
      return { ok: true };
    }
    // Também aceitar sem Bearer prefix
    if (authHeader === secret) {
      return { ok: true };
    }
  }

  // 4. Fallback: public_token no body (para postbacks que não permitem custom header)
  if (payload.public_token && payload.public_token === secret) {
    return { ok: true };
  }

  // 5. Fallback legacy: token no body (compatibilidade)
  if (payload.token && payload.token === secret) {
    return { ok: true };
  }

  return { ok: false, error: 'unauthorized' };
}

/**
 * Normaliza status do webhook para valores padronizados
 */
function normalizeStatus(status?: string): string {
  if (!status) return 'unknown';
  const s = status.toLowerCase().trim();
  const map: Record<string, string> = {
    approved: 'approved',
    paid: 'approved',
    complete: 'approved',
    completed: 'approved',
    confirmed: 'approved',
    success: 'approved',
    refused: 'refused',
    declined: 'refused',
    rejected: 'refused',
    failed: 'refused',
    canceled: 'canceled',
    cancelled: 'canceled',
    refunded: 'refunded',
    refund: 'refunded',
    chargeback: 'chargeback',
    chargedback: 'chargeback',
    pending: 'pending',
    waiting_payment: 'pending',
    waiting: 'pending',
    processing: 'pending',
    in_progress: 'pending',
    expired: 'expired',
  };
  return map[s] || s;
}

/**
 * Extrai order_id do payload (múltiplas fontes)
 */
function extractOrderId(payload: PerfectPayWebhookPayload): string | null {
  return (
    payload.code ||
    payload.order_id ||
    payload.orderId ||
    payload.sale_id ||
    payload.transaction_id ||
    payload.id ||
    payload.sale_status_detail ||
    null
  );
}

/**
 * Extrai product_code do payload (busca recursiva se necessário)
 */
function extractProductCode(payload: PerfectPayWebhookPayload): string | null {
  // Tentar propriedades diretas primeiro
  const directCode =
    payload.product_code ||
    payload.productCode ||
    payload.product_id ||
    payload.productId ||
    payload.sku ||
    null;

  if (directCode) {
    return directCode.toString().trim().toUpperCase();
  }

  // Buscar recursivamente no payload
  const foundCode = findProductCodeInPayload(payload);
  if (foundCode) {
    return foundCode;
  }

  return null;
}

/**
 * Extrai affiliate_code do payload
 */
function extractAffiliateCode(payload: PerfectPayWebhookPayload, mappedAffiliateCode: string | null): string | null {
  return (
    payload.affiliate_code ||
    payload.affiliateCode ||
    payload.affiliate ||
    mappedAffiliateCode ||
    null
  );
}

/**
 * Extrai session_id do payload (múltiplas fontes)
 */
function extractSessionId(payload: PerfectPayWebhookPayload): string | null {
  return (
    payload.session_id ||
    payload.sessionId ||
    payload.metadata?.session_id ||
    payload.external_reference ||
    payload.externalReference ||
    null
  );
}

/**
 * Payload de teste para modo dev
 */
const TEST_PAYLOAD = {
  code: `TEST_${Date.now()}`,
  sale_status: 'approved',
  sale_amount: 99.90,
  currency: 'BRL',
  product_code: 'PPPBDPJI', // MAIN
  affiliate_code: 'PPA23VRV',
  session_id: 'test-session-id',
  event_type: 'sale_approved',
};

/**
 * GET /api/webhooks/perfectpay - Healthcheck
 * Retorna status do endpoint (não requer autenticação)
 */
export const GET: APIRoute = async () => {
  return jsonResponse({ ok: true }, 200);
};

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();

  try {
    const supabase = getSupabaseServer();
    const url = new URL(request.url);
    const isDev = import.meta.env.DEV || process.env.NODE_ENV !== 'production';
    const isTest = url.searchParams.get('test') === '1' && isDev;

    // Parse do body
    const rawBody = await request.text();
    let payload: PerfectPayWebhookPayload;

    try {
      if (isTest) {
        // Modo de teste: usar payload mock se body vazio
        payload = rawBody ? JSON.parse(rawBody) : TEST_PAYLOAD;
        console.log('[Webhook PerfectPay] 🧪 Test mode enabled');
      } else {
        payload = JSON.parse(rawBody || '{}');
      }
    } catch (parseError) {
      const errorDetails = parseError instanceof Error ? { message: parseError.message, stack: parseError.stack } : {};
      return jsonError('Invalid JSON payload', 400, { details: errorDetails });
    }

    // Validação de secret (SEMPRE requerida, mesmo em test mode)
    const auth = validateWebhook(rawBody, payload, request.headers);
    if (!auth.ok) {
      const status = auth.error === 'missing webhook secret' ? 500 : 401;
      return jsonError(auth.error || 'unauthorized', status);
    }

    // Extrair dados do payload
    const orderId = extractOrderId(payload);
    if (!orderId) {
      return jsonError('missing order_id', 400, {
        details: { payload_keys: Object.keys(payload) },
      });
    }

    const productCode = extractProductCode(payload);
    const productMapping = mapProductCode(productCode);
    
    // Usar affiliate_code do payload, ou do mapeamento se não vier
    const affiliateCode = extractAffiliateCode(payload, productMapping.affiliate_code);

    const eventType = payload.sale_status_enum_key || payload.event_type || payload.eventType || payload.sale_status || payload.status || 'unknown';
    const status = normalizeStatus(eventType);
    const amount = payload.sale_amount ?? payload.amount ?? payload.price ?? payload.total ?? null;
    const currency = payload.currency || 'BRL';
    const sessionId = extractSessionId(payload);

    // provider_event_id = order_id (para idempotência)
    const providerEventId = orderId.toString();

    // IDEMPOTÊNCIA: Verificar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('tracking_lmx_purchases')
      .select('id')
      .eq('provider_event_id', providerEventId)
      .maybeSingle();

    if (checkError) {
      console.error('[Webhook PerfectPay] ❌ Error checking duplicate:', checkError);
      return jsonError('Database error', 500);
    }

    if (existing) {
      console.log('[Webhook PerfectPay] 🔁 Duplicate purchase', { orderId, providerEventId, id: existing.id });
      return jsonResponse({ duplicate: true, id: existing.id, order_id: orderId }, 200);
    }

    // Preparar dados para inserção
    const insertData = {
      provider: 'perfectpay',
      provider_event_id: providerEventId,
      order_id: orderId.toString(),
      session_id: sessionId?.toString() || null,
      status,
      amount: amount ? Number(amount) : null,
      currency,
      product_code: productCode,
      offer_type: productMapping.offer_type,
      offer_key: productMapping.offer_type, // offer_key = offer_type (mesmo valor)
      is_bump: productMapping.is_bump,
      bump_index: productMapping.bump_index,
      affiliate_code: affiliateCode,
      event_type: eventType.toString(),
      raw_payload: payload as any,
    };

    // Inserir no Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('tracking_lmx_purchases')
      .insert(insertData)
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.error('[Webhook PerfectPay] ❌ Supabase insert error:', insertError);
      return jsonError(insertError.message, 500, {
        details: { code: insertError.code, hint: insertError.hint },
      });
    }

    console.log('[Webhook PerfectPay] ✅ Saved purchase', {
      orderId,
      providerEventId,
      id: inserted?.id,
      offer_type: productMapping.offer_type,
      is_bump: productMapping.is_bump,
    });

    return jsonResponse(
      {
        id: inserted?.id,
        order_id: orderId,
        offer_type: productMapping.offer_type,
        is_bump: productMapping.is_bump,
      },
      200
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Webhook PerfectPay] ❌ Erro inesperado:', error);
    return jsonError(error instanceof Error ? error.message : 'Unknown error', 500, {
      duration_ms: duration,
    });
  }
};
