export interface QuizOption {
  id: number;
  text: string;
  score: number;
  icon?: string;
  image?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle?: string;
  type: 'text' | 'image' | 'grid';
  options: QuizOption[];
}

export interface TransitionMessage {
  icon: string;
  title: string;
  subtitle: string;
  fact?: string;
  statValue?: string;
  statText?: string;
  highlightText?: string;
}

export interface ScoreCategory {
  min: number;
  max: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

// =====================================================
// PERGUNTAS DO QUIZ - 100% EM PORTUGUÊS BRASILEIRO
// =====================================================
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o seu gênero?",
    type: 'text',
    options: [
      { id: 1, text: "Masculino", score: 0, icon: "👨" },
      { id: 2, text: "Feminino", score: 0, icon: "👩" },
    ],
  },
  {
    id: 2,
    question: "Qual é a sua faixa de idade?",
    subtitle: "Fatores de atratividade variam por idade",
    type: 'text',
    options: [
      { id: 1, text: "18-24", score: 4 },
      { id: 2, text: "25-29", score: 4 },
      { id: 3, text: "30-34", score: 3 },
      { id: 4, text: "35-39", score: 3 },
      { id: 5, text: "40+", score: 2 },
    ],
  },
  {
    id: 3,
    question: "Qual melhor descreve seu tipo de corpo?",
    subtitle: "Isso ajuda a personalizar seu plano de cuidados",
    type: 'image', // renderizado como grid 2x2 com imagens
    options: [
      { id: 1, text: "Musculoso", score: 4, image: "/media/muscular.jpg" },
      { id: 2, text: "Magro", score: 3, image: "/media/skinny.jpg" },
      { id: 3, text: "Mediano", score: 3, image: "/media/average.jpg" },
      { id: 4, text: "Acima do peso", score: 2, image: "/media/overweight.jpg" },
    ],
  },
  {
    id: 4,
    question: "Como você sente que está sua pele hoje?",
    subtitle: "Pense na textura, se tem acne, manchas ou se está opaca",
    type: 'text',
    options: [
      { id: 1, text: "Excelente, pele limpa e clara", score: 4, icon: "✨" },
      { id: 2, text: "Boa, poucos problemas", score: 3, icon: "👍" },
      { id: 3, text: "Regular, alguns problemas", score: 2, icon: "😐" },
      { id: 4, text: "Precisa melhorar bastante", score: 1, icon: "😕" },
    ],
  },
  {
    id: 5,
    question: "Você sente que sua mandíbula tem definição?",
    subtitle: "Pense na linha do queixo - está bem marcada ou mais arredondada?",
    type: 'text',
    options: [
      { id: 1, text: "Muito definida e angular", score: 4, icon: "💎" },
      { id: 2, text: "Moderadamente definida", score: 3, icon: "👍" },
      { id: 3, text: "Pouco definida", score: 2, icon: "😐" },
      { id: 4, text: "Nada definida", score: 1, icon: "🤷" },
    ],
  },
  {
    id: 6,
    question: "Como você sente que está seu cabelo?",
    subtitle: "Pense na espessura, se está ralo, se tem volume ou se está caindo",
    type: 'text',
    options: [
      { id: 1, text: "Cheio e saudável", score: 4, icon: "💇" },
      { id: 2, text: "Começando a ficar ralo", score: 3, icon: "📉" },
      { id: 3, text: "Visivelmente ralo", score: 2, icon: "😟" },
      { id: 4, text: "Calvo ou raspado", score: 2, icon: "🧑‍🦲" },
    ],
  },
  {
    id: 7,
    question: "Você sente que seu corte de cabelo combina com seu rosto?",
    type: 'text',
    options: [
      { id: 1, text: "Sim, perfeitamente", score: 4, icon: "💯" },
      { id: 2, text: "Acho que sim", score: 3, icon: "🤔" },
      { id: 3, text: "Não tenho certeza", score: 2, icon: "😕" },
      { id: 4, text: "Não, preciso de ajuda", score: 1, icon: "❓" },
    ],
  },
  {
    id: 8,
    question: "Você sente que sua postura está boa?",
    subtitle: "Pense se você fica ereto ou se costuma ficar curvado",
    type: 'text',
    options: [
      { id: 1, text: "Excelente, sempre ereto", score: 4, icon: "🧘" },
      { id: 2, text: "Boa na maior parte do tempo", score: 3, icon: "👍" },
      { id: 3, text: "Preciso melhorar", score: 2, icon: "😕" },
      { id: 4, text: "Péssima, fico curvado", score: 1, icon: "🦴" },
    ],
  },
  {
    id: 9,
    question: "Você pratica mewing ou exercícios faciais?",
    subtitle: "Mewing (posicionar a língua no céu da boca) ajuda a definir a mandíbula",
    type: 'text',
    options: [
      { id: 1, text: "Sim, diariamente", score: 4, icon: "✅" },
      { id: 2, text: "Às vezes", score: 3, icon: "🔄" },
      { id: 3, text: "Já ouvi falar mas não pratico", score: 2, icon: "🤔" },
      { id: 4, text: "Nunca ouvi falar", score: 1, icon: "❓" },
    ],
  },
  {
    id: 10,
    question: "Você tem uma rotina de cuidados com a pele?",
    subtitle: "Limpeza, hidratação e protetor solar - mesmo que seja básica",
    type: 'text',
    options: [
      { id: 1, text: "Diariamente, rotina completa", score: 4, icon: "🧴" },
      { id: 2, text: "Algumas vezes por semana", score: 3, icon: "📅" },
      { id: 3, text: "Raramente", score: 2, icon: "😕" },
      { id: 4, text: "Nunca pensei nisso", score: 1, icon: "❌" },
    ],
  },
  {
    id: 11,
    question: "Como você se sente com sua aparência hoje?",
    type: 'text',
    options: [
      { id: 1, text: "Muito confiante", score: 4, icon: "😎" },
      { id: 2, text: "Confiante na maioria das vezes", score: 3, icon: "🙂" },
      { id: 3, text: "Inseguro às vezes", score: 2, icon: "😕" },
      { id: 4, text: "Muito inseguro", score: 1, icon: "😔" },
    ],
  },
  {
    id: 13,
    question: "Você recebe elogios sobre sua aparência com frequência?",
    type: 'text',
    options: [
      { id: 1, text: "Frequentemente", score: 4, icon: "🌟" },
      { id: 2, text: "Às vezes", score: 3, icon: "😊" },
      { id: 3, text: "Raramente", score: 2, icon: "🤷" },
      { id: 4, text: "Quase nunca", score: 1, icon: "😔" },
    ],
  },
  {
    id: 14,
    question: "Como você considera sua vida social?",
    type: 'text',
    options: [
      { id: 1, text: "Muito ativa, saio frequentemente", score: 4, icon: "🎉" },
      { id: 2, text: "Moderada", score: 3, icon: "👥" },
      { id: 3, text: "Limitada", score: 2, icon: "🏠" },
      { id: 4, text: "Quase inexistente", score: 1, icon: "😞" },
    ],
  },
  {
    id: 15,
    question: "Qual é seu maior objetivo com essa transformação?",
    type: 'text',
    options: [
      { id: 1, text: "Aumentar a autoconfiança", score: 4, icon: "💪" },
      { id: 2, text: "Melhorar com minha parceira e em novos encontros", score: 4, icon: "❤️" },
      { id: 3, text: "Ser mais atraente", score: 4, icon: "✨" },
      { id: 4, text: "Melhorar na carreira", score: 4, icon: "💼" },
    ],
  },
  {
    id: 16,
    question: "Quanto tempo você consegue dedicar por dia para seus cuidados?",
    type: 'text',
    options: [
      { id: 1, text: "30+ minutos", score: 4, icon: "⏰" },
      { id: 2, text: "15-30 minutos", score: 3, icon: "🕐" },
      { id: 3, text: "5-15 minutos", score: 2, icon: "⚡" },
      { id: 4, text: "Menos de 5 minutos", score: 1, icon: "🏃" },
    ],
  },
  {
    id: 17,
    question: "Você está disposto a investir em produtos que realmente funcionem?",
    type: 'text',
    options: [
      { id: 1, text: "Sim, sem problemas", score: 4, icon: "💰" },
      { id: 2, text: "Um pouco", score: 3, icon: "💵" },
      { id: 3, text: "Prefiro opções baratas", score: 2, icon: "🏷️" },
      { id: 4, text: "Não quero gastar", score: 1, icon: "❌" },
    ],
  },
  {
    id: 12,
    question: "Como você considera sua experiência em encontros?",
    type: 'text',
    options: [
      { id: 1, text: "Muito boa, sem problemas", score: 4, icon: "❤️" },
      { id: 2, text: "Razoável", score: 3, icon: "👍" },
      { id: 3, text: "Difícil às vezes", score: 2, icon: "😕" },
      { id: 4, text: "Muito difícil", score: 1, icon: "💔" },
      { id: 5, text: "Sou comprometido(a)", score: 4, icon: "😊" },
    ],
  },
  {
    id: 19,
    question: "Você está disposto a seguir um plano personalizado para você?",
    type: 'text',
    options: [
      { id: 1, text: "100% comprometido", score: 4, icon: "🔥" },
      { id: 2, text: "Bastante comprometido", score: 3, icon: "💯" },
      { id: 3, text: "Vou tentar", score: 2, icon: "🤞" },
      { id: 4, text: "Ainda não sei", score: 1, icon: "🤷" },
    ],
  },
];

