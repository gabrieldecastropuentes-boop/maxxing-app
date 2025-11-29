import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function UrgencyStrip() {
  const [count, setCount] = useState(1847);

  useEffect(() => {
    // Incrementa contador a cada 8-15 segundos
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 7000 + 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[rgba(255,77,77,0.15)] border border-[rgba(255,77,77,0.4)] my-4 sm:my-6"
      style={{
        animation: 'pulse-glow 2s infinite',
      }}
    >
      <span className="text-lg sm:text-xl animate-pulse">🔥</span>
      <span className="text-xs sm:text-sm font-semibold text-white">
        <strong className="text-red-400">Últimas 23 vagas gratuitas hoje</strong>
        {' • '}
        <span id="live-counter" className="text-green-400">
          {count.toLocaleString('pt-BR')}
        </span>
        {' '}
        pessoas fizeram o teste hoje
      </span>
    </motion.div>
  );
}

