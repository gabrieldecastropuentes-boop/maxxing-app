/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/reval
 * Agenda reavaliação mensal do usuário
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

export interface RevalPayload {
  user_id: string;
  result_id: string;
  reval_type: 'monthly' | 'weekly' | 'custom';
  scheduled_date?: string;
}

export interface RevalResponse {
  scheduled: boolean;
  next_reval_date: string;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: RevalPayload = await request.json();

    // Validação
    if (!data.user_id || !data.result_id) {
      return new Response(JSON.stringify({
        scheduled: false,
        next_reval_date: '',
        message: 'user_id e result_id são obrigatórios'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calcular próxima data de reavaliação
    const now = new Date();
    let nextDate: Date;
    
    switch (data.reval_type) {
      case 'weekly':
        nextDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
      default:
        nextDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // TODO: Salvar agendamento no banco de dados
    // TODO: Configurar job/cron para enviar notificação
    // TODO: Integrar com sistema de email

    console.log('[API/reval] Reavaliação agendada:', {
      user_id: data.user_id,
      result_id: data.result_id,
      next_date: nextDate.toISOString()
    });

    return new Response(JSON.stringify({
      scheduled: true,
      next_reval_date: nextDate.toISOString(),
      message: `Reavaliação ${data.reval_type} agendada com sucesso`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/reval] Erro:', error);
    return new Response(JSON.stringify({
      scheduled: false,
      next_reval_date: '',
      message: 'Erro interno do servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

