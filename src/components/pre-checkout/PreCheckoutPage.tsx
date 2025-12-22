import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';
import { tracking } from '../../lib/tracking';
import { PERFECTPAY_CHECKOUT_URL } from '../../lib/checkout';

const includedItems = [
  {
    title: 'Protocolo individual baseado na sua simetria',
    icon: '🎯',
    desc: 'Análise detalhada dos seus traços faciais com recomendações personalizadas',
  },
  {
    title: 'Pontuações detalhadas por categoria',
    icon: '📊',
    desc: 'Score completo de atratividade, simetria, proporções e estrutura facial',
  },
  {
    title: 'Mapa facial inteligente',
    icon: '🗺️',
    desc: 'Visualização interativa dos pontos fortes e áreas de melhoria',
  },
  {
    title: 'Lista de melhorias recomendadas',
    icon: '✨',
    desc: 'Plano de ação específico para maximizar sua atratividade',
  },
  {
    title: 'Roadmap de beleza Maxxing',
    icon: '🛣️',
    desc: 'Cronograma passo a passo para alcançar seu potencial máximo',
  },
  {
    title: 'Recomendações personalizadas',
    icon: '💡',
    desc: 'Sugestões de grooming, estilo e lifestyle baseadas na sua análise',
  },
];

const benefits = [
  { text: 'Conteúdo exclusivo desenvolvido por especialistas', icon: '🔒' },
  { text: 'Acesso ao roadmap completo de transformação', icon: '📱' },
  { text: 'Personalização real baseada em IA avançada', icon: '🤖' },
  { text: 'Resultados mensuráveis e acompanhamento', icon: '📈' },
  { text: 'Garantia de satisfação', icon: '✅' },
];

export function PreCheckoutPage() {
  const { ref: headerRef, isVisible: headerVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: includedRef, isVisible: includedVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: benefitsRef, isVisible: benefitsVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  // Track VSL view
  useEffect(() => {
    tracking.vslView();
  }, []);

  const handleCheckout = () => {
    tracking.checkoutClick();
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Pre-Checkout CTA Clicked',
      });
    }
    window.location.href = PERFECTPAY_CHECKOUT_URL;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Bloco 1 - Cabeçalho Explicativo */}
      <section ref={headerRef} className="section-container pt-16 sm:pt-20 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Análise Completa
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Sua análise facial está pronta —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              agora desbloqueie o relatório completo
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Entenda exatamente o que você está prestes a receber antes de continuar
          </p>
        </motion.div>
      </section>

      {/* Bloco 2 - O que está incluído */}
      <section ref={includedRef} className="section-container py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={includedVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3 sm:mb-4">
            O que está incluído no plano
          </h2>
          <p className="text-sm sm:text-base text-text-secondary text-center max-w-2xl mx-auto">
            Tudo que você precisa para maximizar sua atratividade facial
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {includedItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={includedVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={cn(
                'card p-5 sm:p-6 flex flex-col h-full',
                'hover:bg-white/[0.05] transition-colors'
              )}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed flex-1">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bloco 3 - Benefícios */}
      <section ref={benefitsRef} className="section-container py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="card-elevated p-6 sm:p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8">
            Benefícios Exclusivos
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, x: -20 }}
                animate={benefitsVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 sm:gap-5"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl sm:text-2xl">
                  {benefit.icon}
                </div>
                <p className="text-base sm:text-lg text-white font-medium pt-2 sm:pt-3">
                  {benefit.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bloco 4 - CTA */}
      <section className="section-container py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-6 sm:space-y-8"
        >
          <div className="card-elevated p-6 sm:p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Pronto para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  desbloquear
                </span>{' '}
                sua análise completa?
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-lg mx-auto">
                Receba seu relatório personalizado e protocolo de Maxxing baseado na sua análise facial
              </p>

              <button
                onClick={handleCheckout}
                className={cn(
                  'btn-primary w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5',
                  'text-base sm:text-lg font-bold animate-pulse-glow',
                  'flex items-center justify-center gap-3 mx-auto'
                )}
              >
                <span>Quero desbloquear minha análise completa</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-muted pt-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pagamento 100% seguro
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Acesso imediato
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Garantia de satisfação
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bloco 5 - Espaço para Prova Social (Placeholder) */}
      <section className="section-container py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
            O que nossos usuários dizem
          </h2>

          {/* Placeholder para depoimentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="card p-5 sm:p-6 text-left">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                    {i === 1 ? 'JP' : 'CM'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1 sm:mb-2">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-2">
                      {i === 1
                        ? 'A análise foi extremamente precisa e o protocolo personalizado realmente funcionou. Recomendo!'
                        : 'Consegui aumentar minha pontuação em poucas semanas seguindo as recomendações.'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-text-muted">
                      — {i === 1 ? 'João P., São Paulo' : 'Carlos M., Rio de Janeiro'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder para avaliações */}
          <div className="card p-5 sm:p-6">
            <p className="text-sm sm:text-base text-text-secondary mb-4">
              <span className="text-white font-semibold">4.9/5</span> baseado em mais de{' '}
              <span className="text-white font-semibold">2.3M</span> avaliações
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

