import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';

export function FinalCTASection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-container pb-10 sm:pb-14 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-white/10 bg-gradient-to-b from-[#1B0F12] via-[#0E090B] to-[#050305] p-6 sm:p-8 lg:p-14 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        {/* Background glow effects - otimizados para mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-[#FF4D4D]/15 rounded-full blur-[40px] sm:blur-[80px] opacity-30 sm:opacity-100 hidden sm:block"
            style={{ 
              transform: 'translateZ(0)',
              willChange: 'opacity',
              backfaceVisibility: 'hidden'
            }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-[#FF6B35]/15 rounded-full blur-[40px] sm:blur-[80px] opacity-30 sm:opacity-100 hidden sm:block"
            style={{ 
              transform: 'translateZ(0)',
              willChange: 'opacity',
              backfaceVisibility: 'hidden'
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/30 mb-4 sm:mb-6"
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider">
              Pronto para começar?
            </span>
          </motion.div>

          {/* Headline - tamanhos otimizados para mobile */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-snug max-w-3xl mx-auto"
          >
            A Geração Maxxing está{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] via-[#FF4D4D] to-[#9B59B6] animate-gradient-x">
              assumindo o controle
            </span>{' '}
            da própria narrativa.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/70 max-w-xl mx-auto leading-relaxed"
          >
            Seu relatório gratuito leva menos de 3 minutos. Se fizer sentido, o blueprint completo é liberado ao final.
          </motion.p>

          {/* CTA Button - full width em mobile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-6 sm:mt-8 space-y-3"
          >
            <a
              href="/quiz"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              className={cn(
                'btn-cta-vibrant w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl',
                'shadow-[0_0_40px_rgba(255,77,77,0.4),0_0_70px_rgba(255,107,53,0.25)]',
                'active:scale-[0.98] transition-all duration-200',
                'min-h-[56px] whitespace-nowrap'
              )}
            >
              Ver Minha Nota Grátis Agora
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <p className="text-[10px] sm:text-xs text-white/60">
              Sem custo • Sem cadastro • Resultado em segundos
            </p>
          </motion.div>

          {/* Trust indicators - layout mobile compacto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
          >
            {[
              { icon: '🔒', text: 'Dados seguros' },
              { icon: '⚡', text: 'Resultado rápido' },
              { icon: '🎯', text: 'IA precisa' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-xs">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.35 }}
            className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-white/40 max-w-sm mx-auto"
          >
            Sem spam. Sem exposição. Uso exclusivo para entregar sua análise personalizada.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
