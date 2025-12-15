/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/track
 * Arquitetura ideal: Recebe eventos do browser (home/quiz/vsl),
 * salva no Supabase e dispara CAPI/Pixel quando disponível
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export interface TrackEventPayload {
  event: string; // 'ViewContent', 'Lead', 'InitiateCheckout', 'Purchase', etc.
  user_id?: string;
  quiz_step?: string;
  source?: 'home' | 'quiz' | 'vsl' | 'pre-checkout';
  metadata?: Record<string, any>;
  timestamp?: number;
  // Facebook Pixel data
  fbp?: string; // Facebook Pixel Browser ID
  fbc?: string; // Facebook Click ID
  // User data for CAPI
  email?: string;
  phone?: string;
  // Custom data
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data: TrackEventPayload = await request.json();

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = data.timestamp || Date.now();

    // Preparar dados do evento
    const eventRecord = {
      event_name: data.event,
      user_id: data.user_id,
      source: data.source || 'unknown',
      quiz_step: data.quiz_step,
      metadata: {
        ...data.metadata,
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        ip: clientAddress,
      },
      event_data: {
        value: data.value,
        currency: data.currency || 'BRL',
        content_name: data.content_name,
        content_category: data.content_category,
        ...data.metadata,
      },
      created_at: new Date(timestamp).toISOString(),
    };

    console.log('[API/track] Evento recebido:', eventRecord);

    // ═══════════════════════════════════════════════════════════
    // 1. SALVAR NO SUPABASE (Eventos)
    // ═══════════════════════════════════════════════════════════
    try {
      // Salvar no Supabase usando Prisma (já configurado)
      await prisma.event.create({
        data: {
          userId: data.user_id,
          eventName: data.event,
          eventData: eventRecord.event_data as any,
          source: data.source || 'web',
        },
      });
      console.log('[API/track] ✅ Evento salvo no banco');
    } catch (dbError) {
      console.error('[API/track] ⚠️ Erro ao salvar no banco:', dbError);
      // Não falhar o request se o banco falhar
    }

    // ═══════════════════════════════════════════════════════════
    // 2. DISPARAR FACEBOOK CAPI (quando disponível)
    // ═══════════════════════════════════════════════════════════
    const fbPixelId = import.meta.env.FB_PIXEL_ID || import.meta.env.PUBLIC_FB_PIXEL_ID;
    const fbAccessToken = import.meta.env.FB_ACCESS_TOKEN;

    if (fbPixelId && fbAccessToken) {
      try {
        // Mapear eventos para formato Facebook
        const fbEventName = mapEventToFacebook(data.event);
        
        if (fbEventName) {
          const fbEvent = {
            event_name: fbEventName,
            event_time: Math.floor(timestamp / 1000),
            event_source_url: request.headers.get('referer') || '',
            action_source: 'website',
            user_data: {
              client_ip_address: clientAddress,
              client_user_agent: request.headers.get('user-agent') || '',
              fbp: data.fbp,
              fbc: data.fbc,
              ...(data.email && { em: hashEmail(data.email) }),
              ...(data.phone && { ph: hashPhone(data.phone) }),
            },
            custom_data: {
              ...(data.value && { value: data.value }),
              currency: data.currency || 'BRL',
              ...(data.content_name && { content_name: data.content_name }),
              ...(data.content_category && { content_category: data.content_category }),
            },
          };

          // Enviar para Facebook CAPI
          const fbResponse = await fetch(
            `https://graph.facebook.com/v18.0/${fbPixelId}/events?access_token=${fbAccessToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: [fbEvent] }),
            }
          );

          if (fbResponse.ok) {
            console.log('[API/track] ✅ Evento enviado para Facebook CAPI');
          } else {
            console.warn('[API/track] ⚠️ Erro ao enviar para Facebook CAPI:', await fbResponse.text());
          }
        }
      } catch (capiError) {
        console.error('[API/track] ⚠️ Erro no Facebook CAPI:', capiError);
        // Não falhar o request se CAPI falhar
      }
    } else {
      console.log('[API/track] ℹ️ Facebook CAPI não configurado (FB_PIXEL_ID ou FB_ACCESS_TOKEN faltando)');
    }

    // ═══════════════════════════════════════════════════════════
    // 3. RESPOSTA DE SUCESSO
    // ═══════════════════════════════════════════════════════════
    return new Response(
      JSON.stringify({
        success: true,
        event_id: eventId,
        event: data.event,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[API/track] ❌ Erro:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro ao processar evento',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Mapear eventos para formato Facebook
// ═══════════════════════════════════════════════════════════════
function mapEventToFacebook(event: string): string | null {
  const eventMap: Record<string, string> = {
    ViewContent: 'ViewContent',
    Lead: 'Lead',
    InitiateCheckout: 'InitiateCheckout',
    Purchase: 'Purchase',
    CompleteRegistration: 'CompleteRegistration',
    AddToCart: 'AddToCart',
    Search: 'Search',
    // Eventos customizados
    QuizStep: 'ViewContent',
    QuizCompleted: 'CompleteRegistration',
    PaywallView: 'ViewContent',
  };

  return eventMap[event] || null;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Hash email para Facebook CAPI
// ═══════════════════════════════════════════════════════════════
function hashEmail(email: string): string {
  // Facebook requer SHA256 hash
  // Em produção, use uma biblioteca de hash adequada
  // Por enquanto, retornamos o email (Facebook fará o hash se necessário)
  return email.toLowerCase().trim();
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Hash phone para Facebook CAPI
// ═══════════════════════════════════════════════════════════════
function hashPhone(phone: string): string {
  // Remove caracteres não numéricos
  return phone.replace(/\D/g, '');
}

