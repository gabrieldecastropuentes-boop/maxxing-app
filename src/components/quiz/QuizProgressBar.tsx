import { motion } from 'framer-motion';

interface QuizProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

const progressMessages = [
  { min: 0, max: 20, message: 'Começando bem!' },
  { min: 20, max: 40, message: 'Você está indo bem!' },
  { min: 40, max: 60, message: 'Quase na metade!' },
  { min: 60, max: 80, message: 'Excelente progresso!' },
  { min: 80, max: 95, message: 'Quase lá!' },
  { min: 95, max: 100, message: 'Últimos passos!' },
];

export function QuizProgressBar({ progress, currentStep, totalSteps }: QuizProgressBarProps) {
  const getMessage = () => {
    const message = progressMessages.find(
      (m) => progress >= m.min && progress < m.max
    );
    return message?.message || 'Continue assim!';
  };

  // Calculate remaining steps based on progress
  const remainingSteps = totalSteps > 0 && currentStep > 0 
    ? Math.max(0, totalSteps - currentStep) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#FF4D4D]/30 py-3 px-4 safe-top"
      style={{ minHeight: '80px' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35] rounded-full"
          />
        </div>
        
        {/* Progress Text */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-white/80 font-medium">
            {Math.round(progress)}% completo
          </span>
          {remainingSteps > 0 && (
            <span className="text-white/60">
              Faltam {remainingSteps} {remainingSteps === 1 ? 'pergunta' : 'perguntas'}
            </span>
          )}
        </div>
        
        {/* Encouragement Message */}
        <motion.p
          key={progress}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs sm:text-sm text-white/70 mt-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {getMessage()}
        </motion.p>
      </div>
    </motion.div>
  );
}

