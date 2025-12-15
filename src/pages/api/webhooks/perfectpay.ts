/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/webhooks/perfectpay
 * Webhook para receber notificações de compras da PerfectPay
 * ═══════════════════════════════════════════════════════════════
 * 
 * Configure este endpoint no painel da PerfectPay:
 * URL: https://seu-dominio.vercel.app/api/webhooks/perfectpay
 * 
 * Adicione o token de segurança nas variáveis de ambiente:
 * PERFECTPAY_WEBHOOK_TOKEN=seu_token_secreto
 */

import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';
import { supabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

// ═══════════════════════════════════════════════════════════════
// TIPOS DO WEBHOOK DA PERFECTPAY
// ═══════════════════════════════════════════════════════════════

interface PerfectPayCustomer {
  name?: string;
  email: string;
  phone?: string;
  doc?: string; // CPF/CNPJ
}

interface PerfectPayProduct {
  id?: string;
  name?: string;
  plan_name?: string;
}

interface PerfectPayPayment {
  method?: string; // pix, credit_card, boleto
  installments?: number;
}

interface PerfectPayWebhookPayload {
  // Identificadores
  sale_id?: string;
  transaction_id?: string;
  code?: string;
  
  // Status da venda (formato PerfectPay)
  sale_status?: string;
  sale_status_enum?: number;
  sale_status_enum_key?: string; // "approved", "refused", etc.
  sale_status_detail?: string;
  status?: string;
  
  // Dados do cliente
  customer?: PerfectPayCustomer;
  buyer?: PerfectPayCustomer;
  
  // Dados do produto
  product?: PerfectPayProduct;
  product_name?: string;
  product_id?: string;
  plan?: {
    name?: string;
    code?: string;
  };
  plan_name?: string;
  
  // Valores
  sale_amount?: number;
  amount?: number;
  price?: number;
  
  // Pagamento (formato PerfectPay)
  payment?: PerfectPayPayment;
  payment_method?: string;
  payment_type_enum_key?: string; // "pix", "credit_card", etc.
  payment_method_enum_key?: string;
  
  // UTM (formato PerfectPay - dentro de metadata)
  metadata?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    src?: string;
  };
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  src?: string;
  
  // Datas (formato PerfectPay)
  sale_date?: string;
  approved_date?: string;
  date_approved?: string; // "2025-11-27 18:39:37"
  date_created?: string; // "2025-11-27 18:39:19"
  created_at?: string;
  
  // Token de validação
  token?: string;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO DE VALIDAÇÃO DO WEBHOOK
// ═══════════════════════════════════════════════════════════════

function validateWebhook(payload: PerfectPayWebhookPayload, headers: Headers): boolean {
  const webhookSecret = import.meta.env.PERFECTPAY_WEBHOOK_SECRET || import.meta.env.PERFECTPAY_WEBHOOK_TOKEN;
  
  if (!webhookSecret) {
    console.warn('[Webhook] ⚠️ PERFECTPAY_WEBHOOK_SECRET não configurado');
    return false; // Em produção, rejeitar se não tiver secret
  }
  
  // Verificar secret no header (formato solicitado)
  const headerSecret = headers.get('x-webhook-secret');
  if (headerSecret === webhookSecret) {
    return true;
  }
  
  // Fallback: verificar token no header (compatibilidade)
  const headerToken = headers.get('x-webhook-token') || headers.get('authorization');
  if (headerToken === webhookSecret || headerToken === `Bearer ${webhookSecret}`) {
    return true;
  }
  
  // Fallback: verificar token no payload
  if (payload.token === webhookSecret) {
    return true;
  }
  
  return false;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO DE NORMALIZAÇÃO DO STATUS
// ═══════════════════════════════════════════════════════════════

function normalizeStatus(status?: string): string {
  if (!status) return 'unknown';
  
  const statusMap: Record<string, string> = {
    // PerfectPay
    'approved': 'approved',
    'paid': 'approved',
    'complete': 'approved',
    'completed': 'approved',
    'refused': 'refused',
    'declined': 'refused',
    'canceled': 'canceled',
    'cancelled': 'canceled',
    'refunded': 'refunded',
    'refund': 'refunded',
    'chargeback': 'chargeback',
    'chargedback': 'chargeback',
    'pending': 'pending',
    'waiting_payment': 'pending',
    'waiting': 'pending',
    'processing': 'pending',
    'expired': 'expired',
  };
  
  return statusMap[status.toLowerCase()] || status.toLowerCase();
}

// ═══════════════════════════════════════════════════════════════
// HANDLER DO WEBHOOK
// ═══════════════════════════════════════════════════════════════

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  
  try {
    // Parsear payload
    const rawBody = await request.text();
    const payload: PerfectPayWebhookPayload = JSON.parse(rawBody);
    
    console.log('[Webhook PerfectPay] 📥 Recebido:', {
      code: payload.code,
      status: payload.sale_status_enum_key || payload.sale_status,
      email: payload.customer?.email,
      amount: payload.sale_amount,
      timestamp: new Date().toISOString()
    });
    
    // Validar webhook
    if (!validateWebhook(payload, request.headers)) {
      console.error('[Webhook PerfectPay] ❌ Token inválido');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Extrair dados do payload (compatibilidade com diferentes formatos)
    const externalId = payload.code || payload.sale_id || payload.transaction_id;
    const status = normalizeStatus(
      payload.sale_status_enum_key || 
      payload.sale_status_detail || 
      payload.sale_status || 
      payload.status
    );
    const customer = payload.customer || payload.buyer;
    const customerEmail = customer?.email;
    
    // Validar dados obrigatórios
    if (!externalId || !customerEmail) {
      console.error('[Webhook PerfectPay] ❌ Dados obrigatórios faltando:', { 
        externalId, 
        customerEmail,
        code: payload.code,
        customer: payload.customer 
      });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        details: 'code/sale_id/transaction_id and customer.email are required',
        received: {
          code: payload.code,
          has_customer: !!payload.customer,
          customer_email: payload.customer?.email
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Extrair outros dados (formato PerfectPay)
    const amount = payload.sale_amount || payload.amount || payload.price || 0;
    const productName = payload.product?.name || payload.product_name;
    const productId = payload.product?.code || payload.product?.id || payload.product_id;
    const planName = payload.plan?.name || payload.product?.plan_name || payload.plan_name;
    const paymentMethod = payload.payment_type_enum_key || payload.payment_method_enum_key || payload.payment?.method || payload.payment_method || 'unknown';
    
    // Extrair UTM do metadata (formato PerfectPay)
    const metadata = payload.metadata || {};
    const utmSource = metadata.utm_source || payload.utm_source || metadata.src || payload.src;
    const utmMedium = metadata.utm_medium || payload.utm_medium;
    const utmCampaign = metadata.utm_campaign || payload.utm_campaign;
    const utmContent = metadata.utm_content || payload.utm_content;
    
    // Determinar data de pagamento (formato PerfectPay: "2025-11-27 18:39:37")
    let paidAt: Date | null = null;
    if (status === 'approved') {
      const dateStr = payload.date_approved || payload.approved_date || payload.sale_date || payload.date_created || payload.created_at;
      if (dateStr) {
        // Converter formato "2025-11-27 18:39:37" para Date
        paidAt = new Date(dateStr.replace(' ', 'T'));
      } else {
        paidAt = new Date();
      }
    }
    
    // Determinar data de reembolso
    let refundedAt: Date | null = null;
    if (status === 'refunded' || status === 'chargeback') {
      refundedAt = new Date();
    }
    
    // Verificar se já existe uma compra com esse ID
    const existingPurchase = await prisma.purchase.findUnique({
      where: { externalId },
    });
    
    let purchase;
    
    if (existingPurchase) {
      // Atualizar compra existente
      console.log('[Webhook PerfectPay] Atualizando compra existente:', externalId);
      
      purchase = await prisma.purchase.update({
        where: { externalId },
        data: {
          status,
          paidAt: paidAt || existingPurchase.paidAt,
          refundedAt: refundedAt || existingPurchase.refundedAt,
          rawPayload: payload as any,
        },
      });
    } else {
      // Buscar lead pelo email para associar
      const lead = await prisma.lead.findFirst({
        where: { email: customerEmail },
        orderBy: { createdAt: 'desc' },
      });
      
      // Criar nova compra
      console.log('[Webhook PerfectPay] Criando nova compra:', externalId);
      
      purchase = await prisma.purchase.create({
        data: {
          externalId,
          gateway: 'perfectpay',
          status,
          paymentMethod,
          customerEmail,
          customerName: customer?.name,
          customerPhone: customer?.phone,
          customerDocument: customer?.doc,
          productId,
          productName,
          planName,
          amount,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          rawPayload: payload as any,
          paidAt,
          refundedAt,
          leadId: lead?.id,
        },
      });
    }
    
    // Criar evento de tracking
    await prisma.event.create({
      data: {
        eventName: `purchase_${status}`,
        eventData: {
          purchase_id: purchase.id,
          external_id: externalId,
          status,
          amount,
          customer_email: customerEmail,
        },
        source: 'webhook_perfectpay',
      },
    });
    
    // ═══════════════════════════════════════════════════════════
    // DISPARAR FACEBOOK CAPI - Purchase (quando compra aprovada)
    // ═══════════════════════════════════════════════════════════
    if (status === 'approved') {
      const fbPixelId = import.meta.env.FB_PIXEL_ID || import.meta.env.PUBLIC_FB_PIXEL_ID;
      const fbAccessToken = import.meta.env.FB_ACCESS_TOKEN;

      if (fbPixelId && fbAccessToken) {
        try {
          // Buscar lead associado para obter dados do usuário
          const lead = purchase.leadId
            ? await prisma.lead.findUnique({
                where: { id: purchase.leadId },
                select: { email: true, phone: true },
              })
            : null;

          // Gerar event_id para dedup (mesmo formato do tracking)
          const purchaseEventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

          const fbEvent = {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: purchaseEventId, // ⚠️ CRÍTICO: Para dedup com Pixel (se disparado no browser)
            event_source_url: '',
            action_source: 'website',
            user_data: {
              client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || '',
              client_user_agent: request.headers.get('user-agent') || '',
              ...(lead?.email && { em: lead.email.toLowerCase().trim() }),
              ...(lead?.phone && { ph: lead.phone.replace(/\D/g, '') }),
            },
            custom_data: {
              value: amount,
              currency: 'BRL',
              content_name: purchase.productName || 'Maxxing Quiz Premium',
              content_category: 'digital_product',
              content_ids: purchase.productId ? [purchase.productId] : [],
            },
          };

          const fbResponse = await fetch(
            `https://graph.facebook.com/v18.0/${fbPixelId}/events?access_token=${fbAccessToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: [fbEvent] }),
            }
          );

          if (fbResponse.ok) {
            console.log('[Webhook PerfectPay] ✅ Purchase enviado para Facebook CAPI com event_id:', purchaseEventId);
            
            // Salvar event_id na tabela de tracking (se quiser vincular)
            try {
              await prisma.trackingPurchase.create({
                data: {
                  purchaseId: purchase.id,
                  eventId: purchaseEventId,
                  amount,
                  currency: 'BRL',
                  status: 'approved',
                  gateway: 'perfectpay',
                },
              });
            } catch (err) {
              // Não falhar se não conseguir salvar
              console.warn('[Webhook PerfectPay] ⚠️ Erro ao salvar tracking purchase:', err);
            }
          } else {
            console.warn('[Webhook PerfectPay] ⚠️ Erro ao enviar Purchase para Facebook CAPI:', await fbResponse.text());
          }
        } catch (capiError) {
          console.error('[Webhook PerfectPay] ⚠️ Erro no Facebook CAPI:', capiError);
          // Não falhar o webhook se CAPI falhar
        }
      } else {
        console.log('[Webhook PerfectPay] ℹ️ Facebook CAPI não configurado (FB_PIXEL_ID ou FB_ACCESS_TOKEN faltando)');
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`[Webhook PerfectPay] ✅ Processado em ${duration}ms:`, {
      id: purchase.id,
      externalId,
      status,
      customerEmail,
    });
    
    return new Response(JSON.stringify({
      success: true,
      purchase_id: purchase.id,
      status,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('[Webhook PerfectPay] ❌ Erro:', error);
    
    // Log do payload para debug
    try {
      const rawBody = await request.text();
      console.error('[Webhook PerfectPay] Raw payload:', rawBody);
    } catch {}
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// HANDLER GET (para verificação do endpoint)
// ═══════════════════════════════════════════════════════════════

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'PerfectPay webhook endpoint is active',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

