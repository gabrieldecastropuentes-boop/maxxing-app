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
      className="min-h-[100dvh] flex flex-col justify-between px-6 py-8"
      style={{
        background: 'linear-gradient(180deg, #FF8C42 0%, #FF6B35 50%, #FF4D4D 100%)',
      }}
    >
      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center items-start max-w-2xl mx-auto w-full">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
          }}
        >
          Sua personalidade
          <br />
          define sua
          <br />
          <span className="text-white/95">atratividade</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-lg"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          Vamos analisar suas respostas e criar um plano científico para elevar sua confiança, carisma e presença — online e offline.
        </motion.p>
      </div>

      {/* CTA Button - Sticky Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="
            w-full
            py-4 px-6
            rounded-2xl
            bg-white
            text-gray-900
            font-semibold
            text-lg
            border border-gray-200
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
    </motion.div>
  );
}

