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

// Configuração do Facebook (substituir por variáveis de ambiente)
const FB_PIXEL_ID = import.meta.env.FB_PIXEL_ID || 'YOUR_PIXEL_ID';
const FB_ACCESS_TOKEN = import.meta.env.FB_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const FB_API_VERSION = 'v18.0';

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

    // TODO: Descomentar quando tiver as credenciais do Facebook
    /*
    const response = await fetch(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
        }),
      }
    );

    const fbResponse = await response.json();
    console.log('[API/facebook/capi] Resposta FB:', fbResponse);
    */

    return new Response(JSON.stringify({
      success: true,
      event_name: data.event_name,
      message: 'Evento registrado (modo de desenvolvimento)'
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

