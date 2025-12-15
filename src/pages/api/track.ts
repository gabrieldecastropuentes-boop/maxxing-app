/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/track
 * Recebe eventos do browser, enriquece no server e salva no Supabase
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const prerender = false;

export interface TrackEventPayload {
  // Evento
  event_name: string; // 'home_view', 'quiz_step_view', etc.
  event_id: string; // UUID gerado no frontend (para dedup Meta)
  session_id: string; // UUID do localStorage
  
  // Dados do evento
  step_index?: number;
  step_id?: string;
  answer_id?: number;
  
  // Page/URL
  page?: string; // URL da página
  
  // UTMs e parâmetros
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  
  // Facebook Cookies
  fbp?: string; // Facebook Pixel Browser ID
  fbc?: string; // Facebook Click ID
  
  // Metadados
  meta?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Validar CORS
// ═══════════════════════════════════════════════════════════════
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = (import.meta.env.ALLOWED_ORIGINS || import.meta.env.PUBLIC_SITE_URL || '').split(',').map(o => o.trim());
  
  if (allowedOrigins.length === 0) {
    // Se não configurado, aceitar qualquer origem em dev
    return import.meta.env.DEV;
  }
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Inferir source do evento
// ═══════════════════════════════════════════════════════════════
function inferSourceFromEvent(event: string): string {
  if (event.includes('home')) return 'home';
  if (event.includes('quiz')) return 'quiz';
  if (event.includes('vsl')) return 'vsl';
  if (event.includes('checkout')) return 'checkout';
  return 'web';
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Mapear eventos para formato Facebook
// ═══════════════════════════════════════════════════════════════
function mapEventToFacebook(event: string): string | null {
  const eventMap: Record<string, string> = {
    home_view: 'PageView',
    start_quiz_click: 'ViewContent',
    quiz_step_view: 'ViewContent',
    quiz_answer_select: 'ViewContent',
    quiz_complete: 'CompleteRegistration',
    photo_upload_start: 'ViewContent',
    photo_upload_success: 'ViewContent',
    photo_upload_skip: 'ViewContent',
    photo_upload_error: 'ViewContent',
    vsl_view: 'ViewContent',
    checkout_click: 'InitiateCheckout',
  };
  
  return eventMap[event] || null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // ═══════════════════════════════════════════════════════════
  // CORS: Validar origem
  // ═══════════════════════════════════════════════════════════
  const origin = request.headers.get('origin');
  if (!isOriginAllowed(origin)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Origin not allowed' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const data: TrackEventPayload = await request.json();

    // Validação básica
    if (!data.event_name || !data.event_id || !data.session_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ═══════════════════════════════════════════════════════════
    // ENRIQUECER DADOS NO SERVER
    // ═══════════════════════════════════════════════════════════
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || '';

    // ═══════════════════════════════════════════════════════════
    // 1. CRIAR/ATUALIZAR SESSÃO NO SUPABASE
    // ═══════════════════════════════════════════════════════════
    try {
      // Buscar sessão existente
      const { data: existingSession } = await supabaseServer
        .from('tracking_lmx_sessions')
        .select('*')
        .eq('session_id', data.session_id)
        .single();

      if (existingSession) {
        // Atualizar sessão existente
        await supabaseServer
          .from('tracking_lmx_sessions')
          .update({
            last_seen_at: new Date().toISOString(),
            // Atualizar fbp/fbc apenas se não existirem
            ...(data.fbp && !existingSession.fbp && { fbp: data.fbp }),
            ...(data.fbc && !existingSession.fbc && { fbc: data.fbc }),
          })
          .eq('session_id', data.session_id);
      } else {
        // Criar nova sessão
        await supabaseServer
          .from('tracking_lmx_sessions')
          .insert({
            session_id: data.session_id,
            fbp: data.fbp,
            fbc: data.fbc,
            fbclid: data.fbclid,
            utm_source: data.utm_source,
            utm_medium: data.utm_medium,
            utm_campaign: data.utm_campaign,
            utm_content: data.utm_content,
            utm_term: data.utm_term,
            user_agent: userAgent,
            referrer: referer,
            landing_url: data.page,
          });
      }
    } catch (sessionError) {
      console.error('[API/track] ⚠️ Erro ao salvar sessão:', sessionError);
      // Continuar mesmo se falhar
    }

    // ═══════════════════════════════════════════════════════════
    // 2. SALVAR EVENTO NO SUPABASE
    // ═══════════════════════════════════════════════════════════
    try {
      const { error: eventError } = await supabaseServer
        .from('tracking_lmx_events')
        .insert({
          session_id: data.session_id,
          event_name: data.event_name,
          event_id: data.event_id, // Para dedup Meta
          step_index: data.step_index,
          step_id: data.step_id,
          answer_id: data.answer_id,
          metadata: data.meta || {},
          page_url: data.page,
          referrer: referer,
        });

      if (eventError) {
        console.error('[API/track] ⚠️ Erro ao salvar evento:', eventError);
      } else {
        console.log('[API/track] ✅ Evento salvo:', data.event_name, 'event_id:', data.event_id);
      }
    } catch (eventError) {
      console.error('[API/track] ⚠️ Erro ao salvar evento:', eventError);
      // Não falhar o request se o banco falhar
    }

    // ═══════════════════════════════════════════════════════════
    // 3. DISPARAR FACEBOOK CAPI (quando disponível)
    // ═══════════════════════════════════════════════════════════
    const fbPixelId = import.meta.env.FB_PIXEL_ID || import.meta.env.PUBLIC_FB_PIXEL_ID;
    const fbAccessToken = import.meta.env.FB_ACCESS_TOKEN || import.meta.env.META_CAPI_ACCESS_TOKEN;

    if (fbPixelId && fbAccessToken) {
      try {
        const fbEventName = mapEventToFacebook(data.event_name);
        
        if (fbEventName) {
          const fbEvent = {
            event_name: fbEventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: data.event_id, // ⚠️ CRÍTICO: Mesmo event_id do Pixel (dedup)
            event_source_url: data.page || referer,
            action_source: 'website',
            user_data: {
              client_ip_address: ip,
              client_user_agent: userAgent,
              fbp: data.fbp,
              fbc: data.fbc,
            },
            custom_data: {
              ...(data.step_index !== undefined && { step_index: data.step_index }),
              ...(data.answer_id !== undefined && { answer_id: data.answer_id }),
              ...(data.meta || {}),
            },
          };

          // TODO: Descomentar quando tiver META_CAPI_ACCESS_TOKEN
          /*
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
          */
        }
      } catch (capiError) {
        console.error('[API/track] ⚠️ Erro no Facebook CAPI:', capiError);
        // Não falhar o request se CAPI falhar
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 4. RESPOSTA DE SUCESSO
    // ═══════════════════════════════════════════════════════════
    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('[API/track] ❌ Erro:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// ═══════════════════════════════════════════════════════════════
// OPTIONS para CORS preflight
// ═══════════════════════════════════════════════════════════════
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin || '*' : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
