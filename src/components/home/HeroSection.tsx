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
          Descubra seu Score Facial em 3 Minutos{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] via-[#FF4D4D] to-[#FF8C42]">(Grátis)</span>
        </h1>
        
        {/* Rating Badge */}
        <RatingBadge />
        
        <p className="text-sm sm:text-base md:text-xl text-white/70 max-w-2xl leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Análise completa baseada em IA sem custo e sem compromisso. Descubra como pequenas alterações podem elevar seu score de atratividade.
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
              'whitespace-nowrap'
            )}
          >
            Fazer Teste Grátis Agora
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          
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

