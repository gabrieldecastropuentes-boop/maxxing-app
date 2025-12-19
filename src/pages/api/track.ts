/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/track
 * Recebe eventos do browser, enriquece no server e salva no Supabase
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { getSupabaseServer } from '../../lib/supabase-server';
import { jsonError, jsonResponse } from '../../lib/apiResponse';

export const prerender = false;

// ═══════════════════════════════════════════════════════════════
// GET → 405 (para permitir ver status no navegador)
// ═══════════════════════════════════════════════════════════════
export const GET: APIRoute = async ({ request }) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/c16f74a9-f7f8-40d0-ab65-a7068f18cccd',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H4',
      location:'api/track.ts:GET',
      message:'GET received',
      data:{ method: request.method },
      timestamp:Date.now()
    })
  }).catch(()=>{});
  // #endregion

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
};

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
  
  const allowedOrigins = (import.meta.env.ALLOWED_ORIGINS || import.meta.env.PUBLIC_SITE_URL || '').split(',').map((o: string) => o.trim());
  
  if (allowedOrigins.length === 0) {
    // Se não configurado, aceitar qualquer origem em dev
    return import.meta.env.DEV;
  }
  
  return allowedOrigins.some((allowed: string) => origin.startsWith(allowed));
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/c16f74a9-f7f8-40d0-ab65-a7068f18cccd',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H1',
      location:'api/track.ts:POST:start',
      message:'incoming request',
      data:{
        method: request.method,
        origin: request.headers.get('origin') || null,
        hasSupabaseUrl: Boolean(import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL),
        hasServiceRole: Boolean(import.meta.env.SUPABASE_SERVICE_ROLE_KEY),
      },
      timestamp:Date.now()
    })
  }).catch(()=>{});
  // #endregion

  // ═══════════════════════════════════════════════════════════
  // CORS: Validar origem
  // ═══════════════════════════════════════════════════════════
  const origin = request.headers.get('origin');
  if (!isOriginAllowed(origin)) {
    return jsonError('Origin not allowed', 403);
  }

  try {
    let data: TrackEventPayload;
    try {
      data = await request.json();
    } catch (parseError) {
      return jsonError('Invalid JSON payload', 400);
    }

    // Validação básica (session_id é obrigatória; event_id pode ser gerado no server)
    if (!data.event_name || !data.session_id) {
      return jsonError('Missing required fields', 400);
    }

    // ═══════════════════════════════════════════════════════════
    // ENRIQUECER DADOS NO SERVER
    // ═══════════════════════════════════════════════════════════
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || '';

    const supabase = getSupabaseServer();

    const eventId = data.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // ═══════════════════════════════════════════════════════════
    // 1. CRIAR/ATUALIZAR SESSÃO NO SUPABASE
    // ═══════════════════════════════════════════════════════════
    try {
      // Buscar sessão existente
    const { data: existingSession } = await supabase
        .from('tracking_lmx_sessions')
        .select('*')
        .eq('session_id', data.session_id)
        .single();

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c16f74a9-f7f8-40d0-ab65-a7068f18cccd',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'pre-fix',
          hypothesisId:'H2',
          location:'api/track.ts:session-check',
          message:'session lookup result',
          data:{ found:Boolean(existingSession), session_id:data.session_id },
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion

      if (existingSession) {
        // Atualizar sessão existente
        await supabase
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
        await supabase
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
      const meta = data.meta || {};
      const utmMeta = {
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
        fbclid: data.fbclid,
      };

      const { error: eventError } = await supabase
        .from('tracking_lmx_events')
        .insert({
          session_id: data.session_id,
          event_name: data.event_name,
          event_id: eventId, // Para dedup Meta
          step_index: data.step_index,
          step_id: data.step_id,
          answer_id: data.answer_id,
          metadata: { ...meta, utm: utmMeta },
          page_url: data.page,
          referrer: referer,
      });

      if (eventError) {
        console.error('[API/track] ⚠️ Erro ao salvar evento:', eventError);
      } else {
        console.log('[API/track] ✅ Evento salvo:', data.event_name, 'event_id:', eventId);
      }
    } catch (eventError) {
      console.error('[API/track] ⚠️ Erro ao salvar evento:', eventError);
      // Não falhar o request se o banco falhar
    }

    // ═══════════════════════════════════════════════════════════
    // 3. DISPARAR FACEBOOK CAPI (quando disponível)
    // ═══════════════════════════════════════════════════════════
    // ⚠️ CRÍTICO: META_CAPI_ACCESS_TOKEN é server-only, nunca expor no client bundle
    const fbPixelId = import.meta.env.PUBLIC_FB_PIXEL_ID?.trim() || '';
    const metaCapiToken = import.meta.env.META_CAPI_ACCESS_TOKEN?.trim() || '';
    const META_API_VERSION = 'v20.0'; // Versão configurável da Meta API

    // Validar: se não tiver token, pular CAPI sem erro (mas continuar gravando no Supabase)
    if (fbPixelId && metaCapiToken) {
      try {
        const fbEventName = mapEventToFacebook(data.event_name);
        
        if (fbEventName) {
          const fbEvent = {
            event_name: fbEventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId, // ⚠️ CRÍTICO: Mesmo event_id do Pixel (dedup)
            event_source_url: data.page || referer,
            action_source: 'website',
            user_data: {
              client_ip_address: ip,
              client_user_agent: userAgent,
              ...(data.fbp && { fbp: data.fbp }),
              ...(data.fbc && { fbc: data.fbc }),
            },
            custom_data: {
              ...(data.step_index !== undefined && { step_index: data.step_index }),
              ...(data.answer_id !== undefined && { answer_id: data.answer_id }),
              ...(data.meta || {}),
            },
          };

          const fbResponse = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/${fbPixelId}/events?access_token=${metaCapiToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: [fbEvent] }),
            }
          );

          if (fbResponse.ok) {
            const fbResult = await fbResponse.json();
            console.log('[API/track] ✅ Evento enviado para Meta CAPI:', fbResult);
          } else {
            const errorText = await fbResponse.text();
            console.warn('[API/track] ⚠️ Erro ao enviar para Meta CAPI:', errorText);
          }
        }
      } catch (capiError) {
        console.error('[API/track] ⚠️ Erro no Meta CAPI:', capiError);
        // Não falhar o request se CAPI falhar
      }
    } else {
      // Log apenas em dev se CAPI não estiver configurado
      if (import.meta.env.DEV) {
        if (!fbPixelId) {
          console.log('[API/track] ⚠️ PUBLIC_FB_PIXEL_ID não configurado. CAPI não será chamado.');
        }
        if (!metaCapiToken) {
          console.log('[API/track] ⚠️ META_CAPI_ACCESS_TOKEN não configurado. CAPI não será chamado.');
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 4. RESPOSTA DE SUCESSO
    // ═══════════════════════════════════════════════════════════
    const response = jsonResponse({
      event_id: eventId,
      event_name: data.event_name,
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c16f74a9-f7f8-40d0-ab65-a7068f18cccd',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'H3',
        location:'api/track.ts:catch',
        message:'unhandled error',
        data:{ error: error instanceof Error ? error.message : String(error) },
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion

    console.error('[API/track] ❌ Erro:', error);
    return jsonError('Internal server error', 500);
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
