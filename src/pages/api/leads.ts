/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/leads
 * Captura de leads do quiz e paywall
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/leads
 * Captura de leads do quiz e paywall
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

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

export const prerender = false;

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

    // Verificar se já existe um lead com o mesmo email e user_id
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: data.email,
        userId: data.user_id,
      },
    });

    if (existingLead) {
      return new Response(JSON.stringify({
        lead_id: existingLead.id,
        status: 'duplicate',
        message: 'Lead já existe'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Criar novo lead no banco de dados
    const lead = await prisma.lead.create({
      data: {
        email: data.email,
        userId: data.user_id,
        name: data.name,
        phone: data.phone,
        quizId: data.quiz_id,
        source: data.source,
        utmSource: data.utm_source,
        utmMedium: data.utm_medium,
        utmCampaign: data.utm_campaign,
        utmContent: data.utm_content,
      },
    });

    console.log('[API/leads] Lead capturado:', { lead_id: lead.id, ...data });

    // TODO: Integrar com CRM/Email marketing (ActiveCampaign, Mailchimp, etc)
    // TODO: Enviar evento para Facebook CAPI

    return new Response(JSON.stringify({
      lead_id: lead.id,
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

