import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SocialProofTransitionScreenProps {
  onContinue: () => void;
  gender?: 'male' | 'female';
}

/**
 * Tela de transição com social proof - Baseada no design de start.maxxing.me
 * Usa a imagem maxx-map.png como referência
 */
export function SocialProofTransitionScreen({ 
  onContinue, 
  gender = 'male' 
}: SocialProofTransitionScreenProps) {
  const isFemale = gender === 'female';

  const handleContinue = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'social_proof_continue', {
          event_category: 'Quiz',
          event_label: 'Social Proof Transition Continue',
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'SocialProofContinue', {
          content_name: 'Social Proof Transition Continue',
        });
      }
    }
    
    onContinue();
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-black overflow-hidden">
      {/* Efeitos RGB Wave de fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wave RGB 1 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(255, 77, 77, 0.15), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 107, 53, 0.15), transparent 50%)',
              'radial-gradient(circle at 50% 70%, rgba(255, 140, 66, 0.15), transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(255, 77, 77, 0.15), transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Wave RGB 2 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 70% 20%, rgba(255, 140, 66, 0.1), transparent 60%)',
              'radial-gradient(circle at 30% 60%, rgba(255, 77, 77, 0.1), transparent 60%)',
              'radial-gradient(circle at 60% 80%, rgba(255, 107, 53, 0.1), transparent 60%)',
              'radial-gradient(circle at 70% 20%, rgba(255, 140, 66, 0.1), transparent 60%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Grid pattern sutil */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradiente que harmoniza com o fundo da imagem do mapa */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '60%',
          background: 'linear-gradient(to top, rgba(15, 15, 20, 0.95) 0%, rgba(10, 10, 15, 0.8) 30%, rgba(0, 0, 0, 0) 70%)',
          zIndex: 5,
        }}
      />


      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 px-4 sm:px-6">
        {/* Badge Top App */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center pt-8 sm:pt-12 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <span className="text-base sm:text-lg">🇧🇷</span>
            <span className="text-sm sm:text-base font-semibold text-white">
              Top app no Brasil
            </span>
            <span className="text-yellow-400">⭐️</span>
            <span className="text-sm sm:text-base font-bold text-white">4.9</span>
          </div>
        </motion.div>

        {/* Título "Você está em boa companhia!" */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-8 sm:mb-10"
        >
          Você está em boa companhia!
        </motion.h2>

        {/* Mapa - usando a imagem, centralizado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-full flex-1 flex items-center justify-center my-6 sm:my-8"
        >
          <div className="relative w-full max-w-3xl mx-auto">
            <img
              src="/media/maxx-map.png"
              alt="Mapa do mundo com foco no Brasil"
              className="w-full h-auto object-contain"
              style={{
                mixBlendMode: 'screen',
                opacity: 0.95,
              }}
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Mensagem principal - texto branco/laranja - mais centralizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center my-8 sm:my-12 space-y-2 sm:space-y-3 relative z-20"
        >
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            Mais de{' '}
            <span className={cn(
              "inline-block",
              isFemale ? "text-pink-500" : "text-[#FF6B35]"
            )}>
              360.000
            </span>
            {' '}
            {isFemale ? 'pessoas' : 'homens'} já estão
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            em sua jornada de{' '}
            <span className={cn(
              "inline-block font-bold",
              isFemale ? "text-pink-500" : "text-[#FF6B35]"
            )}>
              Maxxing
            </span>
          </p>
        </motion.div>
      </div>

      {/* Botão Continuar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="relative z-20 px-4 sm:px-6 pb-8 sm:pb-12 pt-6"
      >
        <div className="relative max-w-md mx-auto">
          <button
            onClick={handleContinue}
            className={cn(
              "relative w-full py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-2xl",
              "transition-all duration-200 active:scale-[0.98] shadow-xl",
              "bg-white text-black hover:bg-white/90"
            )}
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
