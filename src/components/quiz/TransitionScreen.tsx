import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionMessage } from '../../data/quizData';
import { cn } from '../../lib/utils';

interface TransitionScreenProps {
  message: TransitionMessage;
  onContinue: () => void;
}

export function TransitionScreen({ message, onContinue }: TransitionScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2200;
    const interval = 40;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onContinue, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="flex flex-col items-center text-center px-4 md:px-6">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.7 }}
        className="text-5xl md:text-6xl mb-5 md:mb-6"
      >
        {message.icon}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold font-display mb-2 text-primary"
      >
        {message.title}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-sm md:text-base text-text-secondary mb-6 md:mb-8"
      >
        {message.subtitle}
      </motion.p>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-xs md:max-w-sm mb-6 md:mb-8"
      >
        <div className="progress-bar h-2 md:h-2.5 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs md:text-sm text-text-muted mt-2">
          Processando... {Math.round(progress)}%
        </p>
      </motion.div>

      {/* Fact */}
      {message.fact && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-4 md:p-5 max-w-sm"
        >
          <div className="flex items-start gap-2.5 md:gap-3 text-left">
            <span className="text-lg md:text-xl flex-shrink-0">💡</span>
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Você sabia?</p>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{message.fact}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-1.5 mt-6 md:mt-8"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"
            )}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
