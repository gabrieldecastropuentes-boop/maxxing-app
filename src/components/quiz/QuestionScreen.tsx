import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../../data/quizData';
import { cn } from '../../lib/utils';
import { tracking } from '../../lib/tracking';

interface QuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: number, score: number) => void;
}

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionScreenProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track quiz step view
  useEffect(() => {
    tracking.quizStepView(questionNumber, question.id.toString());
  }, [questionNumber, question.id]);

  const handleOptionClick = (optionId: number, score: number) => {
    if (isTransitioning) {
      console.log('[QuestionScreen] Already transitioning, ignoring click');
      return;
    }
    
    console.log('[QuestionScreen] Option clicked:', { optionId, score });
    setSelectedOption(optionId);
    setIsTransitioning(true);
    
    // Track answer selection
    tracking.quizAnswerSelect(questionNumber, optionId);
    
    // Haptic feedback on mobile (if supported)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Delay to show selection animation
    setTimeout(() => {
      console.log('[QuestionScreen] Calling onAnswer after delay:', { optionId, score });
      onAnswer(optionId, score);
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 350);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const isImageGrid = question.type === 'image' || question.type === 'grid';
  const isBodyTypeQuestion = question.id === 3;

  const progress = ((questionNumber / totalQuestions) * 100);

  return (
    <div className="quiz-screen min-h-screen bg-[#0A0A0A] text-white flex flex-col p-6">
      {/* Header com Barra de Progresso Melhorada */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">
            Pergunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-sm font-bold text-[#FF4D4D]">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] rounded-full"
          />
        </div>
      </div>

      {/* Pergunta - ESPAÇAMENTO AUMENTADO (mb-20) */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-sm border border-white/20 shadow-2xl p-6 md:p-8"
        >
          {/* Badge de Número */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D4D]/20 border border-[#FF4D4D]/40 mb-4">
            <svg className="w-4 h-4 text-[#FF4D4D]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-[#FF4D4D]">PERGUNTA {questionNumber}/{totalQuestions}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {question.subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Options */}
      {isImageGrid ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5"
        >
          {question.options.map((option, index) => (
            <motion.button
              key={option.id}
              variants={optionVariants}
              onClick={() => handleOptionClick(option.id, option.score)}
              disabled={isTransitioning}
              className={cn(
                "relative rounded-[28px] overflow-hidden text-left group transition-all",
                "bg-[#0E0E11] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.45)]",
                "min-h-[200px] touch-manipulation",
                selectedOption === option.id && "border-white/40 shadow-[0_20px_60px_rgba(255,77,77,0.35)]"
              )}
            >
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-b from-[#1F1C1A] to-[#0F0F13]">
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.text}
                    className="w-full h-full object-cover object-center sm:group-hover:scale-[1.04] transition-transform duration-300"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      contentVisibility: 'auto',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      console.error('[QuestionScreen] Image load error:', option.image);
                      // Mostrar placeholder em caso de erro
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm md:text-base font-semibold text-white tracking-tight">
                  {option.text}
                </span>
                <span
                  className={cn(
                    "w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold",
                    selectedOption === option.id
                      ? "bg-white text-black border-white"
                      : "bg-transparent border-white/30 text-white/70"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-4"
        >
          {question.options.map((option, index) => (
            <motion.button
              key={option.id}
              variants={optionVariants}
              onClick={() => handleOptionClick(option.id, option.score)}
              disabled={isTransitioning}
              className={cn(
                "group w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02]",
                "bg-white/5 backdrop-blur-sm",
                selectedOption === option.id
                  ? "border-[#FF4D4D] bg-[#FF4D4D]/10 shadow-xl shadow-[#FF4D4D]/30"
                  : "border-white/20 hover:border-white/40 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Option Letter - Melhorado */}
                <div className={cn(
                  "flex-shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-lg transition-all",
                  selectedOption === option.id
                    ? "bg-[#FF4D4D] border-[#FF4D4D] scale-110"
                    : "bg-white/10 border-white/20 group-hover:border-[#FF4D4D] group-hover:bg-[#FF4D4D]"
                )}>
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Content */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  {option.icon && (
                    <span className="text-xl flex-shrink-0">{option.icon}</span>
                  )}
                  <span className="text-base sm:text-lg font-semibold group-hover:text-[#FF4D4D] transition-colors">
                    {option.text}
                  </span>
                </div>

                {/* Seta ou Checkmark */}
                {selectedOption === option.id ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF4D4D] flex items-center justify-center shadow-lg">
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </div>
                ) : (
                  <svg 
                    className="w-6 h-6 text-gray-600 group-hover:text-[#FF4D4D] group-hover:translate-x-1 transition-all flex-shrink-0"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Progress Hint - Copy Envolvente */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 md:mt-8"
      >
        <p className="text-xs md:text-sm text-gray-400">
          {progress < 25 
            ? '✨ Você está indo muito bem! Continue assim.'
            : progress < 50
            ? '🎯 Ótimo progresso! Você está no caminho certo.'
            : progress < 75
            ? '🔥 Quase na metade! Mantenha o foco.'
            : progress < 90
            ? '💪 Excelente! Você está quase terminando!'
            : '🚀 Últimas perguntas! Você consegue!'
          }
        </p>
      </motion.div>
    </div>
  );
}
