import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('exit_popup_shown');
      if (shown === 'true') {
        setHasShown(true);
        return;
      }

      // Detect exit intent (visibility change)
      const handleVisibilityChange = () => {
        if (document.hidden && !hasShown && !showPopup) {
          setShowPopup(true);
          setHasShown(true);
          sessionStorage.setItem('exit_popup_shown', 'true');
          
          // Track event
          if ((window as any).gtag) {
            (window as any).gtag('event', 'exit_intent_popup_shown', {
              event_category: 'Conversion',
            });
          }
          if ((window as any).fbq) {
            (window as any).fbq('trackCustom', 'ExitIntentPopupShown');
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [hasShown, showPopup]);

  const handleCTAClick = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exit_intent_cta_click', {
          event_category: 'Conversion',
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead', { content_name: 'Exit Intent CTA' });
      }
    }
    window.location.href = '/quiz';
  };

  const handleClose = () => {
    setShowPopup(false);
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exit_intent_dismissed', {
          event_category: 'Conversion',
        });
      }
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#1a1a1a] border-2 border-[#FF4D4D] rounded-2xl p-6 sm:p-8 max-w-md w-full pointer-events-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                ⚠️ Espera! Não perca sua análise gratuita
              </h3>
              <p className="text-sm sm:text-base text-white/80 mb-6 text-center leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                🎁 <strong className="text-primary">BÔNUS:</strong> Complete agora e ganhe acesso a<br />
                <span className="text-primary font-semibold">"7 Truques de Grooming que Elevam Qualquer Rosto"</span>
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleCTAClick}
                  className="
                    w-full
                    py-4 px-6
                    rounded-xl
                    bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35]
                    text-white
                    font-bold
                    text-base sm:text-lg
                    min-h-[56px]
                    shadow-lg
                    active:scale-[0.98]
                    transition-all duration-200
                  "
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Fazer Teste Grátis
                </button>
                <button
                  onClick={handleClose}
                  className="
                    w-full
                    py-3 px-6
                    rounded-xl
                    bg-transparent
                    border border-white/30
                    text-white/60
                    font-medium
                    text-sm
                    min-h-[44px]
                    active:scale-[0.98]
                    transition-all duration-200
                  "
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Não, obrigado
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

