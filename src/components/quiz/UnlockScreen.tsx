import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { AnalysisResults } from './AnalyzingScreen';

interface UnlockScreenProps {
  results: AnalysisResults;
  onUnlock: () => void;
}

// Função para gerar um hash único baseado em string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Gerador de número pseudo-aleatório com seed
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Pool de categorias de análise (variadas)
const categoryPools = {
  facial: [
    { icon: '👤', label: 'Estrutura Facial' },
    { icon: '🦴', label: 'Definição Mandibular' },
    { icon: '👁️', label: 'Área dos Olhos' },
    { icon: '👃', label: 'Proporção Nasal' },
    { icon: '🧔', label: 'Terço Inferior' },
  ],
  harmony: [
    { icon: '✨', label: 'Simetria' },
    { icon: '⚖️', label: 'Harmonia Facial' },
    { icon: '📐', label: 'Proporções Áureas' },
    { icon: '🎯', label: 'Equilíbrio Facial' },
    { icon: '🔄', label: 'Simetria Bilateral' },
  ],
  style: [
    { icon: '💈', label: 'Potencial de Estilo' },
    { icon: '💇', label: 'Compatibilidade Capilar' },
    { icon: '👔', label: 'Presença Visual' },
    { icon: '🎨', label: 'Expressão Pessoal' },
    { icon: '✂️', label: 'Potencial de Grooming' },
  ],
};

// Pool de dicas de looksmaxing (variadas)
const tipsPool = [
  'Corte de cabelo ideal para seu rosto',
  'Rotina de skincare personalizada',
  'Dicas de mewing e postura',
  'Estilo de barba/sobrancelha',
  'Exercícios faciais específicos',
  'Guia de hidratação da pele',
  'Técnicas de jawline',
  'Cuidados com a área dos olhos',
  'Harmonização do formato facial',
  'Dicas de iluminação para fotos',
  'Rotina matinal otimizada',
  'Suplementação para pele',
];

// Pool de emojis para social proof
const emojiPools = [
  ['😊', '🔥', '💪'],
  ['🌟', '💯', '🎯'],
  ['✨', '🚀', '💎'],
  ['👑', '⭐', '🏆'],
  ['💪', '🙌', '✅'],
];

// Pool de números de análises
const analysisCountPool = ['2.3M+', '2.5M+', '2.8M+', '3.1M+', '2.7M+', '2.4M+'];

