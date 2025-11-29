import type { QuizQuestion, TransitionMessage, ScoreCategory } from './quizData';

// =====================================================
// PERGUNTAS DO QUIZ FEMININO - 100% EM PORTUGUÊS BRASILEIRO
// =====================================================
export const quizQuestionsFemale: QuizQuestion[] = [
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
    subtitle: "Fatores de beleza feminina variam por idade",
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
    subtitle: "Seja honesta para resultados precisos",
    type: 'text',
    options: [
      { id: 1, text: "Atlético/Fitness", score: 4, icon: "💪" },
      { id: 2, text: "Magra", score: 3, icon: "✨" },
      { id: 3, text: "Mediano/Curvilíneo", score: 3, icon: "👗" },
      { id: 4, text: "Acima do peso", score: 2, icon: "🌸" },
    ],
  },
  {
    id: 4,
    question: "Como você avalia a saúde da sua pele?",
    subtitle: "Considere textura, poros, manchas e luminosidade",
    type: 'text',
    options: [
      { id: 1, text: "Excelente, pele radiante e uniforme", score: 4, icon: "✨" },
      { id: 2, text: "Boa, poucos problemas", score: 3, icon: "👍" },
      { id: 3, text: "Regular, alguns problemas", score: 2, icon: "😐" },
      { id: 4, text: "Precisa melhorar bastante", score: 1, icon: "😕" },
    ],
  },
  {
    id: 5,
    question: "Como está o contorno do seu rosto?",
    subtitle: "Considere a definição das maçãs do rosto e linha do queixo",
    type: 'text',
    options: [
      { id: 1, text: "Bem definido e harmonioso", score: 4, icon: "💎" },
      { id: 2, text: "Moderadamente definido", score: 3, icon: "👍" },
      { id: 3, text: "Pouco definido", score: 2, icon: "😐" },
      { id: 4, text: "Sem definição visível", score: 1, icon: "🤷" },
    ],
  },
  {
    id: 6,
    question: "Qual é o estado atual do seu cabelo?",
    subtitle: "Considere brilho, volume e saúde",
    type: 'text',
    options: [
      { id: 1, text: "Saudável, brilhante e volumoso", score: 4, icon: "💇‍♀️" },
      { id: 2, text: "Bom, mas poderia melhorar", score: 3, icon: "✨" },
      { id: 3, text: "Opaco e sem vida", score: 2, icon: "😟" },
      { id: 4, text: "Muito danificado", score: 1, icon: "💔" },
    ],
  },
  {
    id: 7,
    question: "Você tem um corte/penteado que valoriza seu rosto?",
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
    question: "Como estão suas sobrancelhas?",
    subtitle: "Sobrancelhas bem feitas emolduram o rosto",
    type: 'text',
    options: [
      { id: 1, text: "Perfeitas, bem desenhadas", score: 4, icon: "✨" },
      { id: 2, text: "Boas, faço manutenção regular", score: 3, icon: "👍" },
      { id: 3, text: "Precisam de mais cuidado", score: 2, icon: "😕" },
      { id: 4, text: "Totalmente negligenciadas", score: 1, icon: "🤷‍♀️" },
    ],
  },
  {
    id: 9,
    question: "Você tem uma rotina de skincare?",
    subtitle: "Limpeza, hidratação e proteção solar",
    type: 'text',
    options: [
      { id: 1, text: "Sim, rotina completa diária", score: 4, icon: "🧴" },
      { id: 2, text: "Sim, mas básica", score: 3, icon: "👍" },
      { id: 3, text: "Às vezes", score: 2, icon: "🔄" },
      { id: 4, text: "Não tenho rotina", score: 1, icon: "❌" },
    ],
  },
  {
    id: 10,
    question: "Você usa proteção solar diariamente?",
    subtitle: "Proteção solar é essencial para a saúde da pele",
    type: 'text',
    options: [
      { id: 1, text: "Sim, todos os dias", score: 4, icon: "☀️" },
      { id: 2, text: "Na maioria dos dias", score: 3, icon: "🌤️" },
      { id: 3, text: "Apenas quando vou à praia", score: 2, icon: "🏖️" },
      { id: 4, text: "Nunca ou raramente", score: 1, icon: "❌" },
    ],
  },
  {
    id: 11,
    question: "Como você se sente em relação à sua aparência?",
    type: 'text',
    options: [
      { id: 1, text: "Muito confiante", score: 4, icon: "😎" },
      { id: 2, text: "Confiante na maioria das vezes", score: 3, icon: "🙂" },
      { id: 3, text: "Insegura às vezes", score: 2, icon: "😕" },
      { id: 4, text: "Muito insegura", score: 1, icon: "😔" },
    ],
  },
  {
    id: 12,
    question: "Você sabe fazer uma maquiagem que valorize seus traços?",
    type: 'text',
    options: [
      { id: 1, text: "Sim, domino várias técnicas", score: 4, icon: "💄" },
      { id: 2, text: "Sei o básico", score: 3, icon: "👍" },
      { id: 3, text: "Tenho dificuldade", score: 2, icon: "😕" },
      { id: 4, text: "Não sei nada", score: 1, icon: "🤷‍♀️" },
    ],
  },
  {
    id: 13,
    question: "Você recebe elogios sobre sua aparência?",
    type: 'text',
    options: [
      { id: 1, text: "Frequentemente", score: 4, icon: "🌟" },
      { id: 2, text: "Às vezes", score: 3, icon: "😊" },
      { id: 3, text: "Raramente", score: 2, icon: "🤷‍♀️" },
      { id: 4, text: "Quase nunca", score: 1, icon: "😔" },
    ],
  },
  {
    id: 14,
    question: "Como é sua vida social?",
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
    question: "Qual é seu maior objetivo com o glow-up?",
    type: 'text',
    options: [
      { id: 1, text: "Aumentar a autoconfiança", score: 4, icon: "💪" },
      { id: 2, text: "Me sentir mais bonita", score: 4, icon: "✨" },
      { id: 3, text: "Melhorar nos Encontros", score: 4, icon: "❤️" },
      { id: 4, text: "Melhorar na carreira", score: 4, icon: "💼" },
    ],
  },
  {
    id: 16,
    question: "Quanto tempo você pode dedicar por dia para cuidados pessoais?",
    type: 'text',
    options: [
      { id: 1, text: "30+ minutos", score: 4, icon: "⏰" },
      { id: 2, text: "15-30 minutos", score: 3, icon: "🕐" },
      { id: 3, text: "5-15 minutos", score: 2, icon: "⚡" },
      { id: 4, text: "Menos de 5 minutos", score: 1, icon: "🏃‍♀️" },
    ],
  },
  {
    id: 17,
    question: "Você está disposta a investir em produtos de beleza e skincare?",
    type: 'text',
    options: [
      { id: 1, text: "Sim, sem problemas", score: 4, icon: "💰" },
      { id: 2, text: "Um pouco", score: 3, icon: "💵" },
      { id: 3, text: "Prefiro opções acessíveis", score: 2, icon: "🏷️" },
      { id: 4, text: "Não quero gastar", score: 1, icon: "❌" },
    ],
  },
  {
    id: 18,
    question: "Você está comprometida a seguir um plano de cuidados?",
    type: 'text',
    options: [
      { id: 1, text: "100% comprometida", score: 4, icon: "🔥" },
      { id: 2, text: "Bastante comprometida", score: 3, icon: "💯" },
      { id: 3, text: "Vou tentar", score: 2, icon: "🤞" },
      { id: 4, text: "Ainda não sei", score: 1, icon: "🤷‍♀️" },
    ],
  },
];

