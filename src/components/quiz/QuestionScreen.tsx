import { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../../data/quizData';
import { cn } from '../../lib/utils';

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

  const handleOptionClick = (optionId: number, score: number) => {
    if (isTransitioning) return;
    
    setSelectedOption(optionId);
    setIsTransitioning(true);
    
    // Haptic feedback on mobile (if supported)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Delay to show selection animation
    setTimeout(() => {
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[32px] bg-gradient-to-b from-[#130F0F] via-[#1B1311] to-[#0A090B] border border-white/5 px-6 py-6 md:px-10 md:py-8 text-center shadow-[0_20px_120px_rgba(0,0,0,0.45)]"
      >
        <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF9553] via-[#FF4D4D] to-[#FF9553]"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold font-display mb-2 text-white leading-tight">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto">
            {question.subtitle}
          </p>
        )}
      </motion.div>

      {/* Options */}
      {isImageGrid ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 mt-6"
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
                  <picture>
                    <source 
                      srcSet={`${option.image.replace(/\.(jpg|jpeg|png)$/i, '-480w.avif')} 480w, ${option.image.replace(/\.(jpg|jpeg|png)$/i, '-768w.avif')} 768w`}
                      type="image/avif"
                      sizes="(max-width: 640px) 50vw, 300px"
                    />
                    <source 
                      srcSet={`${option.image.replace(/\.(jpg|jpeg|png)$/i, '-480w.webp')} 480w, ${option.image.replace(/\.(jpg|jpeg|png)$/i, '-768w.webp')} 768w`}
                      type="image/webp"
                      sizes="(max-width: 640px) 50vw, 300px"
                    />
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
                        // Fallback para imagem original se WebP/AVIF falhar
                        const target = e.currentTarget;
                        if (target.src !== option.image) {
                          target.src = option.image;
                        }
                    }}
                  />
                  </picture>
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
          className="space-y-2.5 md:space-y-3"
        >
          {question.options.map((option, index) => (
            <motion.button
              key={option.id}
              variants={optionVariants}
              onClick={() => handleOptionClick(option.id, option.score)}
              disabled={isTransitioning}
              className={cn(
                "quiz-option flex items-center gap-3 md:gap-4",
                "min-h-[44px] py-3 px-4 touch-manipulation",
                selectedOption === option.id && "selected"
              )}
            >
              {/* Option Letter */}
              <span
                className={cn(
                  "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center",
                  "font-bold text-xs md:text-sm transition-all duration-200",
                  selectedOption === option.id
                    ? "bg-primary text-white scale-110"
                    : "bg-white/[0.06] text-text-secondary"
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>

              {/* Option Content */}
              <div className="flex-1 flex items-center gap-2 md:gap-3 min-w-0">
                {option.icon && (
                  <span className="text-lg md:text-xl flex-shrink-0">{option.icon}</span>
                )}
                <span className="text-sm md:text-base font-medium text-white truncate">
                  {option.text}
                </span>
              </div>

              {/* Selection Indicator */}
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center",
                  "transition-all duration-200",
                  selectedOption === option.id
                    ? "border-primary bg-primary scale-110"
                    : "border-white/20"
                )}
              >
                {selectedOption === option.id && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 text-white"
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
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Progress Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 md:mt-8"
      >
        <p className="text-xs md:text-sm text-text-muted">
          Toque para selecionar sua resposta
        </p>
      </motion.div>
    </div>
  );
}
