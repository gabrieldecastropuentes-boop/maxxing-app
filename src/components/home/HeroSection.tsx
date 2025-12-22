import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';
import { RatingBadge } from './RatingBadge';
import { AuthorityBadge } from './AuthorityBadge';

export function HeroSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <section ref={ref} className="relative section-container pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="rounded-[28px] sm:rounded-[40px] border border-white/10 bg-gradient-to-b from-[#191112] via-[#110D10] to-[#080708] p-5 sm:p-8 md:p-12 shadow-[0_35px_120px_rgba(0,0,0,0.55)] backdrop-blur-none sm:backdrop-blur-xl space-y-6 sm:space-y-8"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/70">
            Inteligência Facial • 2025
          </p>
          <AuthorityBadge />
        </div>
        <h1 className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white max-w-[90%] sm:max-w-[500px] mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Análise Facial Completa em 3 Minutos{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] via-[#FF4D4D] to-[#FF8C42]">(Grátis)</span>
        </h1>
        
        {/* Credibilidade Científica */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60 max-w-2xl mx-auto px-4">
          <svg className="w-4 h-4 text-white/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className="text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Análise facial por IA combinada com dicas de autocuidado baseadas em estudos científicos
          </span>
        </div>
        
        {/* Rating Badge */}
        <RatingBadge />
        
        <p className="text-sm sm:text-base md:text-xl text-white/70 max-w-2xl leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Análise completa por IA: grátis e sem compromisso. Veja como pequenas alterações podem elevar sua atratividade.
        </p>
        
        {/* Social Proof Inline */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
          <span className="text-green-400">⚡</span>
          <span><strong className="text-white">2.847</strong> pessoas fizeram hoje</span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 sm:gap-4 text-left">
          {[
            { value: '2.3M+', label: 'rostos analisados com IA proprietária' },
            { value: '4.9/5', label: 'satisfação média dos membros' },
            { value: '12 semanas', label: 'tempo médio para subir +18 pontos' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/3 px-4 sm:px-5 py-4 flex flex-col min-w-[140px] flex-1 sm:flex-none"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm sm:text-base text-white/60" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-3 items-center">
            <a
              href="/quiz"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if ((window as any).gtag) {
                    (window as any).gtag('event', 'hero_cta_click', { event_category: 'CTA', event_label: 'Hero Section' });
                  }
                  if ((window as any).fbq) {
                    (window as any).fbq('track', 'Lead', { content_name: 'Hero CTA Click' });
                  }
                }
              }}
              className={cn(
                'btn-primary btn-full-mobile animate-pulse-glow',
                'text-base sm:text-lg md:text-xl',
                'min-h-[56px] py-4 px-6 sm:px-8',
                'w-full sm:w-auto',
                'whitespace-nowrap',
                'group/cta'
              )}
              style={{
                background: 'linear-gradient(135deg, #FF3D3D 0%, #FF6B35 50%, #FF3D3D 100%)',
                backgroundSize: '200% 200%',
              }}
            >
              Comece Sua Avaliação Gratuita
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            {/* Selo de Segurança */}
            <div className="inline-flex items-baseline justify-center gap-2 text-[10px] sm:text-xs text-white/70 whitespace-nowrap leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="leading-none">Seus dados são protegidos e nunca compartilhados</span>
              <span className="text-white/40 leading-none">•</span>
              <a 
                href="#privacy" 
                className="text-white/50 hover:text-white/80 underline decoration-[1px] underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors leading-none"
                onClick={(e) => {
                  e.stopPropagation();
                  // Aqui você pode adicionar navegação para política de privacidade
                }}
              >
                Política de Privacidade
              </a>
            </div>
          </div>
          
          {/* Risk Free Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400">
              ✅ 100% Gratuito
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
              💳 Sem Cartão
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
              ⚡ 3 Minutos
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

