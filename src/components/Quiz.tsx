import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tracking } from '../lib/tracking';
import { IntroScreen } from './quiz/IntroScreen';
import { GenderSelectScreen } from './quiz/GenderSelectScreen';
import { PersonalityIntroScreen } from './quiz/PersonalityIntroScreen';
import { MaxxingEffectScreen } from './quiz/MaxxingEffectScreen';
import { StatScreen } from './quiz/StatScreen';
import { TestimonialScreen } from './quiz/TestimonialScreen';
import { QuestionScreen } from './quiz/QuestionScreen';
import { SelfieUploadScreen } from './quiz/SelfieUploadScreen';
import { AnalyzingScreen, type AnalysisResults } from './quiz/AnalyzingScreen';
import { UnlockScreen } from './quiz/UnlockScreen';
import { PaywallScreen } from './quiz/PaywallScreen';
import { MissionScreen } from './quiz/MissionScreen';
import { HaircutTransitionScreen } from './quiz/HaircutTransitionScreen';
import { quizQuestions } from '../data/quizData';
import { quizQuestionsFemale } from '../data/quizDataFemale';
import { adaptQuestionByAge } from '../data/quizAgeAdaptations';

const CHECKOUT_URL = 'https://checkout.perfectpay.com.br/pay/PPU38CQ3RIM';

// ═══════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  STATE: 'quiz_state',
  HISTORY: 'quiz_history',
  QUESTION: 'quiz_current_question',
  ANSWERS: 'quiz_answers',
  USER_DATA: 'quiz_user_data',
  FRONT_IMAGE: 'quiz_front_image',
  SIDE_IMAGE: 'quiz_side_image',
  RESULTS: 'quiz_results',
};

export type QuizState = 
  | 'intro'
  | 'gender'
  | 'personality-intro'
  | 'stat-percentage'
  | 'questions'
  | 'maxxing-effect'
  | 'haircut-transition'
  | 'stat-mission'
  | 'testimonial'
  | 'selfie-upload'
  | 'analyzing'
  | 'unlock'
  | 'mission'
  | 'paywall';

export interface UserData {
  name: string;
  email: string;
  age: string;
  gender: string;
}

export interface QuizAnswer {
  questionId: number;
  answerId: number;
  score: number;
}

