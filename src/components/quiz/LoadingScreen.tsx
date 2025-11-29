import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
  hasPhoto?: boolean;
}

const baseSteps = [
  { text: 'Analisando estrutura facial...', icon: '🧬' },
  { text: 'Calculando proporções...', icon: '📐' },
  { text: 'Avaliando simetria...', icon: '⚖️' },
  { text: 'Processando pontuações...', icon: '📊' },
  { text: 'Gerando relatório personalizado...', icon: '📝' },
  { text: 'Finalizando resultados...', icon: '✨' },
];

const photoSteps = [
  { text: 'Processando imagem...', icon: '🖼️' },
  { text: 'Detectando pontos faciais...', icon: '📍' },
  { text: 'Analisando simetria facial...', icon: '⚖️' },
  { text: 'Medindo proporções áureas...', icon: '📐' },
  { text: 'Avaliando qualidade da pele...', icon: '✨' },
  { text: 'Analisando estrutura óssea...', icon: '🦴' },
  { text: 'Calculando score de atratividade...', icon: '🎯' },
  { text: 'Gerando análise detalhada...', icon: '📊' },
];

export function LoadingScreen({ onComplete, hasPhoto = false }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps = hasPhoto ? photoSteps : baseSteps;
  const totalDuration = hasPhoto ? 5000 : 3500;

  useEffect(() => {
    const stepDuration = totalDuration / analysisSteps.length;
    const progressInterval = 40;
    const progressPerInterval = 100 / (totalDuration / progressInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressPerInterval;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 400);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, analysisSteps.length, totalDuration]);

  return (
    <div className="flex flex-col items-center text-center px-4 md:px-6">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6 md:mb-8"
      >
        {/* Outer spinning ring */}
        <motion.div
          className="absolute rounded-full border-4 border-primary/20"
          style={{ width: 110, height: 110, top: -19, left: -19 }}
        />
        <motion.div
          className="absolute rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          style={{ width: 110, height: 110, top: -19, left: -19 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner spinning ring (opposite direction) */}
        {hasPhoto && (
          <motion.div
            className="absolute rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent"
            style={{ width: 90, height: 90, top: -9, left: -9 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {/* Center icon */}
        <motion.div
          className={cn(
            "w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl md:text-4xl",
            hasPhoto 
              ? "bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20" 
              : "bg-gradient-to-br from-primary/15 to-accent/15"
          )}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {analysisSteps[currentStep]?.icon || '🧠'}
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold font-display mb-1.5 md:mb-2"
      >
        {hasPhoto ? 'Analisando Sua Foto' : 'Analisando Resultados'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm md:text-base text-text-secondary mb-6 md:mb-8"
      >
        {hasPhoto 
          ? 'Nossa IA está processando sua imagem...' 
          : 'Aguarde enquanto processamos seus dados...'}
      </motion.p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs md:max-w-sm mb-6 md:mb-8">
        <div className="h-2.5 md:h-3 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: hasPhoto 
                ? 'linear-gradient(90deg, #FF4D4D 0%, #FF6B35 25%, #4A90D9 50%, #FF6B35 75%, #FF4D4D 100%)'
                : 'linear-gradient(90deg, #FF4D4D 0%, #FF6B35 50%, #FF4D4D 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs md:text-sm">
          <span className="text-text-muted">{Math.round(progress)}%</span>
          <span className="text-primary font-medium truncate ml-2">
            {analysisSteps[currentStep]?.text}
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-xs md:max-w-sm space-y-1.5 md:space-y-2 max-h-[280px] overflow-y-auto scrollbar-hide">
        {analysisSteps.map((step, index) => (
          <motion.div
            key={step.text}
            initial={{ opacity: 0, x: -15 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
              x: 0,
            }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className={cn(
              "flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg transition-colors",
              index === currentStep && "bg-primary/10 border border-primary/20",
              index < currentStep && "bg-green-500/10 border border-green-500/20",
              index > currentStep && "bg-white/[0.03] border border-white/[0.06]"
            )}
          >
            <span className="text-base md:text-lg">
              {index < currentStep ? '✅' : step.icon}
            </span>
            <span className={cn(
              "text-xs md:text-sm flex-1 text-left",
              index <= currentStep ? "text-white" : "text-text-muted"
            )}>
              {step.text}
            </span>
            {index === currentStep && (
              <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Fun fact for photo analysis */}
      {hasPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] max-w-sm"
        >
          <p className="text-xs text-text-secondary">
            <span className="text-primary font-medium">💡 Você sabia?</span> Nossa IA analisa mais de 68 pontos faciais para calcular sua pontuação de atratividade com precisão científica.
          </p>
        </motion.div>
      )}
    </div>
  );
}
