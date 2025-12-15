/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/quiz/result
 * Salva resultados do quiz
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';

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
  lead_id?: string; // Opcional: ID do lead associado
}

export interface QuizResultResponse {
  result_id: string;
  recommended_plan: 'basic' | 'standard' | 'premium';
  score: number;
}

export const prerender = false;

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

    // Salvar no banco de dados
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: data.user_id,
        quizId: data.quiz_id,
        score: data.score,
        gender: data.gender,
        recommendedPlan: recommended_plan,
        answers: data.answers as any, // Prisma aceita JSON
        imageReference: data.image_reference,
        leadId: data.lead_id, // Associar com lead se fornecido
      },
    });

    console.log('[API/quiz/result] Resultado salvo:', { result_id: quizResult.id, ...data });

    // TODO: Gerar recomendações personalizadas
    // TODO: Enviar para analytics

    return new Response(JSON.stringify({
      result_id: quizResult.id,
      recommended_plan: recommended_plan,
      score: quizResult.score
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

