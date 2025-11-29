import { motion } from 'framer-motion';

interface TestimonialScreenProps {
  onContinue: () => void;
}

export function TestimonialScreen({ onContinue }: TestimonialScreenProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-[#0A0A0A] via-[#1a0f00] to-[#FF6B35]/40">
      <div className="flex-1 px-5 sm:px-8 pt-12 sm:pt-16 pb-4 flex flex-col items-center">
        {/* Container centralizado */}
        <div className="w-full max-w-lg">
          {/* Rating Stars - Laranja */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-1 mb-4"
          >
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8C42]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white leading-tight"
          >
            Não sabia que podia ficar tão bem...
          </motion.h1>

          {/* Testimonial Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/70 mb-3 leading-relaxed"
          >
            O escaneamento facial me fez perceber o que estava me prejudicando. O plano de glow-up me disse o que corrigir e como fazer. E honestamente, funcionou melhor do que eu esperava.
          </motion.p>

          {/* Author */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-white mb-6 sm:mb-8"
          >
            — Lucas, 23
          </motion.p>

          {/* Before/After Image - Usando a imagem real */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative w-full flex justify-center"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Imagem de progresso */}
              <img
                src="/media/1-m-progress-male.webp"
                alt="Transformação de 8 semanas"
                className="w-full h-auto max-w-[400px]"
                loading="eager"
              />

              {/* Progress Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
              >
                <span className="text-xs sm:text-sm font-medium text-white">8 semanas de progresso</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Button - Branco como na referência */}
      <div className="p-5 sm:p-8 pb-8 sm:pb-12 safe-bottom w-full max-w-lg mx-auto">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(30);
            }
            onContinue();
          }}
          className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-base sm:text-lg transition-all hover:bg-white/90 active:scale-[0.98]"
        >
          Entendi
        </motion.button>
      </div>
    </div>
  );
}
