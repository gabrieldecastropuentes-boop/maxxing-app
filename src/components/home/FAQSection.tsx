import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'É realmente gratuito?',
    answer: 'Sim! Nenhum pagamento solicitado. A avaliação inicial é 100% gratuita e você recebe seu score imediatamente.',
  },
  {
    question: 'Quanto tempo demora?',
    answer: 'Apenas 3 minutos. Você responde algumas perguntas, envia suas fotos e recebe o resultado instantaneamente.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: '100% privado. Não compartilhamos seus dados com ninguém. Usamos criptografia SSL e seguimos a LGPD.',
  },
  {
    question: 'Funciona em qualquer tipo de rosto?',
    answer: 'Sim! Nossa IA foi treinada com mais de 2 milhões de rostos diversos. Funciona para todos os tipos faciais e gêneros.',
  },
  {
    question: 'Preciso de cartão de crédito?',
    answer: 'Não! A avaliação inicial é completamente gratuita e não pedimos nenhum dado de pagamento.',
  },
  {
    question: 'O resultado é preciso?',
    answer: 'Nossa IA utiliza algoritmos científicos validados e foi treinada com milhões de análises. A precisão é de 94%.',
  },
];

export function FAQSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="section-container py-10 sm:py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary mb-3"
          >
            Dúvidas Frequentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Perguntas Frequentes
          </motion.h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`bg-white/5 border rounded-xl sm:rounded-2xl overflow-hidden transition-all ${
                openIndex === index 
                  ? 'bg-[rgba(255,77,77,0.08)] border-[rgba(255,77,77,0.3)]' 
                  : 'border-white/10'
              }`}
            >
              <button
                onClick={() => {
                  const newIndex = openIndex === index ? null : index;
                  setOpenIndex(newIndex);
                  
                  // Track GA4
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'faq_opened', {
                      event_category: 'FAQ',
                      event_label: faq.question,
                      faq_position: index + 1,
                    });
                  }
                }}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-white flex-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  ❓ {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-light text-[#FF4D4D] flex-shrink-0"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-white/70 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

