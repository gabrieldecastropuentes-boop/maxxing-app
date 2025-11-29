import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UrgencyCounterProps {
  variant?: 'banner' | 'inline' | 'badge';
  className?: string;
}

export function UrgencyCounter({ variant = 'banner', className = '' }: UrgencyCounterProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12,
  });
  const [spotsLeft, setSpotsLeft] = useState(47);
  const [todayCount, setTodayCount] = useState(2847);

  // Incrementa contador dinamicamente
  useEffect(() => {
    const countInterval = setInterval(() => {
      setTodayCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 7000 + 8000);
    return () => clearInterval(countInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset para 24h quando chegar a zero
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => String(value).padStart(2, '0');

  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold ${className}`}
      >
        <span className="animate-pulse">🔥</span>
        <span>Últimas {spotsLeft} vagas gratuitas hoje</span>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-3 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-red-400">🔥</span>
          <span className="text-white/90">Últimas <strong className="text-red-400">{spotsLeft}</strong> vagas gratuitas hoje</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">⏰</span>
          <span className="text-white/90">
            Oferta válida por: <strong className="text-yellow-400">
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">👥</span>
          <span className="text-white/90"><strong className="text-green-400">{todayCount.toLocaleString()}</strong> pessoas fizeram o teste hoje</span>
        </div>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-[#FF4D4D] via-[#FF6B35] to-[#FF4D4D] border-y border-red-500/30 py-3 px-4 ${className}`}
      style={{
        animation: 'pulse 2s infinite',
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🔥</span>
          <span className="text-white font-semibold">
            Últimas <span className="text-red-400 text-base font-bold">{spotsLeft}</span> vagas gratuitas hoje
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <span className="text-white/90">
            Oferta válida por: <span className="text-yellow-400 font-mono font-bold">
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <span className="text-white/90">
            <span className="text-green-400 font-bold">{todayCount.toLocaleString()}</span> pessoas fizeram hoje
          </span>
        </div>
      </div>
    </motion.div>
  );
}