// =====================================================
// MENSAGENS DE TRANSIÇÃO
// =====================================================
export const transitionMessages: TransitionMessage[] = [
  {
    icon: "🧬",
    title: "Analisando suas respostas...",
    subtitle: "Processando dados faciais",
    fact: "Estudos mostram que pessoas com boa simetria facial são percebidas como mais confiáveis e atraentes.",
  },
  {
    icon: "📊",
    title: "89%",
    subtitle: "dos nossos usuários",
    highlightText: "se sentem mais atraentes e confiantes",
    fact: "após 28 dias seguindo seu plano personalizado",
    statText: "*Baseado em feedback de 105.439 usuários Maxxing",
  },
  {
    icon: "💇",
    title: "Um bom corte de cabelo pode adicionar 2-3 pontos na sua atratividade.",
    subtitle: "",
    fact: "Mas a maioria das pessoas não sabe qual estilo combina melhor com seu rosto.",
  },
  {
    icon: "📈",
    title: "Calculando seu potencial...",
    subtitle: "Baseado em suas respostas e análise facial",
    fact: "A proporção áurea (1.618) é encontrada em rostos considerados universalmente atraentes.",
  },
];

// =====================================================
// SLIDES DE INTRODUÇÃO
// =====================================================
export const introSlides = [
  {
    id: 1,
    type: 'hero',
    title: "Escaneie seu rosto com IA",
    subtitle: "Descubra o que está te limitando e como você se compara aos outros",
    image: "/images/face-scan.gif",
  },
  {
    id: 2,
    type: 'comparison',
    beforeTitle: "Antes do Maxxing",
    beforePoints: [
      "Se sente indesejado no dating",
      "Desajeitado em situações sociais",
      "Sempre tem que dar o primeiro passo",
      "Inseguro com a aparência",
      "Medo de rejeição",
    ],
    afterTitle: "Depois do Maxxing",
    afterPoints: [
      "Se sente atraente e confiante",
      "Alta autoestima",
      "Mulheres te abordam primeiro",
      "Confiante em qualquer situação",
      "Vida social ativa",
    ],
  },
  {
    id: 3,
    type: 'mission',
    badge: "NOSSA MISSÃO",
    title: "Ajudar pessoas como você",
    highlightText: "a se tornar o mais atraente possível,",
    subtitle: "tanto física quanto mentalmente",
  },
  {
    id: 4,
    type: 'testimonial',
    rating: 5,
    title: "Não sabia que podia ficar tão bem...",
    text: "O escaneamento facial me fez perceber o que estava me prejudicando. O plano de glow-up me disse o que corrigir e como fazer. E honestamente, funcionou melhor do que eu esperava.",
    author: "Lucas, 23",
    beforeImage: "/images/testimonial-before.jpg",
    afterImage: "/images/testimonial-after.jpg",
    progress: "8 semanas de progresso",
  },
];

