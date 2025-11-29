import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnalyzingScreenProps {
  frontImage: string;
  sideImage: string | null;
  onComplete: (results: AnalysisResults) => void;
}

export interface AnalysisResults {
  overallScore: number;
  potential: number;
  features: {
    attractiveness: number;
    jawline: number;
    skinQuality: number;
    symmetry: number;
    eyeArea: number;
    noseShape: number;
    lips: number;
    hairline: number;
    facialStructure: number;
  };
  strengths: string[];
  weaknesses: string[];
  estimatedAge: number;
  analysisSummary: string;
}

const analysisSteps = [
  { key: 'facial', label: 'Relatório de Atratividade Facial', duration: 5000 },
  { key: 'confidence', label: 'Plano de aumento de confiança', duration: 4000 },
  { key: 'skincare', label: 'Programa de skincare', duration: 3500 },
  { key: 'clothing', label: 'Sugestões de estilo', duration: 3000 },
];

const scanningTexts = [
  'Detectando pontos faciais...',
  'Analisando simetria facial...',
  'Calculando proporções áureas...',
  'Avaliando linha da mandíbula...',
  'Processando qualidade da pele...',
  'Medindo área dos olhos...',
  'Analisando estrutura óssea...',
  'Gerando relatório personalizado...',
];

export function AnalyzingScreen({ frontImage, sideImage, onComplete }: AnalyzingScreenProps) {
  const [stepProgress, setStepProgress] = useState<Record<string, number>>({
    facial: 0,
    confidence: 0,
    skincare: 0,
    clothing: 0,
  });
  const [currentScanText, setCurrentScanText] = useState(0);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  // Fixed metric values (generated once on mount)
  const metricValues = useMemo(() => ({
    symmetry: Math.floor(Math.random() * 25 + 65),
    proportions: Math.floor(Math.random() * 25 + 60),
    structure: Math.floor(Math.random() * 25 + 62),
  }), []);

  // Rotate scanning text
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentScanText((prev) => (prev + 1) % scanningTexts.length);
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  // Animate scan line
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLinePosition((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 40);

    return () => clearInterval(scanInterval);
  }, []);

  // Haptic feedback on start
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  }, []);

  const generateResults = useCallback((): AnalysisResults => {
    const generateScore = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const overallScore = generateScore(45, 75);
    const potential = generateScore(75, 95);

    return {
      overallScore,
      potential,
      features: {
        attractiveness: generateScore(40, 80),
        jawline: generateScore(35, 75),
        skinQuality: generateScore(50, 85),
        symmetry: metricValues.symmetry,
        eyeArea: generateScore(50, 85),
        noseShape: generateScore(45, 80),
        lips: generateScore(50, 80),
        hairline: generateScore(40, 85),
        facialStructure: Math.round(
          (metricValues.symmetry + metricValues.structure + metricValues.proportions) / 3
        ),
      },
      strengths: ['Simetria Facial', 'Área dos Olhos', 'Qualidade da Pele'],
      weaknesses: ['Linha da Mandíbula', 'Lábios', 'Estrutura Óssea'],
      estimatedAge: generateScore(18, 30),
      analysisSummary: `Seu score atual é ${overallScore}, mas sua estrutura indica potencial de chegar a ${potential}. Priorize ajustes em ${['grooming', 'postura', 'skincare'][Math.floor(Math.random() * 3)]} para acelerar esse ganho.`,
    };
  }, [metricValues]);

  // Sequential progress animation
  useEffect(() => {
    let currentStepIndex = 0;
    let stepStartTime = Date.now();
    
    const progressInterval = setInterval(() => {
      if (currentStepIndex >= analysisSteps.length) {
        clearInterval(progressInterval);
        return;
      }

      const currentStep = analysisSteps[currentStepIndex];
      const elapsed = Date.now() - stepStartTime;
      const progress = Math.min(100, (elapsed / currentStep.duration) * 100);

      setStepProgress((prev) => ({
        ...prev,
        [currentStep.key]: progress,
      }));

      // Calculate overall progress
      const completedSteps = currentStepIndex;
      const currentStepContribution = progress / analysisSteps.length;
      const totalProgress = (completedSteps / analysisSteps.length) * 100 + currentStepContribution;
      setOverallProgress(Math.min(100, totalProgress));

      if (progress >= 100) {
        currentStepIndex++;
        stepStartTime = Date.now();
      }
    }, 50);

    // Total duration for all steps
    const totalDuration = analysisSteps.reduce((sum, s) => sum + s.duration, 0);

    const completeTimer = setTimeout(() => {
      clearInterval(progressInterval);
      // Final haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      onComplete(generateResults());
    }, totalDuration + 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete, generateResults]);

  return (
    <div className="flex flex-col items-center min-h-[100dvh] px-5 pt-8 pb-8">
      {/* Photo Preview with Scanner Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <div className="relative">
          {/* Main photo container */}
          <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
            <img
              src={frontImage}
              alt="Analyzing"
              className="w-full h-full object-cover"
            />

            {/* Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Scan line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-primary"
                style={{ 
                  top: `${scanLinePosition}%`,
                  boxShadow: '0 0 15px rgba(255, 77, 77, 0.8), 0 0 30px rgba(255, 77, 77, 0.5)'
                }}
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255, 77, 77, 0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 77, 77, 0.4) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Corner markers */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-primary" />
            </div>
          </div>

          {/* Side photo (if available) */}
          {sideImage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -right-4 top-4 w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl"
            >
              <img
                src={sideImage}
                alt="Side"
                className="w-full h-full object-cover opacity-70"
              />
            </motion.div>
          )}
        </div>

        {/* AI Badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 rounded-full border border-primary/40">
          <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            IA Processando
          </span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl font-bold mb-2 text-center"
      >
        Gerando Seu <span className="text-primary">Relatório</span>
      </motion.h1>

      {/* Dynamic scanning text */}
      <div className="h-6 mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentScanText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-text-secondary text-center"
          >
            {scanningTexts[currentScanText]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Steps - Sequential */}
      <div className="w-full max-w-md space-y-3">
        {analysisSteps.map((step, index) => (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="flex justify-between mb-1">
              <span
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  stepProgress[step.key] > 0 ? 'text-white' : 'text-text-muted'
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  'text-sm font-bold transition-colors duration-300',
                  stepProgress[step.key] >= 100
                    ? 'text-green-400'
                    : stepProgress[step.key] > 0
                    ? 'text-primary'
                    : 'text-text-muted'
                )}
              >
                {Math.round(stepProgress[step.key])}%
              </span>
            </div>
            <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-100',
                  stepProgress[step.key] >= 100
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-primary to-accent'
                )}
                style={{ width: `${stepProgress[step.key]}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics - Synced with overall progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-3 gap-2 w-full max-w-md"
      >
        {[
          { label: 'Simetria', value: metricValues.symmetry },
          { label: 'Proporções', value: metricValues.proportions },
          { label: 'Estrutura', value: metricValues.structure },
        ].map((metric, i) => {
          // Show value based on overall progress
          const displayValue = Math.round((overallProgress / 100) * metric.value);
          
          return (
            <div
              key={metric.label}
              className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.08]"
            >
              <div className={cn(
                'text-lg font-bold transition-colors duration-300',
                overallProgress >= 100 ? 'text-green-400' : 'text-primary'
              )}>
                {displayValue}%
              </div>
              <div className="text-[10px] text-text-muted">{metric.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Fun fact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-auto pt-6 text-center max-w-sm"
      >
        <p className="text-xs text-text-muted">
          <span className="text-primary font-medium">Você sabia?</span> Nossa IA
          analisa mais de 68 pontos faciais para calcular sua pontuação com
          precisão científica.
        </p>
      </motion.div>
    </div>
  );
}
