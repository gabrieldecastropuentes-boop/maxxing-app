/**
 * PerfectPay Webhook
 * Idempotente + valida secret + grava em tracking_lmx_purchases (Supabase)
 */

import type { APIRoute } from 'astro';
import { getSupabaseServer } from '../../../lib/supabase-server';
import { jsonError, jsonResponse } from '../../../lib/apiResponse';

export const prerender = false;

interface PerfectPayWebhookPayload {
  sale_id?: string;
  transaction_id?: string;
  code?: string;
  sale_status?: string;
  sale_status_enum_key?: string;
  sale_status_detail?: string;
  status?: string;
  sale_amount?: number;
  amount?: number;
  price?: number;
  currency?: string;
  customer?: { email?: string; name?: string; phone?: string; doc?: string };
  buyer?: { email?: string; name?: string; phone?: string; doc?: string };
  metadata?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    src?: string;
    session_id?: string;
  };
  session_id?: string;
  token?: string;
  [key: string]: any;
}

function validateWebhook(rawBody: string, payload: PerfectPayWebhookPayload, headers: Headers): { ok: boolean; error?: string } {
  const secret = process.env.PERFECTPAY_WEBHOOK_SECRET || process.env.PERFECTPAY_WEBHOOK_TOKEN;
  if (!secret) return { ok: false, error: 'missing webhook secret' };

  // TODO: Validar HMAC quando a PerfectPay fornecer o header de assinatura (ex: x-signature)
  const headerSecret = headers.get('x-webhook-secret');
  if (headerSecret && headerSecret === secret) return { ok: true };

  const headerToken = headers.get('x-webhook-token') || headers.get('authorization');
  if (headerToken && (headerToken === secret || headerToken === `Bearer ${secret}`)) return { ok: true };

  if (payload.token && payload.token === secret) return { ok: true };

  return { ok: false, error: 'unauthorized' };
}

function normalizeStatus(status?: string): string {
  if (!status) return 'unknown';
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    approved: 'approved',
    paid: 'approved',
    complete: 'approved',
    completed: 'approved',
    refused: 'refused',
    declined: 'refused',
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
    expired: 'expired',
  };
  return map[s] || s;
}

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();

  try {
    const supabase = getSupabaseServer();
    const url = new URL(request.url);
    const isTest = url.searchParams.get('test') === '1' && import.meta.env.DEV;

    const rawBody = await request.text();
    const payload: PerfectPayWebhookPayload = isTest
      ? (rawBody ? JSON.parse(rawBody) : { code: 'test', sale_status: 'approved' })
      : JSON.parse(rawBody || '{}');

    const auth = validateWebhook(rawBody, payload, request.headers);
    if (!auth.ok) {
      const status = auth.error === 'missing webhook secret' ? 500 : 401;
      return jsonError(auth.error || 'unauthorized', status);
    }

    const orderId =
      payload.code ||
      payload.sale_id ||
      payload.transaction_id ||
      payload.sale_status_detail ||
      payload.sale_status;

    if (!orderId) {
      return jsonError('missing order_id', 400);
    }

    const eventType = payload.sale_status_enum_key || payload.sale_status || payload.status || 'unknown';
    const status = normalizeStatus(eventType);
    const amount = payload.sale_amount ?? payload.amount ?? payload.price ?? null;
    const currency = payload.currency || 'BRL';
    const sessionId = payload.session_id || payload.metadata?.session_id || null;
    const providerEventId = orderId;

    // Idempotência
    const { data: existing } = await supabase
      .from('tracking_lmx_purchases')
      .select('id')
      .or(`provider_event_id.eq.${providerEventId},order_id.eq.${orderId}`)
      .maybeSingle();

    if (existing) {
      console.log('[Webhook PerfectPay] 🔁 Duplicate purchase', { orderId, providerEventId });
      return jsonResponse({ duplicate: true, id: existing.id }, 200);
    }

    const { data: inserted, error: insertError } = await supabase
      .from('tracking_lmx_purchases')
      .insert({
        provider: 'perfectpay',
        provider_event_id: providerEventId,
        order_id: orderId,
        session_id: sessionId,
        status,
        amount,
        currency,
        event_type: eventType,
        raw_payload: payload as any,
      })
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.error('[Webhook PerfectPay] ❌ Supabase insert error:', insertError);
      return jsonError(insertError.message, 500);
    }

    console.log('[Webhook PerfectPay] ✅ Saved purchase', { orderId, providerEventId, id: inserted?.id });

    return jsonResponse({ id: inserted?.id, order_id: orderId }, 200);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Webhook PerfectPay] ❌ Erro inesperado:', error);
    return jsonError(error instanceof Error ? error.message : 'Unknown error', 500, { duration_ms: duration });
  }
};
