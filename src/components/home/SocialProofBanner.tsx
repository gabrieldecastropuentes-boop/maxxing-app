import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialProof {
  name: string;
  location: string;
  action: 'completed' | 'scored';
  value?: number;
}

const socialProofs: SocialProof[] = [
  { name: 'Lucas', location: 'Rio de Janeiro', action: 'completed' },
  { name: 'Marina', location: 'São Paulo', action: 'scored', value: 8.2 },
  { name: 'Pedro', location: 'Brasília', action: 'completed' },
  { name: 'Julia', location: 'Salvador', action: 'scored', value: 7.8 },
  { name: 'Rafael', location: 'Fortaleza', action: 'completed' },
  { name: 'Camila', location: 'Recife', action: 'scored', value: 9.1 },
];

export function SocialProofBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % socialProofs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = socialProofs[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none safe-bottom"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-sm mx-auto bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-400 animate-pulse">🔥</span>
            <span className="text-white/90">
              <strong className="text-white">{current.name}</strong> ({current.location}){' '}
              {current.action === 'completed' ? (
                <>acabou de completar o teste!</>
              ) : (
                <>recebeu score <strong className="text-primary">{current.value}/10</strong>!</>
              )}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

