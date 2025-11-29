import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 safe-top"
      style={{ 
        willChange: 'opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      <div className="bg-[#0a0a0f]/95 sm:bg-[#0a0a0f]/80 backdrop-blur-none sm:backdrop-blur-xl border-b border-white/10 w-full" style={{ transform: 'translateZ(0)' }}>
        <div className="section-container w-full">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <a href="/" className="text-white font-bold text-lg sm:text-xl">
                Maxxing
              </a>
            </div>

            {/* CTA Button */}
            <a
              href="/quiz"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(30);
                }
                if (typeof window !== 'undefined' && (window as any).trackEvent) {
                  (window as any).trackEvent('HeaderCTA', { source: 'header' });
                }
              }}
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'px-4 sm:px-6 py-2 sm:py-2.5',
                'text-sm sm:text-base font-semibold text-white',
                'bg-gradient-to-r from-[#FF4D4D] via-[#FF6B35] to-[#FF4D4D]',
                'bg-[length:200%_200%] animate-gradient-x',
                'rounded-lg sm:rounded-xl',
                'shadow-[0_0_20px_rgba(255,77,77,0.3)]',
                'hover:shadow-[0_0_30px_rgba(255,77,77,0.4)]',
                'active:scale-[0.98] transition-all duration-200'
              )}
            >
              <span className="hidden sm:inline">Começar Quiz</span>
              <span className="sm:hidden">Quiz</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

