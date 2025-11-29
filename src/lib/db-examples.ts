// ═══════════════════════════════════════════════════════════════
// EXEMPLOS DE USO DO PRISMA
// Este arquivo contém exemplos de como usar o Prisma nas APIs
// ═══════════════════════════════════════════════════════════════

import { prisma } from './db';

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 1: Criar um Lead
// ═══════════════════════════════════════════════════════════════
export async function createLeadExample() {
  try {
    // Verificar se já existe um lead com o mesmo email e user_id
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: 'usuario@example.com',
        userId: 'user_123',
      },
    });

    if (existingLead) {
      return {
        lead_id: existingLead.id,
        status: 'duplicate' as const,
        message: 'Lead já existe',
      };
    }

    // Criar novo lead
    const lead = await prisma.lead.create({
      data: {
        email: 'usuario@example.com',
        userId: 'user_123',
        name: 'João Silva',
        phone: '+5511999999999',
        source: 'quiz',
        quizId: 'quiz_123',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'quiz_campaign',
        utmContent: 'ad_1',
      },
    });

    return {
      lead_id: lead.id,
      status: 'captured' as const,
    };
  } catch (error) {
    console.error('[DB] Erro ao criar lead:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 2: Criar QuizResult
// ═══════════════════════════════════════════════════════════════
export async function createQuizResultExample() {
  try {
    const answers = [
      { questionId: 1, answerId: 2, score: 8 },
      { questionId: 2, answerId: 1, score: 7 },
      { questionId: 3, answerId: 3, score: 9 },
    ];

    const score = 75;
    const gender = 'male' as const;

    // Determinar plano recomendado
    let recommendedPlan: 'basic' | 'standard' | 'premium';
    if (score > 70) {
      recommendedPlan = 'premium';
    } else if (score > 50) {
      recommendedPlan = 'standard';
    } else {
      recommendedPlan = 'basic';
    }

    // Criar resultado do quiz
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: 'user_123',
        quizId: 'quiz_123',
        score,
        gender,
        recommendedPlan,
        answers: answers as any, // Prisma aceita JSON
        imageReference: 'https://example.com/image.jpg',
        leadId: 'lead_123', // Opcional: associar com um lead
      },
    });

    return {
      result_id: quizResult.id,
      recommended_plan: recommendedPlan,
      score: quizResult.score,
    };
  } catch (error) {
    console.error('[DB] Erro ao criar quiz result:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 3: Criar PhotoScore
// ═══════════════════════════════════════════════════════════════
export async function createPhotoScoreExample() {
  try {
    const photoScore = await prisma.photoScore.create({
      data: {
        userId: 'user_123',
        quizResultId: 'quiz_result_123', // Opcional: associar com resultado do quiz
        overallScore: 78,
        symmetry: 80,
        skinQuality: 75,
        facialStructure: 82,
        eyeArea: 76,
        jawline: 77,
        analysis: 'Excelente estrutura facial com alto grau de simetria...',
        imageReference: 'https://example.com/photo.jpg',
      },
    });

    return photoScore;
  } catch (error) {
    console.error('[DB] Erro ao criar photo score:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 4: Buscar Leads com Filtros
// ═══════════════════════════════════════════════════════════════
export async function getLeadsExample() {
  try {
    // Buscar leads de uma fonte específica
    const quizLeads = await prisma.lead.findMany({
      where: {
        source: 'quiz',
        createdAt: {
          gte: new Date('2024-01-01'), // Desde 1º de janeiro de 2024
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limitar a 100 resultados
    });

    return quizLeads;
  } catch (error) {
    console.error('[DB] Erro ao buscar leads:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 5: Buscar QuizResults com Relacionamentos
// ═══════════════════════════════════════════════════════════════
export async function getQuizResultsWithLeadExample() {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId: 'user_123',
      },
      include: {
        lead: true, // Incluir dados do lead relacionado
        photoScores: true, // Incluir photo scores relacionados
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results;
  } catch (error) {
    console.error('[DB] Erro ao buscar quiz results:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 6: Criar Evento de Tracking
// ═══════════════════════════════════════════════════════════════
export async function createEventExample() {
  try {
    const event = await prisma.event.create({
      data: {
        userId: 'user_123',
        eventName: 'ViewContent',
        eventData: {
          content_name: 'Quiz Step: questions',
          content_category: 'quiz',
          timestamp: Date.now(),
        },
        source: 'web',
      },
    });

    return event;
  } catch (error) {
    console.error('[DB] Erro ao criar evento:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 7: Estatísticas Agregadas
// ═══════════════════════════════════════════════════════════════
export async function getStatsExample() {
  try {
    // Contar leads por fonte
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });

    // Média de scores do quiz
    const avgScore = await prisma.quizResult.aggregate({
      _avg: {
        score: true,
      },
    });

    // Contar eventos por nome
    const eventsByName = await prisma.event.groupBy({
      by: ['eventName'],
      _count: {
        id: true,
      },
    });

    return {
      leadsBySource,
      avgScore: avgScore._avg.score,
      eventsByName,
    };
  } catch (error) {
    console.error('[DB] Erro ao buscar estatísticas:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 8: Atualizar Lead
// ═══════════════════════════════════════════════════════════════
export async function updateLeadExample() {
  try {
    const updatedLead = await prisma.lead.update({
      where: {
        id: 'lead_123',
      },
      data: {
        phone: '+5511888888888',
        name: 'João Silva Atualizado',
      },
    });

    return updatedLead;
  } catch (error) {
    console.error('[DB] Erro ao atualizar lead:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXEMPLO 9: Transação (Múltiplas Operações)
// ═══════════════════════════════════════════════════════════════
export async function transactionExample() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Criar lead
      const lead = await tx.lead.create({
        data: {
          email: 'usuario@example.com',
          userId: 'user_123',
          source: 'quiz',
        },
      });

      // Criar quiz result associado
      const quizResult = await tx.quizResult.create({
        data: {
          userId: 'user_123',
          quizId: 'quiz_123',
          score: 75,
          gender: 'male',
          recommendedPlan: 'premium',
          answers: [],
          leadId: lead.id, // Associar com o lead criado
        },
      });

      // Criar evento
      await tx.event.create({
        data: {
          userId: 'user_123',
          eventName: 'QuizCompleted',
          eventData: {
            quizId: 'quiz_123',
            score: 75,
          },
        },
      });

      return { lead, quizResult };
    });

    return result;
  } catch (error) {
    console.error('[DB] Erro na transação:', error);
    throw error;
  }
}

