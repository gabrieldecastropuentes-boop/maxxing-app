import { motion } from 'framer-motion';
import { useRef } from 'react';
import { tracking } from '../../lib/tracking';

interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userClickedRef = useRef(false);

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    userClickedRef.current = true;
    console.log('[IntroScreen] ✅ User clicked continue button');
    tracking.startQuizClick();
    onContinue();
  };

  return (
    <div className="flex flex-col items-center text-center px-5 min-h-[100dvh] justify-center">
      {/* Face Scan Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="w-56 h-72 md:w-64 md:h-80 rounded-3xl overflow-hidden relative bg-black">
          <video
            src="/media/face-scan.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
      >
        Escaneie seu rosto
        <br />
        <span className="text-primary">com IA</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-base md:text-lg text-text-secondary mb-10 max-w-sm"
      >
        Descubra o que está te limitando e como você se compara aos outros
      </motion.p>

      {/* CTA Button */}
      <motion.button
        ref={buttonRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        type="button"
        className="btn-primary w-full max-w-sm py-4 text-lg font-semibold"
        aria-label="Continuar para seleção de gênero"
      >
        Continuar
      </motion.button>
    </div>
  );
}

