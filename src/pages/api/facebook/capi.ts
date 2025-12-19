/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/facebook/capi
 * Facebook Conversion API - Server-side tracking
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

export interface FacebookEventPayload {
  event_name: 'Lead' | 'ViewContent' | 'Subscribe' | 'Purchase' | 'InitiateCheckout' | 'CompleteRegistration';
  event_time?: number;
  event_source_url?: string;
  user_data?: {
    em?: string; // hashed email
    ph?: string; // hashed phone
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    quiz_score?: number;
  };
}

// ⚠️ CRÍTICO: META_CAPI_ACCESS_TOKEN é server-only, nunca expor no client bundle
const FB_PIXEL_ID = import.meta.env.PUBLIC_FB_PIXEL_ID?.trim() || '';
const META_CAPI_TOKEN = import.meta.env.META_CAPI_ACCESS_TOKEN?.trim() || '';
const META_API_VERSION = 'v20.0'; // Versão configurável da Meta API

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data: FacebookEventPayload = await request.json();

    // Preparar evento para Facebook
    const event = {
      event_name: data.event_name,
      event_time: data.event_time || Math.floor(Date.now() / 1000),
      event_source_url: data.event_source_url,
      action_source: 'website',
      user_data: {
        ...data.user_data,
        client_ip_address: data.user_data?.client_ip_address || clientAddress,
        client_user_agent: request.headers.get('user-agent') || '',
      },
      custom_data: data.custom_data,
    };

    console.log('[API/facebook/capi] Evento preparado:', event);

    // Validar: se não tiver token ou Pixel ID, retornar erro
    if (!FB_PIXEL_ID || !META_CAPI_TOKEN) {
      return new Response(JSON.stringify({
        success: false,
        error: !FB_PIXEL_ID ? 'PUBLIC_FB_PIXEL_ID não configurado' : 'META_CAPI_ACCESS_TOKEN não configurado',
        event_name: data.event_name,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API/facebook/capi] Erro ao enviar para Meta CAPI:', errorText);
      return new Response(JSON.stringify({
        success: false,
        error: 'Erro ao enviar evento para Meta CAPI',
        details: errorText,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fbResponse = await response.json();
    console.log('[API/facebook/capi] ✅ Resposta Meta CAPI:', fbResponse);

    return new Response(JSON.stringify({
      success: true,
      event_name: data.event_name,
      meta_response: fbResponse,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/facebook/capi] Erro:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao enviar evento'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

