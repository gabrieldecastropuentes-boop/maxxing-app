/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/quiz/result
 * Salva resultados do quiz
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

export interface QuizResultPayload {
  user_id: string;
  quiz_id: string;
  answers: Array<{
    questionId: number;
    answerId: number;
    score: number;
  }>;
  score: number;
  image_reference?: string;
  gender: 'male' | 'female';
}

export interface QuizResultResponse {
  result_id: string;
  recommended_plan: 'basic' | 'standard' | 'premium';
  score: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: QuizResultPayload = await request.json();

    // Validação
    if (!data.user_id || !data.quiz_id) {
      return new Response(JSON.stringify({
        error: 'user_id e quiz_id são obrigatórios'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determinar plano recomendado baseado no score
    let recommended_plan: 'basic' | 'standard' | 'premium';
    if (data.score > 70) {
      recommended_plan = 'premium';
    } else if (data.score > 50) {
      recommended_plan = 'standard';
    } else {
      recommended_plan = 'basic';
    }

    const result_id = `result_${data.quiz_id}_${Date.now()}`;

    // TODO: Salvar no banco de dados
    // TODO: Gerar recomendações personalizadas
    // TODO: Enviar para analytics

    console.log('[API/quiz/result] Resultado salvo:', { result_id, ...data });

    return new Response(JSON.stringify({
      result_id,
      recommended_plan,
      score: data.score
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/quiz/result] Erro:', error);
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

