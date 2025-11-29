import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MaxxingEffectScreenProps {
  onContinue: () => void;
}

// Dados do gráfico
const chartData = [
  { category: 'Autoconhecimento', before: 30, after: 65 },
  { category: 'Confiança', before: 25, after: 85 },
  { category: 'Relacionamentos', before: 20, after: 90 },
  { category: 'Atratividade', before: 28, after: 82 },
];

// Cards de autoridade
const authorityCards = [
  {
    icon: '🏥',
    institution: 'National Library of Medicine',
    text: 'relata que conhecer seus traços de personalidade ajuda no manejo do estresse',
  },
  {
    icon: '🧠',
    institution: 'American Psychological Association',
    text: 'afirma que pessoas que conhecem suas tendências de personalidade são mais preparadas para relacionamentos saudáveis',
  },
];

export function MaxxingEffectScreen({ onContinue }: MaxxingEffectScreenProps) {
  const [animatedBars, setAnimatedBars] = useState(false);

  // Track view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', 'maxxing_effect_view', {
          event_category: 'Quiz',
          event_label: 'Maxxing Effect Screen',
        });
      }
      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'MaxxingEffectView', {
          content_name: 'Maxxing Effect Screen',
        });
      }
    }
    // Trigger bar animation
    setTimeout(() => setAnimatedBars(true), 300);
  }, []);

  const handleContinue = () => {
    // Track click
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'maxxing_effect_continue', {
          event_category: 'Quiz',
          event_label: 'Maxxing Effect Continue',
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'MaxxingEffectContinue', {
          content_name: 'Maxxing Effect Continue Click',
        });
      }
    }
    onContinue();
  };

  // Calculate max value for scaling
  const maxValue = Math.max(...chartData.map(d => Math.max(d.before, d.after)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] bg-black text-white px-4 py-8 pb-24"
    >
      <div className="max-w-md mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
          }}
        >
          Maxxing Effect
        </motion.h1>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4D4D]" />
              <span className="text-sm text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Antes de conhecer seu tipo de personalidade
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4D9FFF]" />
              <span className="text-sm text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Depois de conhecer seu tipo de personalidade
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-6">
            {chartData.map((item, index) => {
              const beforeWidth = (item.before / maxValue) * 100;
              const afterWidth = (item.after / maxValue) * 100;

              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {item.category}
                  </div>
                  
                  {/* Before Bar */}
                  <div className="relative h-6 bg-gray-900 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: animatedBars ? `${beforeWidth}%` : 0 }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-[#FF4D4D] rounded-lg"
                    />
                  </div>

                  {/* After Bar */}
                  <div className="relative h-6 bg-gray-900 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: animatedBars ? `${afterWidth}%` : 0 }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      className="h-full bg-[#4D9FFF] rounded-lg"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Authority Cards */}
        <div className="space-y-4 mb-8">
          {authorityCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{card.icon}</div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <span className="text-[#FF4D4D] font-semibold">{card.institution}</span>{' '}
                    {card.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-sm border-t border-gray-800 safe-bottom"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="
              w-full
              py-4 px-6
              rounded-2xl
              bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35]
              text-white
              font-semibold
              text-lg
              shadow-lg
              transition-all duration-200
              min-h-[56px]
              active:scale-[0.98]
            "
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            Continuar
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