export function UnlockScreen({ results, onUnlock }: UnlockScreenProps) {
  const score = results.overallScore;
  
  // Gerar seed único por sessão/usuário
  const [userSeed] = useState(() => {
    // Tentar recuperar seed existente ou criar novo
    const storedSeed = typeof window !== 'undefined' 
      ? sessionStorage.getItem('userAnalysisSeed') 
      : null;
    
    if (storedSeed) {
      return parseInt(storedSeed, 10);
    }
    
    // Criar seed baseado em múltiplos fatores únicos
    const timestamp = Date.now();
    const randomPart = Math.random() * 1000000;
    const screenInfo = typeof window !== 'undefined' 
      ? `${window.screen.width}${window.screen.height}${window.screen.colorDepth}` 
      : '0';
    
    const seedString = `${timestamp}-${randomPart}-${screenInfo}-${navigator?.userAgent || ''}`;
    const newSeed = hashString(seedString);
    
    // Salvar para manter consistência na sessão
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userAnalysisSeed', newSeed.toString());
    }
    
    return newSeed;
  });

  // Gerar dados únicos baseados no seed
  const uniqueData = useMemo(() => {
    const random = seededRandom(userSeed);
    
    // Selecionar categorias únicas
    const facialIndex = Math.floor(random() * categoryPools.facial.length);
    const harmonyIndex = Math.floor(random() * categoryPools.harmony.length);
    const styleIndex = Math.floor(random() * categoryPools.style.length);
    
    // Gerar valores variados (baseados no score mas com variação)
    const variance1 = Math.floor(random() * 15) - 7; // -7 a +7
    const variance2 = Math.floor(random() * 15) - 7;
    const variance3 = Math.floor(random() * 15) - 7;
    
    const categories = [
      { 
        ...categoryPools.facial[facialIndex], 
        value: Math.min(Math.max(score + variance1, 25), 95) 
      },
      { 
        ...categoryPools.harmony[harmonyIndex], 
        value: Math.min(Math.max(score + variance2 - 5, 20), 90) 
      },
      { 
        ...categoryPools.style[styleIndex], 
        value: Math.min(Math.max(score + variance3 + 3, 30), 98) 
      },
    ];
    
    // Selecionar 4 dicas aleatórias
    const shuffledTips = [...tipsPool].sort(() => random() - 0.5);
    const selectedTips = shuffledTips.slice(0, 4);
    
    // Selecionar emojis
    const emojiSetIndex = Math.floor(random() * emojiPools.length);
    const emojis = emojiPools[emojiSetIndex];
    
    // Selecionar contagem de análises
    const analysisCountIndex = Math.floor(random() * analysisCountPool.length);
    const analysisCount = analysisCountPool[analysisCountIndex];
    
    return {
      categories,
      tips: selectedTips,
      emojis,
      analysisCount,
    };
  }, [userSeed, score]);

  return (
    <div className="relative flex flex-col items-center min-h-[100dvh] px-4 sm:px-6 py-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d0d0d] to-[#1a0800]" />
        
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-80 h-80 bg-primary/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/25 rounded-full blur-[150px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Análise Completa
            </span>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <div className={cn(
            "relative p-6 rounded-3xl",
            "bg-gradient-to-br from-[#1a1a1a]/90 to-[#0d0d0d]/90",
            "border border-white/10",
            "backdrop-blur-xl",
            "shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          )}>
            {/* Score Display */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Sua Pontuação</p>
                <div className="flex items-baseline gap-1">
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#FF6B35] to-accent"
                  >
                    {score}
                  </motion.span>
                  <span className="text-lg text-white/40">/100</span>
                </div>
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <motion.circle 
                    cx="18" cy="18" r="16" 
                    fill="none" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${score} 100`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${score} 100` }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF4D4D" />
                      <stop offset="100%" stopColor="#FF8C42" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white/70">{score}%</span>
                </div>
              </div>
            </div>

            {/* Analysis Categories - DADOS ÚNICOS POR USUÁRIO */}
            <div className="space-y-3">
              {uniqueData.categories.map((cat, i) => (
                <motion.div
                  key={`${cat.label}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm text-white/70">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.value}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white/50 w-8">{cat.value}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
            Sua análise facial está{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              pronta
            </span>
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Descubra seu potencial completo e receba um{' '}
            <span className="text-white/90 font-medium">plano exclusivo de looksmaxing</span>
          </p>
        </motion.div>

        {/* What You'll Get - Checklist - DICAS ÚNICAS POR USUÁRIO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
        >
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
            Seu plano incluirá:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {uniqueData.tips.map((tip, i) => (
              <motion.div
                key={`${tip}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-white/70">{tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50"
            />
            
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50);
                }
                onUnlock();
              }}
              className={cn(
                "relative w-full py-4 px-6",
                "bg-gradient-to-r from-primary via-[#FF6B35] to-accent",
                "hover:from-[#FF5252] hover:via-[#FF7B45] hover:to-[#FFB347]",
                "rounded-2xl",
                "text-white font-bold text-base",
                "shadow-[0_10px_40px_rgba(255,77,77,0.4)]",
                "active:scale-[0.98] transition-all duration-200",
                "flex items-center justify-center gap-3",
                "group overflow-hidden"
              )}
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
              />
              
              <span className="relative z-10">Ver Meu Plano Exclusivo</span>
              <svg 
                className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 flex items-center justify-center gap-4"
          >
            {[
              { icon: '🔒', text: 'Seguro' },
              { icon: '⚡', text: 'Instantâneo' },
              { icon: '🎯', text: 'Personalizado' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-sm">{item.icon}</span>
                <span className="text-[10px] text-white/40 font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          <p className="mt-3 text-[10px] text-white/30 text-center">
            Sem custo • Resultado em segundos
          </p>
        </motion.div>

        {/* Social Proof Mini - EMOJIS E CONTAGEM ÚNICOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <div className="flex -space-x-2">
            {uniqueData.emojis.map((emoji, i) => (
              <div 
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-sm"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/40">
            <span className="text-white/60 font-medium">{uniqueData.analysisCount}</span> análises realizadas
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
