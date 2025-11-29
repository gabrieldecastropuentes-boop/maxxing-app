import { motion } from 'framer-motion';

export function AuthorityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#FF4D4D]/20 to-[#FF6B35]/20 border border-[#FF4D4D]/40 text-white text-xs sm:text-sm font-semibold"
    >
      <span className="text-base sm:text-lg">🇧🇷</span>
      <span>#1 em Análise Facial no Brasil</span>
    </motion.div>
  );
}

