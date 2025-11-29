/**
 * ═══════════════════════════════════════════════════════════════
 * CONVERSION UTILITIES - Componentes de Alta Conversão
 * Adiciona elementos complementares sem alterar layout
 * ═══════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import { cn } from './utils';

// ═══════════════════════════════════════════════════════════════
// BADGES DE CREDIBILIDADE
// ═══════════════════════════════════════════════════════════════

export function AIBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "bg-gradient-to-r from-primary/20 to-accent/20",
        "border border-primary/30 backdrop-blur-sm",
        "text-[10px] sm:text-xs font-medium text-primary",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      Recomendado por IA Avançada
    </motion.div>
  );
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
        "border border-yellow-500/30",
        "text-[10px] sm:text-xs font-semibold text-yellow-400",
        className
      )}
    >
      ⭐ Análise Premium
    </motion.div>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded",
        "bg-green-500/10 border border-green-500/20",
        "text-[10px] font-medium text-green-400",
        className
      )}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Verificado
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MICROCOPY PARA CTAs
// ═══════════════════════════════════════════════════════════════

export function CTAMicrocopy({ variant = 'speed', className }: { variant?: 'speed' | 'guarantee' | 'security' | 'social'; className?: string }) {
  const copies = {
    speed: 'Resultados personalizados em menos de 30 segundos',
    guarantee: '100% garantia de satisfação ou seu dinheiro de volta',
    security: '🔒 Seus dados estão protegidos e seguros',
    social: '+2.3M de análises realizadas com sucesso',
  };

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={cn("text-[11px] sm:text-xs text-white/50 text-center mt-2", className)}
    >
      {copies[variant]}
    </motion.p>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROVA SOCIAL DISCRETA
// ═══════════════════════════════════════════════════════════════

export function SocialProofMini({ count = 143, className }: { count?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-center gap-2",
        "text-[11px] sm:text-xs text-white/60",
        className
      )}
    >
      <div className="flex -space-x-1.5">
        {['😊', '🔥', '💪'].map((emoji, i) => (
          <span
            key={i}
            className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-white/10 flex items-center justify-center text-[10px]"
          >
            {emoji}
          </span>
        ))}
      </div>
      <span>
        <strong className="text-white/80">{count} pessoas</strong> compraram na última hora
      </span>
    </motion.div>
  );
}

export function LiveViewers({ count = 47, className }: { count?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "bg-red-500/10 border border-red-500/20",
        "text-[10px] sm:text-xs font-medium text-red-400",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      {count} pessoas vendo agora
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD DE SCORE FACIAL
// ═══════════════════════════════════════════════════════════════

export function ScoreCard({ score, label = 'Score facial estimado', className }: { score: number; label?: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2.5 rounded-xl",
        "bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d]",
        "border border-white/10",
        className
      )}
    >
      <div className="relative w-10 h-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle 
            cx="18" cy="18" r="16" 
            fill="none" 
            stroke="url(#scoreGrad)" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${score} 100`}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#FF8C42" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {score}
        </span>
      </div>
      <div>
        <p className="text-[10px] text-white/50 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-white">Análise por IA</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SELO DE PLANO INDIVIDUAL
// ═══════════════════════════════════════════════════════════════

export function PersonalizedPlanBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
        "border border-purple-500/20",
        className
      )}
    >
      <span className="text-sm">🎯</span>
      <div>
        <p className="text-[10px] text-purple-300/80 uppercase tracking-wider">Exclusivo</p>
        <p className="text-xs font-medium text-white">Plano gerado por algoritmo exclusivo</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BENEFÍCIO EXTRA
// ═══════════════════════════════════════════════════════════════

export function BenefitHighlight({ icon = '✨', text, className }: { icon?: string; text: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 text-[11px] sm:text-xs text-white/70",
        className
      )}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOTÃO DE VOLTAR AO TOPO (MOBILE)
// ═══════════════════════════════════════════════════════════════

export function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 right-4 z-40",
        "w-10 h-10 rounded-full",
        "bg-white/10 backdrop-blur-sm border border-white/20",
        "flex items-center justify-center",
        "text-white/70 hover:text-white hover:bg-white/20",
        "transition-colors duration-200",
        "min-h-[44px] min-w-[44px]" // Hitbox mínimo de 44px
      )}
      aria-label="Voltar ao topo"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
// VARIAÇÕES DE CTA (para testes A/B)
// ═══════════════════════════════════════════════════════════════

export const CTA_VARIANTS = {
  results: [
    'Obter meus resultados finais',
    'Ver meus resultados agora',
    'Desbloquear minha análise completa',
  ],
  skincare: [
    'Obter minha rotina de skincare',
    'Desbloquear minha rotina exclusiva',
    'Receber meu plano de skincare',
  ],
  plan: [
    'Receber meu plano personalizado agora',
    'Obter meu plano individual',
    'Desbloquear meu programa exclusivo',
  ],
  unlock: [
    'Desbloquear tudo agora',
    'Quero meu plano Looksmaxxer',
    'Começar minha transformação',
  ],
};

export function getRandomCTA(type: keyof typeof CTA_VARIANTS): string {
  const variants = CTA_VARIANTS[type];
  // Usar mesmo índice baseado em sessão para consistência
  if (typeof sessionStorage !== 'undefined') {
    const key = `cta_variant_${type}`;
    let index = sessionStorage.getItem(key);
    if (index === null) {
      index = String(Math.floor(Math.random() * variants.length));
      sessionStorage.setItem(key, index);
    }
    return variants[parseInt(index)] || variants[0];
  }
  return variants[0];
}

// ═══════════════════════════════════════════════════════════════
// MICRO ANIMAÇÕES PARA CTAs (0.15-0.25s)
// ═══════════════════════════════════════════════════════════════

export const buttonAnimations = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
  transition: { duration: 0.15, ease: 'easeOut' },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