// =====================================================
// MENSAGENS DE TRANSIÇÃO FEMININAS
// =====================================================
export const transitionMessagesFemale: TransitionMessage[] = [
  {
    icon: "🧬",
    title: "Analisando suas respostas...",
    subtitle: "Processando sua harmonia facial feminina",
    fact: "Estudos mostram que proporções faciais harmoniosas são universalmente percebidas como mais atraentes.",
  },
  {
    icon: "📊",
    title: "91%",
    subtitle: "das nossas usuárias",
    highlightText: "se sentem mais bonitas e confiantes",
    fact: "após 28 dias seguindo seu plano personalizado",
    statText: "*Baseado em feedback de 78.432 usuárias Maxxing",
  },
  {
    icon: "💇‍♀️",
    title: "Um bom corte de cabelo pode transformar completamente sua aparência.",
    subtitle: "",
    fact: "Mas a maioria das mulheres não sabe qual estilo valoriza melhor seus traços.",
  },
  {
    icon: "📈",
    title: "Calculando seu potencial de feminilidade...",
    subtitle: "Baseado em suas respostas e análise facial",
    fact: "A harmonia entre seus traços é mais importante que traços isolados 'perfeitos'.",
  },
];

// =====================================================
// CATEGORIAS DE SCORE FEMININO
// =====================================================
export const scoreCategoriesFemale: ScoreCategory[] = [
  {
    min: 0,
    max: 30,
    title: "Potencial a Explorar",
    subtitle: "Você tem muito potencial escondido",
    description: "Sua análise indica várias áreas que podem ser significativamente aprimoradas. Com o plano certo de skincare, cuidados com o cabelo e técnicas de valorização dos seus traços, você pode aumentar sua pontuação em até 30+ pontos.",
    color: "#FF4D4D",
  },
  {
    min: 31,
    max: 50,
    title: "Em Desenvolvimento",
    subtitle: "Grande potencial de melhoria",
    description: "Você está desenvolvendo sua beleza, mas há muito espaço para crescimento. Focando em cuidados com a pele, cabelo e técnicas de realce facial, você pode subir rapidamente na escala de beleza.",
    color: "#FF6B35",
  },
  {
    min: 51,
    max: 65,
    title: "Na Média",
    subtitle: "Você está no caminho certo",
    description: "Você está na média. Com ajustes estratégicos nos seus cuidados de beleza e valorização dos seus traços femininos, você pode se destacar e entrar no top 30%.",
    color: "#FFB347",
  },
  {
    min: 66,
    max: 79,
    title: "Acima da Média",
    subtitle: "Você já se destaca",
    description: "Parabéns! Você está acima da média. Pequenos refinamentos podem te levar para o próximo nível. Foque em otimizar seus pontos fortes e realçar sua feminilidade natural.",
    color: "#7ED321",
  },
  {
    min: 80,
    max: 89,
    title: "Muito Atraente",
    subtitle: "Top 15% das mulheres",
    description: "Excelente! Você está entre as mais atraentes. Sua estrutura facial e características são muito harmoniosas. Continue mantendo sua rotina de cuidados e faça pequenos ajustes para maximizar ainda mais.",
    color: "#4A90D9",
  },
  {
    min: 90,
    max: 100,
    title: "Beleza Excepcional",
    subtitle: "Top 5% - Nível modelo",
    description: "Impressionante! Você possui características faciais excepcionais. Sua simetria e proporções estão no nível de modelos profissionais. Mantenha seus cuidados e você continuará no topo.",
    color: "#9B59B6",
  },
];

