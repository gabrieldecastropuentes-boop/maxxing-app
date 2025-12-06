import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface PersonalityIntroScreenProps {
  onContinue: () => void;
}

export function PersonalityIntroScreen({ onContinue }: PersonalityIntroScreenProps) {
  // Track view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', 'quiz_intro_view', {
          event_category: 'Quiz',
          event_label: 'Personality Intro',
        });
      }
      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'QuizIntroView', {
          content_name: 'Personality Intro Screen',
        });
      }
    }
  }, []);

  const handleContinue = () => {
    // Track click
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'quiz_intro_continue', {
          event_category: 'Quiz',
          event_label: 'Personality Intro Continue',
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'QuizIntroContinue', {
          content_name: 'Personality Intro Continue Click',
        });
      }
    }
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] flex flex-col justify-center items-center px-6 py-8 safe-top safe-bottom"
      style={{
        background: 'linear-gradient(180deg, #FF8C42 0%, #FF6B35 50%, #FF4D4D 100%)',
      }}
    >
      {/* Content Container - Centralizado */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-3xl mx-auto w-full">
        {/* Ícone decorativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
          </div>
        </motion.div>

        {/* Title - Melhorado copy e resolução */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          Sua personalidade
          <br />
          <span className="text-white/95">define sua atratividade</span>
        </motion.h1>

        {/* Subtitle - Copy melhorada e melhor resolução */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 leading-relaxed max-w-2xl px-4"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            lineHeight: '1.6',
          }}
        >
          Analisamos suas respostas e criamos um <span className="font-semibold text-white">plano científico personalizado</span> para elevar sua confiança, carisma e presença — tanto online quanto offline.
        </motion.p>

        {/* Ícones de benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 sm:mb-10 px-4"
        >
          {[
            { icon: '✨', text: 'Análise Científica' },
            { icon: '🎯', text: 'Plano Personalizado' },
            { icon: '🚀', text: 'Resultados Comprovados' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-3xl sm:text-4xl">{item.icon}</div>
              <span className="text-sm sm:text-base text-white/90 font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button - Centralizado e melhorado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="
            w-full
            py-4 sm:py-5 px-6
            rounded-2xl
            bg-white
            text-gray-900
            font-semibold
            text-lg sm:text-xl
            border border-gray-200
            shadow-xl
            transition-all duration-200
            min-h-[56px]
            active:scale-[0.98]
            hover:shadow-2xl
          "
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Começar análise
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

