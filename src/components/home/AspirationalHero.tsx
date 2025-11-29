import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';

export function AspirationalHero() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="section-container py-8 sm:py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F0A0A] via-[#141010] to-[#0A0808] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
      >
        {/* Background gradient overlay - vermelho/laranja */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
        
        {/* Subtle glow effect */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D4D]/10 rounded-full blur-[120px] pointer-events-none hidden sm:block" 
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-[100px] pointer-events-none hidden sm:block"
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />

        <div className="relative z-20 flex flex-col lg:flex-row items-center">
          {/* Image - Mobile first (top) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-full lg:w-1/2 relative order-1 lg:order-2"
            style={{ willChange: 'opacity' }}
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
              <img
                src="/media/social_proof_after.png"
                alt="Versão mais atraente de você"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                width="600"
                height="750"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/media/scan_male.jpg';
                }}
                style={{ 
                  contentVisibility: 'auto',
                  containIntrinsicSize: '600px 750px',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  willChange: 'opacity'
                }}
              />
              {/* Gradient overlay for seamless blend */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0F0A0A]/95 lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A0A] via-transparent to-transparent lg:hidden" />
              
              {/* Glow na borda da imagem */}
              <div className="absolute inset-0 border border-[#FF4D4D]/10 rounded-none" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 xl:p-16 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">
                Transformação Real
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6"
            >
              Torne-se sua versão{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] via-[#FF4D4D] to-[#FF8C42]">
                mais atraente
              </span>
              {' '}— por dentro e por fora.
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed mb-6 sm:mb-8 max-w-lg"
            >
              Nosso método combina{' '}
              <span className="text-white/90 font-medium">análise facial</span> +{' '}
              <span className="text-white/90 font-medium">recomendações práticas de looksmaxing</span>{' '}
              para elevar sua aparência física e sua mentalidade.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex gap-6 sm:gap-8 mb-6 sm:mb-8"
            >
              {[
                { value: '2.3M+', label: 'Análises' },
                { value: '+24pts', label: 'Média de evolução' },
                { value: '4.9★', label: 'Satisfação' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button - cores originais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <a
                href="/quiz"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(40);
                  }
                }}
                className={cn(
                  'group inline-flex items-center justify-center gap-2 sm:gap-3',
                  'w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5',
                  'text-base sm:text-lg font-bold text-white',
                  'bg-gradient-to-r from-[#FF4D4D] via-[#FF6B35] to-[#FF4D4D]',
                  'bg-[length:200%_200%] animate-gradient-x',
                  'rounded-xl sm:rounded-2xl',
                  'shadow-[0_0_40px_rgba(255,77,77,0.4),0_10px_30px_rgba(0,0,0,0.3)]',
                  'hover:shadow-[0_0_60px_rgba(255,77,77,0.5),0_15px_40px_rgba(0,0,0,0.4)]',
                  'active:scale-[0.98] transition-all duration-300',
                  'min-h-[56px] whitespace-nowrap'
                )}
              >
                Começar Agora
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>

            {/* Trust text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-4 text-[10px] sm:text-xs text-white/40"
            >
              100% gratuito • Resultado em minutos • Sem cadastro
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