// =====================================================
// CATEGORIAS DE SCORE
// =====================================================
export const scoreCategories: ScoreCategory[] = [
  {
    min: 0,
    max: 30,
    title: "Precisa de Trabalho",
    subtitle: "Você tem muito potencial não explorado",
    description: "Sua análise indica várias áreas que podem ser significativamente melhoradas. Com o plano certo de skincare, grooming e exercícios faciais, você pode aumentar sua pontuação em até 30+ pontos. O importante é começar agora.",
    color: "#FF4D4D",
  },
  {
    min: 31,
    max: 50,
    title: "Abaixo da Média",
    subtitle: "Bom potencial de melhoria",
    description: "Você está abaixo da média, mas isso significa que há muito espaço para crescimento. Focando em áreas-chave como definição facial, cuidados com a pele e postura, você pode subir para a categoria 'Acima da Média' em poucas semanas.",
    color: "#FF6B35",
  },
  {
    min: 51,
    max: 65,
    title: "Na Média",
    subtitle: "Você está no caminho certo",
    description: "Você está na média da população. Com ajustes estratégicos no seu grooming, estilo e rotina de cuidados, você pode se destacar e entrar no top 30% de atratividade.",
    color: "#FFB347",
  },
  {
    min: 66,
    max: 79,
    title: "Acima da Média",
    subtitle: "Você já se destaca",
    description: "Parabéns! Você está acima da média. Pequenos refinamentos podem te levar para o próximo nível. Foque em otimizar seus pontos fortes e minimizar pontos fracos.",
    color: "#7ED321",
  },
  {
    min: 80,
    max: 89,
    title: "Muito Atraente",
    subtitle: "Top 15% da população",
    description: "Excelente! Você está entre os mais atraentes. Sua estrutura facial e características são bastante harmoniosas. Continue mantendo sua rotina e faça pequenos ajustes para maximizar ainda mais.",
    color: "#4A90D9",
  },
  {
    min: 90,
    max: 100,
    title: "Extremamente Atraente",
    subtitle: "Top 5% - Nível modelo",
    description: "Impressionante! Você possui características faciais excepcionais. Sua simetria e proporções estão no nível de modelos profissionais. Mantenha seus cuidados e você continuará no topo.",
    color: "#9B59B6",
  },
];

