import type { QuizQuestion } from './quizData';

// ═══════════════════════════════════════════════════════════════
// TIPOS DE FAIXA ETÁRIA
// ═══════════════════════════════════════════════════════════════
export type AgeRange = '18-24' | '25-29' | '30-34' | '35-39' | '40+';

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO: Adaptar Pergunta por Idade
// ═══════════════════════════════════════════════════════════════
export function adaptQuestionByAge(
  question: QuizQuestion,
  ageRange: AgeRange | string,
  gender: 'male' | 'female'
): QuizQuestion {
  // Se não há idade selecionada, retorna pergunta original
  if (!ageRange) return question;

  // Determinar grupo etário
  const ageGroup = getAgeGroup(ageRange);

  // Clonar pergunta para não modificar original
  const adaptedQuestion = { ...question };

  // ═══════════════════════════════════════════════════════════════
  // ADAPTAÇÕES ESPECÍFICAS POR PERGUNTA E IDADE
  // ═══════════════════════════════════════════════════════════════

  // PERGUNTA 4: Saúde da Pele (id: 4)
  if (question.id === 4) {
    if (gender === 'female') {
      if (ageGroup === 'young') {
        // 18-24: Foco em oleosidade e acne
        adaptedQuestion.subtitle = "Pense na textura, se está oleosa, se tem acne ou se está opaca";
      } else if (ageGroup === 'middle') {
        // 25-35: Foco em hidratação e manchas
        adaptedQuestion.subtitle = "Pense na textura, se está hidratada, se tem manchas ou se está opaca";
      } else {
        // 35+: Foco em hidratação e linhas finas
        adaptedQuestion.subtitle = "Pense na textura, se está hidratada, se tem linhas finas ou se está opaca";
      }
    } else {
      // Masculino
      if (ageGroup === 'young') {
        adaptedQuestion.subtitle = "Pense na textura, se tem acne, se está oleosa ou se tem manchas";
      } else if (ageGroup === 'middle') {
        adaptedQuestion.subtitle = "Pense na textura, se tem manchas, se está hidratada ou se está opaca";
      } else {
        adaptedQuestion.subtitle = "Pense na textura, se está hidratada, se tem linhas finas ou se está opaca";
      }
    }
  }

  // PERGUNTA 5: Contorno/Mandíbula (id: 5)
  if (question.id === 5) {
    if (gender === 'female') {
      if (ageGroup === 'mature') {
        // 35+: Tom mais respeitoso
        adaptedQuestion.question = "Você sente que seu rosto mantém definição?";
        adaptedQuestion.subtitle = "Pense nas maçãs do rosto (bochechas) e na linha do queixo - ainda estão bem marcadas ou estão mais suaves?";
      }
    } else {
      // Masculino
      if (ageGroup === 'mature') {
        adaptedQuestion.question = "Você sente que sua mandíbula mantém definição?";
        adaptedQuestion.subtitle = "Pense na linha do queixo - ainda está bem marcada ou está mais suave?";
      }
    }
  }

  // PERGUNTA 6: Cabelo (id: 6)
  if (question.id === 6) {
    if (gender === 'male') {
      if (ageGroup === 'young') {
        adaptedQuestion.subtitle = "Pense na espessura, se está caindo, se tem volume ou se está ralo";
      } else if (ageGroup === 'middle') {
        adaptedQuestion.subtitle = "Pense na espessura, se está ficando ralo, se tem entradas ou se está caindo";
      } else {
        adaptedQuestion.subtitle = "Pense na espessura, se está ralo, se tem entradas ou se já está calvo";
      }
    }
  }

  // PERGUNTA 9: Mewing (id: 9) - Mais relevante para jovens
  if (question.id === 9 && gender === 'male') {
    if (ageGroup === 'mature') {
      // Para 35+, adaptar tom
      adaptedQuestion.subtitle = "Mewing (posicionar a língua no céu da boca) pode ajudar a manter a definição da mandíbula";
    }
  }

  // PERGUNTA 10: Rotina Skincare (id: 10)
  if (question.id === 10) {
    if (gender === 'male') {
      if (ageGroup === 'young') {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - mesmo que seja básica";
      } else if (ageGroup === 'middle') {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - importante para manter a pele saudável";
      } else {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - essencial para prevenir envelhecimento";
      }
    } else {
      // Feminino
      if (ageGroup === 'young') {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - mesmo que seja básica";
      } else if (ageGroup === 'middle') {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - importante para manter a pele saudável";
      } else {
        adaptedQuestion.subtitle = "Limpeza, hidratação e protetor solar - essencial para prevenir envelhecimento";
      }
    }
  }

  // PERGUNTA 8: Postura (id: 8) - Masculino
  if (question.id === 8 && gender === 'male') {
    if (ageGroup === 'mature') {
      adaptedQuestion.subtitle = "Pense se você fica ereto ou se costuma ficar curvado - postura é importante em qualquer idade";
    }
  }

  // PERGUNTA 11: Sentimento sobre Aparência (id: 11)
  if (question.id === 11) {
    // Já tem "hoje" adicionado, mas podemos adaptar opções se necessário
    // Por enquanto mantém igual para todas as idades
  }

  // PERGUNTA 12: Encontros/Relacionamentos (id: 12) - Masculino
  if (question.id === 12 && gender === 'male') {
    if (ageGroup === 'young') {
      adaptedQuestion.subtitle = "Pense em apps de relacionamento, encontros casuais e relacionamentos";
    } else if (ageGroup === 'middle') {
      adaptedQuestion.subtitle = "Pense em relacionamentos, encontros e vida amorosa";
    } else {
      adaptedQuestion.subtitle = "Pense em relacionamentos, encontros e conexões";
    }
  }

  // PERGUNTA 15: Objetivo (id: 15)
  if (question.id === 15) {
    // Já adaptado para "transformação" em vez de "glow-up"
    // Mantém igual para todas as idades
  }

  // PERGUNTA 16: Tempo (id: 16)
  if (question.id === 16) {
    if (ageGroup === 'young') {
      // Jovens podem ter mais tempo
      adaptedQuestion.subtitle = "Pense no tempo que você consegue dedicar diariamente";
    } else if (ageGroup === 'middle') {
      adaptedQuestion.subtitle = "Pense no tempo que você consegue dedicar diariamente - mesmo que seja pouco";
    } else {
      adaptedQuestion.subtitle = "Pense no tempo que você consegue dedicar diariamente - rotinas eficientes são possíveis";
    }
  }

  return adaptedQuestion;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO: Determinar Grupo Etário
// ═══════════════════════════════════════════════════════════════
function getAgeGroup(ageRange: AgeRange | string): 'young' | 'middle' | 'mature' {
  if (ageRange === '18-24' || ageRange === '25-29') {
    return 'young';
  } else if (ageRange === '30-34' || ageRange === '35-39') {
    return 'middle';
  } else {
    return 'mature'; // 40+
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO: Filtrar Perguntas por Idade (Opcional)
// ═══════════════════════════════════════════════════════════════
export function filterQuestionsByAge(
  questions: QuizQuestion[],
  ageRange: AgeRange | string
): QuizQuestion[] {
  // Por enquanto, não removemos perguntas, apenas adaptamos
  // Mas podemos adicionar lógica aqui se necessário
  return questions;
}

