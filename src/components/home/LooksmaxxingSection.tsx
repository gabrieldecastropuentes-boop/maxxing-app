import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';

const pillars = [
  {
    title: 'Diagnóstico Científico',
    desc: 'Mapeamos simetria, proporções e texturas faciais com IA proprietária para entender o ponto de partida.',
  },
  {
    title: 'Blueprint Personalizado',
    desc: 'Você recebe um plano de ação guiado para grooming, lifestyle e intervenções rápidas de alto impacto.',
  },
  {
    title: 'Execução com Feedback',
    desc: 'Acompanhamos sua evolução semanalmente para garantir ganho real na sua presença.',
  },
];

export function LooksmaxxingSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="section-container py-16 sm:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="rounded-[28px] sm:rounded-[36px] border border-white/8 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 lg:p-12 shadow-[0_25px_90px_rgba(0,0,0,0.5)]"
      >
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-3 sm:mb-4">
          LOOKSMAXXING EXPLICADO
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
          Maxxing vai além do espelho. É ciência aplicada ao posicionamento social.
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-4xl">
          O algoritmo identifica quais ajustes trazem o maior retorno estético com o menor esforço.
          Sem achismos, sem tendências aleatórias — apenas decisões baseadas em dados e efeito social comprovado.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-4 sm:gap-5">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className={cn(
                'rounded-3xl border border-white/10 bg-[#0F0D10]/80 p-5 flex flex-col h-full',
                'shadow-[0_15px_50px_rgba(0,0,0,0.4)]'
              )}
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 mb-3 sm:mb-4 flex items-center justify-center text-white/80 font-semibold">
                {index + 1}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/60 text-center sm:text-left">
            Sem custo • Sem cadastro • Resultado em segundos
          </p>
          <a href="/quiz" className="btn-primary btn-full-mobile text-sm sm:text-base min-h-[56px] whitespace-nowrap">
            Iniciar Análise Facial
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