// ═══════════════════════════════════════════════════════════════
// BACK BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
const BackButton = ({ onClick, className = '', showProgress = false }: { onClick: () => void; className?: string; showProgress?: boolean }) => {
  // Calcular posição baseado na altura da barra de progresso
  // Barra tem: py-3 (12px top + 12px bottom) + h-2 (8px) + mb-2 (8px) + texto (~32px) + mensagem (~20px) + safe-top (~44px no iPhone)
  // Total aproximado: 24 + 8 + 8 + 32 + 20 + 44 = ~136px no mobile com safe-top
  // Sem safe-top: ~92px
  const topPosition = showProgress 
    ? 'top-[120px] sm:top-[100px]' // Reposicionado levemente para baixo para não sobrepor o texto de progresso
    : 'top-3 sm:top-4';
  
  return (
  <motion.button
      initial={false}
      animate={{ opacity: 1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
        fixed ${topPosition} left-3 sm:left-4 z-40
      min-w-[44px] min-h-[44px]
        w-11 h-11
      flex items-center justify-center
      rounded-full
        bg-black/60 backdrop-blur-md
        border border-white/20
        text-white/90 hover:text-white hover:bg-black/80
        active:bg-black/70
        transition-all duration-150
        shadow-lg
        ${showProgress ? '' : 'safe-top'}
      ${className}
    `}
    aria-label="Voltar"
  >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </motion.button>
);
};

// ═══════════════════════════════════════════════════════════════
// TRACKING FUNCTIONS
// ═══════════════════════════════════════════════════════════════
const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
  
  console.log('[Track]', eventName, params);
};

const trackQuizStep = (step: QuizState, direction: 'forward' | 'back') => {
  trackEvent('QuizStep', { 
    step,
    direction,
    timestamp: Date.now()
  });
  
  // Facebook CAPI - ViewContent para cada etapa
  if (direction === 'forward') {
    trackEvent('ViewContent', {
      content_name: `Quiz Step: ${step}`,
      content_category: 'quiz'
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN QUIZ COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Quiz() {
  // ═══ STATE ═══
  const [state, setState] = useState<QuizState>('intro');
  const [stateHistory, setStateHistory] = useState<QuizState[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    age: '',
    gender: '',
  });
  const [frontImage, setFrontImage] = useState<string>('');
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'back'>('forward');

  // ═══ DERIVED STATE ═══
  const isFemale = userData.gender === 'female';
  const currentQuestions = isFemale ? quizQuestionsFemale : quizQuestions;
  
  // Filtrar e adaptar perguntas por idade
  const questionsToShow = useMemo(() => {
    const filtered = currentQuestions.filter((q) => q.id !== 1);
    
    // Se há idade selecionada, adaptar perguntas
    if (userData.age) {
      return filtered.map(q => 
        adaptQuestionByAge(q, userData.age, userData.gender as 'male' | 'female')
      );
    }
    
    return filtered;
  }, [currentQuestions, userData.age, userData.gender]);

  // Aplicar classe de gênero ao body quando o gênero for selecionado
  useEffect(() => {
    if (typeof document !== 'undefined' && userData.gender) {
      document.body.classList.remove('male-mode', 'female-mode');
      document.body.classList.add(`${userData.gender}-mode`);
    }
  }, [userData.gender]);

  // ═══════════════════════════════════════════════════════════════
  // PERSISTENCE - Load from localStorage
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedState = sessionStorage.getItem(STORAGE_KEYS.STATE);
      const savedHistory = sessionStorage.getItem(STORAGE_KEYS.HISTORY);
      const savedQuestion = sessionStorage.getItem(STORAGE_KEYS.QUESTION);
      const savedAnswers = sessionStorage.getItem(STORAGE_KEYS.ANSWERS);
      const savedUserData = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
      const savedFrontImage = sessionStorage.getItem(STORAGE_KEYS.FRONT_IMAGE);
      const savedSideImage = sessionStorage.getItem(STORAGE_KEYS.SIDE_IMAGE);
      const savedResults = sessionStorage.getItem(STORAGE_KEYS.RESULTS);

      if (savedState) setState(savedState as QuizState);
      if (savedHistory) setStateHistory(JSON.parse(savedHistory));
      if (savedQuestion) setCurrentQuestion(parseInt(savedQuestion, 10));
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
        // Restaurar classe de gênero no body
        if (parsedUserData.gender && typeof document !== 'undefined') {
          document.body.classList.remove('male-mode', 'female-mode');
          document.body.classList.add(`${parsedUserData.gender}-mode`);
        }
      }
      if (savedFrontImage) setFrontImage(savedFrontImage);
      if (savedSideImage) setSideImage(savedSideImage);
      if (savedResults) setAnalysisResults(JSON.parse(savedResults));

      console.log('[Quiz] Restored from session:', { savedState, savedQuestion });
    } catch (error) {
      console.error('[Quiz] Error restoring session:', error);
    }
    
    setIsInitialized(true);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // PERSISTENCE - Save to localStorage
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(STORAGE_KEYS.STATE, state);
      sessionStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(stateHistory));
      sessionStorage.setItem(STORAGE_KEYS.QUESTION, currentQuestion.toString());
      sessionStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
      sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      if (frontImage) sessionStorage.setItem(STORAGE_KEYS.FRONT_IMAGE, frontImage);
      if (sideImage) sessionStorage.setItem(STORAGE_KEYS.SIDE_IMAGE, sideImage);
      if (analysisResults) sessionStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(analysisResults));
    } catch (error) {
      console.error('[Quiz] Error saving session:', error);
    }
  }, [state, stateHistory, currentQuestion, answers, userData, frontImage, sideImage, analysisResults, isInitialized]);

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION - Go to next state
  // ═══════════════════════════════════════════════════════════════
  const goToState = useCallback((newState: QuizState) => {
    setNavigationDirection('forward');
    setStateHistory(prev => [...prev, state]);
    setState(newState);
    trackQuizStep(newState, 'forward');
  }, [state]);

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION - Go back (CORRIGIDO: não reinicia o quiz)
  // ═══════════════════════════════════════════════════════════════
  const handleBack = useCallback(() => {
    // Vibrate feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    setNavigationDirection('back');

    // Se estamos em uma pergunta, voltar para a pergunta anterior
    if (state === 'questions' && currentQuestion > 0) {
      // Remove a última resposta
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestion(prev => prev - 1);
      trackEvent('QuizBackClick', { from: 'questions', questionIndex: currentQuestion });
      return;
    }

    // Mapeamento de estados para voltar corretamente
    const stateBackMap: Record<QuizState, QuizState | null> = {
      'intro': null,
      'gender': 'intro',
      'personality-intro': 'gender',
      'maxxing-effect': 'questions', // Volta para a última pergunta
      'stat-percentage': null,
      'questions': 'personality-intro', // Se for a primeira pergunta, volta para personality-intro
      'haircut-transition': 'questions',
      'stat-mission': 'questions',
      'testimonial': 'questions',
      'selfie-upload': 'testimonial',
      'analyzing': 'selfie-upload',
      'unlock': 'analyzing',
      'mission': 'unlock',
      'paywall': 'mission',
    };

    // Se temos histórico, voltar para o estado anterior
    if (stateHistory.length > 0) {
      const newHistory = [...stateHistory];
      const previousState = newHistory.pop()!;
      
      setStateHistory(newHistory);
      setState(previousState);
      
      // Se voltando para questions, ajustar o índice da pergunta baseado nas respostas
      if (previousState === 'questions') {
        // Volta para a última pergunta respondida (não reinicia)
        const lastAnswerIndex = Math.max(0, answers.length - 1);
          setCurrentQuestion(lastAnswerIndex);
      }

      trackEvent('QuizBackClick', { from: state, to: previousState });
      trackQuizStep(previousState, 'back');
      return;
    }

    // Fallback: usar mapeamento direto se não houver histórico
    const backState = stateBackMap[state];
    if (backState) {
      if (backState === 'questions') {
        // Ajustar índice da pergunta
        const lastAnswerIndex = Math.max(0, answers.length - 1);
        setCurrentQuestion(lastAnswerIndex);
      }
      setState(backState);
      trackEvent('QuizBackClick', { from: state, to: backState });
    }
  }, [state, stateHistory, currentQuestion, answers]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════
  const handleGenderSelect = (gender: 'male' | 'female') => {
    setUserData(prev => ({ ...prev, gender }));
    trackEvent('CustomEvent', { content_name: 'Gender Selected', gender });
    
    // Adicionar classe global ao body para diferenciação por gênero
    if (typeof document !== 'undefined') {
      document.body.classList.remove('male-mode', 'female-mode');
      document.body.classList.add(`${gender}-mode`);
    }
    
    // Track GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quiz_started', {
        event_category: 'Quiz',
        event_label: 'Quiz Started',
        gender,
      });
    }
    goToState('personality-intro');
  };

  const handleAnswer = (answerId: number, score: number) => {
    const currentQ = questionsToShow[currentQuestion];
    const newAnswer: QuizAnswer = {
      questionId: currentQ.id,
      answerId,
      score,
    };
    
    // Capturar idade quando pergunta 2 (faixa de idade) for respondida
    if (currentQ.id === 2) {
      const selectedOption = currentQ.options.find(opt => opt.id === answerId);
      if (selectedOption) {
        setUserData(prev => ({ ...prev, age: selectedOption.text }));
      }
    }
    
    setAnswers(prev => [...prev, newAnswer]);
    setQuestionHistory(prev => [...prev, currentQuestion]);
    setNavigationDirection('forward');
    
    // Track GA4 - Quiz step completed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quiz_step_completed', {
        event_category: 'Quiz',
        event_label: `Question ${currentQuestion + 1}`,
        value: currentQuestion + 1,
      });
    }
    
    const nextQuestion = currentQuestion + 1;
    
    // Insert transition/stat screens between questions
    if (currentQuestion === 1) {
      // Show Maxxing Effect after 2 questions (index 0 and 1)
      goToState('maxxing-effect');
    } else if (currentQuestion === 2) {
      goToState('haircut-transition');
    } else if (currentQuestion === 5) {
      goToState('stat-mission');
    } else if (nextQuestion >= questionsToShow.length) {
      // Track quiz completed
      tracking.quizComplete({ 
        total_questions: questionsToShow.length,
        answers_count: answers.length,
      });
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quiz_completed', {
          event_category: 'Quiz',
          event_label: 'Quiz Completed',
        });
      }
      goToState('testimonial');
    } else {
      setCurrentQuestion(nextQuestion);
      trackQuizStep('questions', 'forward');
    }
  };


  const handleSelfieComplete = (front: string, side: string | null) => {
    setFrontImage(front);
    setSideImage(side);
    trackEvent('CustomEvent', { content_name: 'Selfie Uploaded' });
    goToState('stat-percentage');
  };

  const handleAnalysisComplete = (results: AnalysisResults) => {
    setAnalysisResults(results);
    trackEvent('CustomEvent', { 
      content_name: 'Analysis Complete',
      value: results.overallScore,
    });
    goToState('unlock');
  };

  const handleUnlock = () => {
    trackEvent('CustomEvent', { 
      content_name: 'Unlock Button Clicked',
      value: analysisResults?.overallScore,
    });
    goToState('mission');
  };

  const handleMissionContinue = () => {
    trackEvent('CustomEvent', { 
      content_name: 'Mission Screen Continue',
      value: analysisResults?.overallScore,
    });
    // Track GA4 - Paywall viewed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'paywall_viewed', {
        event_category: 'Conversion',
        event_label: 'Paywall Viewed',
        value: analysisResults?.overallScore,
      });
    }
    goToState('paywall');
  };

  const handlePurchase = () => {
    trackEvent('InitiateCheckout', { 
      content_name: 'CTA Clicked - Redirecting to Checkout',
      value: analysisResults?.overallScore,
    });
    // Track GA4 - Checkout initiated
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'checkout_initiated', {
        event_category: 'Conversion',
        event_label: 'Checkout Initiated',
        value: analysisResults?.overallScore,
      });
    }
    // Clear session on purchase
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
    window.location.href = CHECKOUT_URL;
  };

  const showBackButton = state !== 'intro' && state !== 'personality-intro' && state !== 'analyzing' && state !== 'paywall' && state !== 'mission';
  const canGoBack = stateHistory.length > 0 || (state === 'questions' && currentQuestion > 0);

  // Animation variants based on direction - Melhorado para transições suaves
  const slideVariants = {
    enter: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? -30 : 30,
      opacity: 0,
    }),
  };

  // Configuração de transição padronizada e suave
  const transitionConfig = {
    type: 'tween' as const,
    ease: [0.4, 0, 0.2, 1], // ease-in-out-cubic
    duration: 0.4, // Transição mais suave
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background overflow-x-hidden">
      {/* Back Button */}
      {showBackButton && canGoBack && (
        <BackButton onClick={handleBack} showProgress={false} />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait" custom={navigationDirection} initial={false}>
          {state === 'intro' && (
            <motion.div
              key="intro"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <IntroScreen onContinue={() => goToState('gender')} />
            </motion.div>
          )}

          {state === 'gender' && (
            <motion.div
              key="gender"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <GenderSelectScreen onSelect={handleGenderSelect} onBack={handleBack} />
            </motion.div>
          )}

          {state === 'personality-intro' && (
            <motion.div
              key="personality-intro"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <PersonalityIntroScreen onContinue={() => goToState('selfie-upload')} />
            </motion.div>
          )}

          {state === 'stat-percentage' && (
            <motion.div
              key="stat-percentage"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <StatScreen 
                type="percentage" 
                gender={userData.gender as 'male' | 'female'}
                onContinue={() => {
                  setCurrentQuestion(0);
                  goToState('questions');
                }} 
              />
            </motion.div>
          )}

          {state === 'questions' && (
            <motion.div
              key={`question-${currentQuestion}`}
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="pt-8 px-4"
            >
              <QuestionScreen
                question={questionsToShow[currentQuestion]}
                questionNumber={currentQuestion + 1}
                totalQuestions={questionsToShow.length}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}

          {state === 'maxxing-effect' && (
            <motion.div
              key="maxxing-effect"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <MaxxingEffectScreen 
                onContinue={() => {
                  setCurrentQuestion(currentQuestion + 1);
                  goToState('questions');
                }} 
              />
            </motion.div>
          )}

          {state === 'haircut-transition' && (
            <motion.div
              key="haircut-transition"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <HaircutTransitionScreen 
                gender={userData.gender as 'male' | 'female'}
                onContinue={() => {
                  setCurrentQuestion(currentQuestion + 1);
                  goToState('questions');
                }} 
              />
            </motion.div>
          )}

          {state === 'stat-mission' && (
            <motion.div
              key="stat-mission"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <StatScreen 
                type="mission" 
                gender={userData.gender as 'male' | 'female'}
                onContinue={() => {
                  setCurrentQuestion(currentQuestion + 1);
                  goToState('questions');
                }} 
              />
            </motion.div>
          )}

          {state === 'testimonial' && (
            <motion.div
              key="testimonial"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <TestimonialScreen
                selectedAge={userData.age}
                gender={userData.gender as 'male' | 'female'}
                onContinue={() => goToState('analyzing')}
              />
            </motion.div>
          )}

          {state === 'selfie-upload' && (
            <motion.div
              key="selfie-upload"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <SelfieUploadScreen onComplete={handleSelfieComplete} gender={userData.gender as 'male' | 'female'} />
            </motion.div>
          )}

          {state === 'analyzing' && frontImage && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyzingScreen 
                frontImage={frontImage}
                sideImage={sideImage}
                onComplete={handleAnalysisComplete}
              />
            </motion.div>
          )}

          {state === 'unlock' && analysisResults && (
            <motion.div
              key="unlock"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <UnlockScreen 
                results={analysisResults}
                onUnlock={handleUnlock}
              />
            </motion.div>
          )}

          {state === 'mission' && (
            <motion.div
              key="mission"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <MissionScreen 
                onContinue={handleMissionContinue}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {state === 'paywall' && analysisResults && (
            <motion.div
              key="paywall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PaywallScreen 
                results={analysisResults}
                userPhoto={frontImage}
                onPurchase={handlePurchase}
              />
              <div>
                {/* Add your content here */}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