// =====================================================
// PLANO DE GLOW-UP SEMANAL
// =====================================================
export const glowUpPlan = {
  week1: [
    { day: 1, title: "Técnicas de Mewing" },
    { day: 2, title: "Massagem Facial" },
    { day: 3, title: "Queixo Melhor" },
    { day: 4, title: "Postura Ideal" },
    { day: 5, title: "Saúde da Pele" },
    { day: 6, title: "Mandíbula Definida" },
    { day: 7, title: "Dicas de Dieta" },
  ],
  week2: [
    { day: 1, title: "Ficar Ereto" },
    { day: 2, title: "Contato Visual" },
    { day: 3, title: "Pose de Poder" },
    { day: 4, title: "Falar Alto" },
    { day: 5, title: "Se Vestir Bem" },
    { day: 6, title: "Nota de Gratidão" },
    { day: 7, title: "Ação Ousada" },
  ],
  week3: [
    { day: 1, title: "Auditoria Guarda-roupa" },
    { day: 2, title: "Combinar Cores" },
    { day: 3, title: "Check de Fit" },
    { day: 4, title: "Peça Assinatura" },
    { day: 5, title: "Cuidados Sapato" },
    { day: 6, title: "Add Acessório" },
    { day: 7, title: "Plano de Look" },
  ],
};

// =====================================================
// ANÁLISE FACIAL DETALHADA
// =====================================================
export const facialAnalysisCategories = [
  { key: "symmetry", label: "Simetria Facial", icon: "⚖️" },
  { key: "jawline", label: "Linha da Mandíbula", icon: "💪" },
  { key: "skinQuality", label: "Qualidade da Pele", icon: "✨" },
  { key: "facialStructure", label: "Estrutura Facial", icon: "📐" },
  { key: "eyeArea", label: "Área dos Olhos", icon: "👁️" },
  { key: "hairline", label: "Linha do Cabelo", icon: "💇" },
  { key: "noseShape", label: "Formato do Nariz", icon: "👃" },
  { key: "lips", label: "Lábios", icon: "👄" },
];
