import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface HaircutTransitionScreenProps {
  onContinue: () => void;
  gender?: 'male' | 'female';
}

/**
 * Página de transição do quiz - Gancho sobre corte de cabelo
 * Design minimalista inspirado em start.maxxing.me
 */
export function HaircutTransitionScreen({ onContinue, gender = 'male' }: HaircutTransitionScreenProps) {
  const isFemale = gender === 'female';

  return (
    <div className="flex flex-col min-h-[100dvh] px-6 sm:px-8">
      {/* Conteúdo centralizado verticalmente */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* Headline principal - vermelho/laranja */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 sm:mb-12",
            isFemale ? "text-pink-500" : "text-primary"
          )}
        >
          {isFemale 
            ? 'Um bom corte de cabelo pode adicionar 2-3 pontos na sua beleza.'
            : 'Um bom corte de cabelo pode adicionar 2-3 pontos na sua atratividade.'}
        </motion.h1>

        {/* Subheadline - branco/cinza */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-xl"
        >
          {isFemale
            ? 'Mas a maioria das mulheres não sabe qual estilo realmente combina com seu rosto.'
            : 'Mas a maioria das pessoas não sabe qual estilo realmente combina com seu rosto.'}
        </motion.p>
      </div>

      {/* Botão fixo na parte inferior */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="pb-8 sm:pb-12 w-full max-w-md mx-auto"
      >
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(30);
            }
            onContinue();
          }}
          className={cn(
            "w-full py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-2xl",
            "transition-all duration-200 active:scale-[0.98]",
            isFemale
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "bg-primary hover:bg-primary/90 text-white"
          )}
        >
          Continuar
        </button>
      </motion.div>
    </div>
  );
}
