import { motion } from 'framer-motion';

interface GenderSelectScreenProps {
  onSelect: (gender: 'male' | 'female') => void;
}

export function GenderSelectScreen({ onSelect }: GenderSelectScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-5 min-h-[100dvh] justify-center">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
      >
        Antes de continuarmos, selecione o seu gênero.
      </motion.h1>

      {/* Gender Options */}
      <div className="w-full max-w-md space-y-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('male')}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center">
            <span className="text-3xl">👨</span>
          </div>
          <span className="text-xl font-semibold">Masculino</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('female')}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400/20 to-pink-600/20 flex items-center justify-center">
            <span className="text-3xl">👩</span>
          </div>
          <span className="text-xl font-semibold">Feminino</span>
        </motion.button>
      </div>
    </div>
  );
}