// =====================================================
// SLIDES DE INTRODUÇÃO FEMININOS
// =====================================================
export const introSlidesFemale = [
  {
    id: 1,
    type: 'hero',
    title: "Análise Facial Feminina com IA",
    subtitle: "Descubra seu potencial de beleza e como realçar seus traços únicos",
    image: "/images/face-scan.gif",
  },
  {
    id: 2,
    type: 'comparison',
    beforeTitle: "Antes do Glow-up",
    beforePoints: [
      "Se sente invisível ou comum",
      "Não sabe como se valorizar",
      "Maquiagem que não combina",
      "Insegura com a aparência",
      "Skincare sem resultados",
    ],
    afterTitle: "Depois do Glow-up",
    afterPoints: [
      "Se sente bonita e radiante",
      "Sabe exatamente o que valoriza seu rosto",
      "Maquiagem perfeita para seus traços",
      "Confiante em qualquer situação",
      "Pele saudável e luminosa",
    ],
  },
  {
    id: 3,
    type: 'mission',
    badge: "NOSSA MISSÃO",
    title: "Ajudar mulheres como você",
    highlightText: "a descobrir e realçar sua beleza natural,",
    subtitle: "revelando todo seu potencial feminino",
  },
  {
    id: 4,
    type: 'testimonial',
    rating: 5,
    title: "Finalmente me sinto bonita...",
    text: "A análise facial me mostrou exatamente o que estava me prejudicando. O plano personalizado me ensinou como realçar meus pontos fortes. Em poucas semanas, as pessoas começaram a perceber a diferença.",
    author: "Mariana, 26",
    beforeImage: "/images/testimonial-before-female.jpg",
    afterImage: "/images/testimonial-after-female.jpg",
    progress: "6 semanas de progresso",
  },
];

// =====================================================
// CATEGORIAS DE ANÁLISE FACIAL FEMININA
// =====================================================
export const facialAnalysisCategoriesFemale = [
  { key: "symmetry", label: "Simetria Facial", icon: "⚖️" },
  { key: "skinQuality", label: "Qualidade da Pele", icon: "✨" },
  { key: "facialHarmony", label: "Harmonia Feminina", icon: "💎" },
  { key: "eyeArea", label: "Área dos Olhos", icon: "👁️" },
  { key: "cheekbones", label: "Maçãs do Rosto", icon: "🌸" },
  { key: "lips", label: "Lábios", icon: "💋" },
  { key: "noseShape", label: "Formato do Nariz", icon: "👃" },
  { key: "hairline", label: "Linha do Cabelo", icon: "💇‍♀️" },
];

