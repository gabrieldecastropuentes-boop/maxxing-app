/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/leads
 * Captura de leads do quiz e paywall
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

export interface LeadPayload {
  name?: string;
  email: string;
  phone?: string;
  quiz_id?: string;
  user_id: string;
  source: 'quiz' | 'paywall' | 'landing' | 'popup';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export interface LeadResponse {
  lead_id: string;
  status: 'captured' | 'duplicate' | 'error';
  message?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: LeadPayload = await request.json();

    // Validação básica
    if (!data.email || !data.user_id) {
      return new Response(JSON.stringify({
        lead_id: '',
        status: 'error',
        message: 'Email e user_id são obrigatórios'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Implementar salvamento no banco de dados
    // TODO: Integrar com CRM/Email marketing (ActiveCampaign, Mailchimp, etc)
    // TODO: Enviar evento para Facebook CAPI
    
    const lead_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log('[API/leads] Lead capturado:', { lead_id, ...data });

    return new Response(JSON.stringify({
      lead_id,
      status: 'captured'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/leads] Erro:', error);
    return new Response(JSON.stringify({
      lead_id: '',
      status: 'error',
      message: 'Erro interno do servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

