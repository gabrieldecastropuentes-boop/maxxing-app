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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2"
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

        {/* Subtítulo explicativo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-2xl px-4"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          Respondendo a algumas perguntas simples, criaremos um roadmap personalizado para você.
        </motion.p>

        {/* Subtitle - Copy melhorada e melhor resolução */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl px-4"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          Analisamos suas respostas e criamos um <span className="font-semibold text-white">plano científico personalizado</span> para elevar sua confiança, carisma e presença — tanto online quanto offline.
        </motion.p>

        {/* 3 Pilares com descrições */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6 sm:mb-8 px-4"
        >
          {[
            { icon: '📊', title: 'Análise Científica', desc: 'Algoritmo baseado em estudos de atratividade e bem-estar' },
            { icon: '🎯', title: 'Plano Personalizado', desc: 'Recomendações adaptadas ao seu perfil e objetivos' },
            { icon: '✅', title: 'Resultados Comprovados', desc: '+2,3M de pessoas já melhoraram sua confiança' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex flex-col items-center gap-2 max-w-[160px] sm:max-w-[180px]"
            >
              <div className="text-3xl sm:text-4xl">{item.icon}</div>
              <span className="text-sm sm:text-base text-white/90 font-medium text-center">{item.title}</span>
              <span className="text-xs sm:text-sm text-white/75 text-center leading-relaxed">{item.desc}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* CTA Button - Centralizado e melhorado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <p className="text-sm sm:text-base text-white/90 font-medium mb-3 text-center">
          Leva apenas 3 minutos ⏱️
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleContinue}
          className="
            relative isolate w-full max-w-md mx-auto
            rounded-2xl
            px-6 py-4
            text-base
            font-semibold
            bg-orange-50
            text-orange-700
            border border-orange-200/80
            shadow-[0_14px_40px_-18px_rgba(0,0,0,0.55)]
            transition
            hover:bg-orange-100/80
            hover:border-orange-200
            active:scale-[0.99]
            focus:outline-none
            focus:ring-2
            focus:ring-white/80
            focus:ring-offset-2
            focus:ring-offset-orange-600
            motion-reduce:transition-none
            min-h-[56px]
          "
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
          }}
        >
          {/* glow */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute -inset-2 -z-10 rounded-[1.25rem]
              bg-white/30 blur-2xl opacity-70
              animate-glow-premium
            "
          />

          {/* pulse ring */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 -z-10 rounded-2xl
              ring-2 ring-white/25
              animate-pulse-ring-premium
            "
          />

          Começar Minha Avaliação
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

