import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

export function HaircutValueBlock() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="section-container py-10 sm:py-14 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-[20px] sm:rounded-[28px] lg:rounded-[36px] border border-white/10 bg-gradient-to-br from-[#1A1215] via-[#0F0B0D] to-[#080608] p-5 sm:p-6 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
          {/* Imagem - Mobile first (aparece primeiro no mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="w-full lg:w-1/2 relative order-1 lg:order-1"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
              {/* Glow effect - reduzido para mobile */}
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-[#FF4D4D]/30 via-[#FF6B35]/30 to-[#FF4D4D]/30 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-40" />
              
              {/* Container da imagem */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10">
                <img
                  src="/media/cortecabelo.jpg"
                  alt="Exemplo de como um corte de cabelo adequado transforma a harmonia do rosto"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width="480"
                  height="640"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/media/scan_male.jpg';
                  }}
                />
              </div>
            </div>
            
            {/* Badge flutuante - posicionamento mobile-friendly */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute -bottom-3 right-2 sm:bottom-3 sm:right-3 bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-[0_8px_24px_rgba(255,77,77,0.35)] text-xs sm:text-sm font-bold"
            >
              +2-3 pontos
            </motion.div>
          </motion.div>

          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="w-full lg:w-1/2 space-y-4 sm:space-y-5 order-2 lg:order-2"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-base sm:text-lg">💇</span>
              <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider">
                Valor Imediato
              </span>
            </div>

            {/* Headline - tamanhos mobile otimizados */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-snug">
              Um bom corte de cabelo pode adicionar{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] via-[#FF4D4D] to-[#FF8C42]">
                2-3 pontos
              </span>{' '}
              na sua atratividade.
            </h2>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              A verdade é simples: seu corte de cabelo pode melhorar — ou destruir — sua aparência.
              <span className="block mt-2 text-white/60 text-xs sm:text-sm">
                90% das pessoas usam um corte incompatível com o formato do rosto… e nem percebem que estão desperdiçando potencial todos os dias.
              </span>
            </p>

            {/* Benefícios - grid compacto para mobile */}
            <div className="space-y-2 sm:space-y-3">
              {[
                'Análise do formato do seu rosto',
                'Sugestões personalizadas de corte',
                'Guia de comunicação com o barbeiro',
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 15 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-white/80">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA - full width no mobile */}
            <motion.a
              href="/quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.35 }}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(30);
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 active:scale-[0.98] transition-all duration-200 text-sm"
            >
              Descobrir meu corte ideal
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

