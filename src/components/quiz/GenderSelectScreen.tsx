import { motion } from 'framer-motion';

interface GenderSelectScreenProps {
  onSelect: (gender: 'male' | 'female') => void;
}

export function GenderSelectScreen({ onSelect }: GenderSelectScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-5 min-h-[100dvh] justify-center safe-top safe-bottom">
      {/* Title - Ajustado para melhor escala e espaçamento */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 px-2 leading-tight"
      >
        Antes de continuarmos, selecione o seu gênero.
      </motion.h1>

      {/* Gender Options - Melhorado espaçamento e escala */}
      <div className="w-full max-w-md space-y-4 sm:space-y-5 md:space-y-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('male')}
          className="w-full flex items-center gap-4 sm:gap-5 p-5 sm:p-6 md:p-7 rounded-2xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all shadow-sm hover:shadow-md"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-400/20">
            <span className="text-3xl sm:text-4xl md:text-5xl">👨</span>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-left flex-1">Masculino</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('female')}
          className="w-full flex items-center gap-4 sm:gap-5 p-5 sm:p-6 md:p-7 rounded-2xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all shadow-sm hover:shadow-md"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-pink-400/20 to-pink-600/20 flex items-center justify-center flex-shrink-0 border border-pink-400/20">
            <span className="text-3xl sm:text-4xl md:text-5xl">👩</span>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-left flex-1">Feminino</span>
        </motion.button>
      </div>
    </div>
  );
}

