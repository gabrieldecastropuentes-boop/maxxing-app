import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';
import { useState, useEffect } from 'react';

const steps = [
  {
    title: '1. Captura Inteligente',
    desc: 'Você envia duas selfies guiadas. Nosso scanner detecta até 68 pontos faciais.',
  },
  {
    title: '2. IA Proprietária',
    desc: 'Modelos cruzam seus dados com o banco Maxxing e calculam o potencial de evolução.',
  },
  {
    title: '3. Blueprint Entregue',
    desc: 'Receba recomendações priorizadas, protocolos e alertas do que está te segurando.',
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [activeGender, setActiveGender] = useState<'male' | 'female'>('male');

  // Auto-switch between male/female every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGender((prev) => (prev === 'male' ? 'female' : 'male'));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="section-container py-10 sm:py-14 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-10 items-stretch">
        {/* Left Side - Steps */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] border border-white/8 bg-gradient-to-b from-[#18121A] to-[#0A090C] p-5 sm:p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
            Como funciona
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
            IA que lê seu rosto como um analista elite.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed">
            Inspirado nas abordagens do findsecretapp e otimizado para o público brasileiro. Seu diagnóstico e
            plano são entregues em minutos.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-col md:block gap-6 md:gap-2.5 sm:gap-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -15 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
                className="flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/3 p-3 sm:p-4 active:bg-white/5 transition-colors"
              >
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-[10px] sm:text-xs text-white/65 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col gap-3">
            <a 
              href="/quiz" 
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(30);
                }
              }}
              className="btn-primary w-full text-sm sm:text-base min-h-[56px] py-4 sm:py-5 whitespace-nowrap"
            >
              Ver Minha Nota Agora
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-[10px] sm:text-xs text-white/60 text-center">
              Processo guiado por IA • Gratuito • Resultado em minutos
            </p>
          </div>
        </motion.div>

        {/* Right Side - Scanner Visual */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'relative rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] border border-white/10 bg-gradient-to-b from-[#1A1215] to-[#0A090C] p-4 sm:p-5',
            'shadow-[0_20px_60px_rgba(0,0,0,0.45)] w-full'
          )}
        >
          {/* Scanner Container */}
          <div className="relative">
            {/* Main Image with Scan Effect */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
              {/* Before/After Grid */}
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1 bg-black/50">
                {/* Before Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={activeGender === 'male' ? '/media/scan_male.jpg' : '/media/scan_female.jpg'}
                    alt="Análise facial - antes"
                    className="w-full h-full object-cover transition-opacity duration-500"
                    loading="lazy"
                    width="400"
                    height="533"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = '/media/scan_male.jpg';
                    }}
                    style={{
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      willChange: 'opacity'
                    }}
                  />
                  {/* Scan Line Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="scan-line-effect" />
                  </div>
                  {/* Overlay Points - tamanho reduzido para mobile */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute top-[25%] left-[30%] w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full sm:animate-pulse shadow-[0_0_8px_#22d3ee] opacity-80" />
                      <div className="absolute top-[25%] right-[30%] w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full sm:animate-pulse shadow-[0_0_8px_#22d3ee] opacity-80" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full sm:animate-pulse shadow-[0_0_8px_#22d3ee] opacity-80" style={{ animationDelay: '0.4s' }} />
                      <div className="absolute top-[55%] left-[50%] -translate-x-1/2 w-2.5 sm:w-3 h-0.5 sm:h-1 bg-cyan-400 rounded-full sm:animate-pulse shadow-[0_0_8px_#22d3ee] opacity-80" style={{ animationDelay: '0.6s' }} />
                    </div>
                  </div>
                </div>

                {/* After Image (Potential) */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={activeGender === 'male' ? '/media/scan_male.jpg' : '/media/scan_female.jpg'}
                    alt="Análise facial - potencial"
                    className="w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = '/media/scan_male.jpg';
                    }}
                    style={{ 
                      filter: 'brightness(1.1) contrast(1.05)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      willChange: 'opacity'
                    }}
                    loading="lazy"
                    width="400"
                    height="533"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent" />
                </div>
              </div>

              {/* Scan Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-black/50">
                <div className="h-full bg-gradient-to-r from-[#FF4D4D] via-[#FF6B35] to-[#FF4D4D] animate-scan-progress" />
              </div>
            </div>

            {/* Mini Faces Grid - escondido em mobile pequeno */}
            <div className="hidden sm:grid grid-cols-5 gap-1.5 mt-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'aspect-square rounded-md sm:rounded-lg overflow-hidden border transition-all duration-300',
                    i <= 5 ? 'border-primary/50 shadow-[0_0_10px_rgba(255,77,77,0.25)]' : 'border-white/10'
                  )}
                >
                  <img
                    src={i % 2 === 0 ? '/media/scan_female.jpg' : '/media/scan_male.jpg'}
                    alt={`Análise ${i}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = '/media/scan_male.jpg';
                    }}
                    style={{
                      filter: i <= 5 ? 'none' : 'grayscale(50%) brightness(0.7)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                    loading="lazy"
                    width="100"
                    height="100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description - compacto para mobile */}
          <div className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-xs sm:text-sm text-white/70 leading-relaxed">
            <span className="text-primary font-semibold">Visualizamos o antes/depois potencial</span> e quantificamos o impacto de ajustes cirúrgicos, grooming e lifestyle.
          </div>

          {/* Gender Switch - mais compacto */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => setActiveGender('male')}
              className={cn(
                'px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all active:scale-95',
                activeGender === 'male'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-white/60'
              )}
            >
              👨 Masc
            </button>
            <button
              onClick={() => setActiveGender('female')}
              className={cn(
                'px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all active:scale-95',
                activeGender === 'female'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-white/60'
              )}
            >
              👩 Fem
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
