import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

export function SocialProofSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-container py-10 sm:py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] border border-white/10 bg-gradient-to-b from-[#141114] to-[#080708] p-5 sm:p-6 lg:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.5)] space-y-6 sm:space-y-8"
      >
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary mb-2"
          >
            Transformações Reais
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight"
          >
            Resultados que falam por si
          </motion.h2>
        </div>

        {/* Before/After Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-5 lg:gap-8"
        >
          {/* Before/After Images */}
          <div className="w-full lg:flex-1 flex items-center gap-4 sm:gap-3 grid grid-cols-2">
            {/* Before */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img
                src="/media/social_proof_before.png"
                alt="Foto de antes da transformação - Score facial 52"
                className="w-full h-full object-cover aspect-[3/4]"
                loading="lazy"
                width="400"
                height="533"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/media/scan_male.jpg';
                }}
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-red-500/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                Antes
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 sm:p-4 min-h-[60px] flex items-end">
                <p className="text-white/60 text-[10px] sm:text-sm">Score: 52</p>
              </div>
            </div>

            {/* After */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-primary/30 bg-black shadow-[0_0_20px_rgba(255,77,77,0.15)]">
              <img
                src="/media/social_proof_after.png"
                alt="Foto de depois da transformação - Score facial 78, aumento de 26 pontos"
                className="w-full h-full object-cover aspect-[3/4]"
                loading="lazy"
                width="400"
                height="533"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/media/scan_male.jpg';
                }}
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-green-500/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                Depois
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 sm:p-4 min-h-[60px] flex items-end">
                <p className="text-green-400 text-[10px] sm:text-sm font-semibold">Score: 78 (+26)</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="w-full lg:flex-1 flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-5">
              {/* Quote */}
              <div className="relative">
                <svg className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 text-primary/30" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
                </svg>
                <p className="text-base sm:text-lg lg:text-xl text-white font-medium leading-relaxed pl-5 sm:pl-6">
                  "Passei de invisível para disputado. Em 9 semanas, minha vida social mudou completamente."
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="/media/testimonial_avatar.jpg"
                  alt="Avatar de Felipe Andrade - Depoimento de transformação"
                  className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/30 overflow-hidden"
                  loading="lazy"
                  width="200"
                  height="200"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/media/scan_male.jpg';
                  }}
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Felipe Andrade</p>
                  <p className="text-xs sm:text-sm text-white/60">26 anos • São Paulo</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results - grid compacto */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: '+26', label: 'pontos' },
                  { value: '9', label: 'semanas' },
                  { value: '3x', label: 'mais matches' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <p className="text-lg sm:text-xl font-bold text-primary">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 text-center"
        >
          {[
            { value: '+24 pts', label: 'evolução em 90 dias', icon: '📈' },
            { value: '82%', label: 'mais oportunidades', icon: '🎯' },
            { value: '74%', label: 'confiança imediata', icon: '💪' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 + index * 0.08, duration: 0.35 }}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] py-3 sm:py-4 px-2 sm:px-4 active:bg-white/[0.05] transition-colors"
            >
              <span className="text-lg sm:text-2xl mb-1 block">{item.icon}</span>
              <p className="text-base sm:text-xl font-bold text-white">{item.value}</p>
              <p className="text-[9px] sm:text-xs text-white/60 mt-0.5 leading-tight">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.35 }}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <a 
            href="/quiz" 
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(30);
              }
            }}
            className="btn-primary animate-pulse-glow w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 min-h-[56px] py-4 sm:py-5 whitespace-nowrap"
          >
            Quero Minha Transformação
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="text-[10px] sm:text-xs text-white/60 text-center">
            Testado por +2M de pessoas • IA 100% gratuita
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
