import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroScreen } from './quiz/IntroScreen';
import { GenderSelectScreen } from './quiz/GenderSelectScreen';
import { PersonalityIntroScreen } from './quiz/PersonalityIntroScreen';
import { MaxxingEffectScreen } from './quiz/MaxxingEffectScreen';
import { QuizProgressBar } from './quiz/QuizProgressBar';
import { StatScreen } from './quiz/StatScreen';
import { TestimonialScreen } from './quiz/TestimonialScreen';
import { QuestionScreen } from './quiz/QuestionScreen';
import { DataCollectionScreen } from './quiz/DataCollectionScreen';
import { SelfieUploadScreen } from './quiz/SelfieUploadScreen';
import { AnalyzingScreen, type AnalysisResults } from './quiz/AnalyzingScreen';
import { UnlockScreen } from './quiz/UnlockScreen';
import { PaywallScreen } from './quiz/PaywallScreen';
import { HaircutTransitionScreen } from './quiz/HaircutTransitionScreen';
import { SocialProofTransitionScreen } from './quiz/SocialProofTransitionScreen';
import { quizQuestions } from '../data/quizData';
import { quizQuestionsFemale } from '../data/quizDataFemale';

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
  TIMESTAMP: 'quiz_timestamp', // Para validar se o progresso ainda é válido
};

// Função helper para salvar em localStorage (persistente) e sessionStorage (backup)
const saveToStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`[Quiz] Error saving to storage (${key}):`, error);
  }
};

// Função helper para carregar de localStorage ou sessionStorage
const loadFromStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    // Tentar localStorage primeiro (persistente)
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    
    // Fallback para sessionStorage
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue) {
      // Sincronizar com localStorage para próximas vezes
      localStorage.setItem(key, sessionValue);
      return sessionValue;
    }
    
    return null;
  } catch (error) {
    console.error(`[Quiz] Error loading from storage (${key}):`, error);
    return null;
  }
};

// Limpar storage (útil para resetar)
const clearQuizStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error('[Quiz] Error clearing storage:', error);
  }
};

export type QuizState = 
  | 'intro'
  | 'gender'
  | 'personality-intro'
  | 'stat-percentage'
  | 'questions'
  | 'social-proof-transition'
  | 'maxxing-effect'
  | 'haircut-transition'
  | 'stat-mission'
  | 'testimonial'
  | 'data-collection'
  | 'selfie-upload'
  | 'analyzing'
  | 'unlock'
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
  // ═══ STATE - Todos os hooks no topo, na ordem correta ═══
  const [stateRaw, setStateRaw] = useState<QuizState>('intro');
  const [navigationHistory, setNavigationHistory] = useState<Array<{ state: QuizState; questionIndex: number }>>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
  const [isNavigating, setIsNavigating] = useState(false); // Flag para prevenir navegação automática
  
  // ═══ FLAG DE INICIALIZAÇÃO ÚNICA ═══
  const hasInitialized = useRef(false);
  
  // ═══ FUNÇÃO WRAPPER PARA MUDANÇAS DE ESTADO SEGURAS ═══
  const safeSetState = useCallback((newState: QuizState, source: string = 'unknown') => {
    console.log('[Quiz] State change:', { 
      from: stateRaw, 
      to: newState, 
      source 
    });
    
    // BLOQUEAR mudanças automáticas de 'intro'
    if (stateRaw === 'intro' && newState !== 'intro') {
      if (source !== 'user-action') {
        console.warn('[Quiz] ⚠️ BLOCKED: Auto-navigation from intro blocked. Source:', source);
        console.trace('[Quiz] Stack trace - who is trying to change state?');
        return;
      }
    }
    
    setStateRaw(newState);
    
    // Atualizar URL hash
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}#${newState}`;
      window.history.replaceState(null, '', newUrl);
      
      // Salvar estado no localStorage (exceto se for intro)
      if (newState !== 'intro') {
        saveToStorage(STORAGE_KEYS.STATE, newState);
      }
    }
  }, [stateRaw]);
  
  // Alias para compatibilidade
  const setState = safeSetState;
  
  // Alias para compatibilidade com código existente
  const state = stateRaw;

  // ═══ DERIVED STATE ═══
  const isFemale = userData.gender === 'female';
  const currentQuestions = isFemale ? quizQuestionsFemale : quizQuestions;
  const questionsToShow = currentQuestions.filter((q) => q.id !== 1);

  // ═══════════════════════════════════════════════════════════════
  // PERSISTENCE - Load from localStorage
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    // Prevenir execução múltipla
    if (hasInitialized.current || typeof window === 'undefined') {
      console.log('[Quiz] Already initialized, skipping');
      return;
    }
    
    hasInitialized.current = true;
    
    const hash = window.location.hash.slice(1);
    
    console.log('[Quiz] Initialization', { 
      hash, 
      hasHash: !!hash,
      currentState: stateRaw 
    });

    // CASO 1: URL COM HASH (ex: /quiz#stat-percentage)
    // = Usuário quer CONTINUAR de onde parou
    if (hash && hash !== 'intro') {
      console.log('[Quiz] Hash detected - restoring:', hash);
      
      const savedState = loadFromStorage(STORAGE_KEYS.STATE);
      const savedHistory = loadFromStorage(STORAGE_KEYS.HISTORY);
      const savedQuestion = loadFromStorage(STORAGE_KEYS.QUESTION);
      const savedAnswers = loadFromStorage(STORAGE_KEYS.ANSWERS);
      const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA);
      const savedFrontImage = loadFromStorage(STORAGE_KEYS.FRONT_IMAGE);
      const savedSideImage = loadFromStorage(STORAGE_KEYS.SIDE_IMAGE);
      const savedResults = loadFromStorage(STORAGE_KEYS.RESULTS);
      const savedTimestamp = loadFromStorage(STORAGE_KEYS.TIMESTAMP);
      
      if (savedState || savedUserData || savedFrontImage) {
        try {
          console.log('[Quiz] Restoring saved data:', { savedState, hasUserData: !!savedUserData, hasImages: !!(savedFrontImage || savedSideImage) });
          
          // Restaurar dados
          let parsedUserData: UserData | null = null;
          if (savedUserData) {
            try {
              parsedUserData = JSON.parse(savedUserData);
              setUserData(parsedUserData);
            } catch (e) {
              console.error('[Quiz] Error parsing user data:', e);
            }
          }
          
          if (savedAnswers) {
            try {
              const parsedAnswers = JSON.parse(savedAnswers);
              if (Array.isArray(parsedAnswers)) {
                setAnswers(parsedAnswers);
              }
            } catch (e) {
              console.error('[Quiz] Error parsing answers:', e);
            }
          }
          
          if (savedQuestion !== null) {
            const questionIndex = parseInt(savedQuestion, 10);
            if (!isNaN(questionIndex)) {
              setCurrentQuestion(questionIndex);
            }
          }
          
          if (savedFrontImage) setFrontImage(savedFrontImage);
          if (savedSideImage) setSideImage(savedSideImage);
          if (savedResults) {
            try {
              setAnalysisResults(JSON.parse(savedResults));
            } catch (e) {
              console.error('[Quiz] Error parsing results:', e);
            }
          }
          
          if (savedHistory) {
            try {
              const parsedHistory = JSON.parse(savedHistory);
              if (Array.isArray(parsedHistory)) {
                setNavigationHistory(parsedHistory);
              }
            } catch (e) {
              console.error('[Quiz] Error parsing history:', e);
            }
          }
          
          // Restaurar estado
          const validStates: QuizState[] = [
            'intro', 'gender', 'personality-intro', 'stat-percentage',
            'questions', 'social-proof-transition', 'maxxing-effect',
            'haircut-transition', 'stat-mission', 'testimonial',
            'data-collection', 'selfie-upload', 'analyzing', 'unlock', 'paywall'
          ];
          
          if (validStates.includes(hash as QuizState)) {
            setStateRaw(hash as QuizState);
          } else if (savedState && validStates.includes(savedState as QuizState)) {
            setStateRaw(savedState as QuizState);
          } else {
            setStateRaw('intro');
          }
          
          setIsInitialized(true);
          return;
        } catch (e) {
          console.error('[Quiz] Error parsing saved data:', e);
        }
      }
      
      console.warn('[Quiz] Hash present but no saved data - starting fresh');
    }
    
    // CASO 2: SEM HASH ou hash='intro'
    // = NOVO INÍCIO - limpar tudo
    console.log('[Quiz] NEW START - Clearing all data');
    
    // LIMPAR TODO O LOCALSTORAGE DO QUIZ
    clearQuizStorage();
    
    // FORÇAR estado inicial
    setStateRaw('intro');
    setNavigationHistory([]);
    
    // Limpar hash da URL se existir
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    setIsInitialized(true);
  }, []); // IMPORTANTE: array vazio = executa só na montagem

  // ═══════════════════════════════════════════════════════════════
  // PERSISTENCE - Save to localStorage (persistente mesmo após reload)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const saveProgress = () => {
      try {
        // Salvar tudo em localStorage (persistente) usando as funções helper
        saveToStorage(STORAGE_KEYS.STATE, state);
        saveToStorage(STORAGE_KEYS.HISTORY, JSON.stringify(navigationHistory));
        saveToStorage(STORAGE_KEYS.QUESTION, currentQuestion.toString());
        saveToStorage(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
        saveToStorage(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        
        if (frontImage) saveToStorage(STORAGE_KEYS.FRONT_IMAGE, frontImage);
        if (sideImage) saveToStorage(STORAGE_KEYS.SIDE_IMAGE, sideImage);
        if (analysisResults) saveToStorage(STORAGE_KEYS.RESULTS, JSON.stringify(analysisResults));
      } catch (error) {
        console.error('[Quiz] Error saving progress:', error);
      }
    };

    // Salvar imediatamente
    saveProgress();

    // Salvar antes de recarregar/fechar a página
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Salvar periodicamente como backup (a cada 10 segundos)
    const intervalId = setInterval(saveProgress, 10000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(intervalId);
      // Salvar uma última vez ao desmontar
      saveProgress();
    };
  }, [state, navigationHistory, currentQuestion, answers, userData, frontImage, sideImage, analysisResults, isInitialized]);

  // ═══ EFFECT: Aplicar classe de gênero ao body ═══
  useEffect(() => {
    if (typeof document !== 'undefined' && userData.gender) {
      document.body.classList.remove('male-mode', 'female-mode');
      document.body.classList.add(`${userData.gender}-mode`);
    }
  }, [userData.gender]);

  // ═══ EFFECT: Atualizar URL sem recarregar página (evitar erro na URL) ═══
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    // PROTEÇÃO: Se estamos em intro, limpar hash da URL para garantir novo início
    if (state === 'intro') {
      if (window.location.hash && window.location.hash !== '#intro') {
        console.log('[Quiz] Clearing URL hash for intro screen');
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }
    
    try {
      // Atualizar URL sem recarregar a página
      const newUrl = `${window.location.pathname}#${state}`;
      if (window.location.hash !== `#${state}`) {
        window.history.replaceState(
          { ...window.history.state, state },
          '',
          newUrl
        );
      }
    } catch (error) {
      // Ignorar erros de history API em alguns navegadores
      console.warn('[Quiz] Could not update URL:', error);
    }
  }, [state, isInitialized]);


  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION - Go to next state
  // ═══════════════════════════════════════════════════════════════
  const goToState = useCallback((newState: QuizState, questionIndex: number = currentQuestion, isUserAction: boolean = false) => {
    console.log('[Quiz] goToState called - from:', stateRaw, 'to:', newState, '- Initialized:', isInitialized, '- isUserAction:', isUserAction);
    console.trace('[Quiz] Stack trace for goToState call'); // Sempre mostrar stack trace para debug
    
    // PROTEÇÃO CRÍTICA: Se estamos em 'intro', só permitir navegação se for ação do usuário
    if (stateRaw === 'intro') {
      if (!isUserAction) {
        console.error('[Quiz] ❌❌❌ BLOCKED: Navigation from intro blocked - not a user action!');
        console.error('[Quiz] Only user clicks should navigate from intro screen!');
        console.trace('[Quiz] Stack trace - who is calling goToState?');
        return;
      }
      if (!isInitialized) {
        console.error('[Quiz] ❌ BLOCKED: Navigation from intro blocked - not initialized!');
        return;
      }
      console.log('[Quiz] ✅ Navigation from intro allowed - user clicked button');
    }
    
    // Proteger contra múltiplas navegações simultâneas
    if (isNavigating) {
      console.warn('[Quiz] BLOCKED: Already navigating, ignoring duplicate call');
      return;
    }
    
    setIsNavigating(true);
    console.log('[Quiz] ✅ Navigation allowed - proceeding');
    setNavigationDirection('forward');
    // Salvar estado atual no histórico antes de mudar
    setNavigationHistory(prev => [...prev, { 
      state: stateRaw, 
      questionIndex: stateRaw === 'questions' ? currentQuestion : questionIndex 
    }]);
    // IMPORTANTE: Usar safeSetState com source apropriado
    const source = isUserAction ? 'user-action' : 'system';
    safeSetState(newState, source);
    trackQuizStep(newState, 'forward');
    
    // Resetar flag após um delay
    setTimeout(() => setIsNavigating(false), 500);
  }, [stateRaw, currentQuestion, isInitialized, isNavigating]);

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION - Go back (CORRIGIDO: melhor tratamento de erros)
  // ═══════════════════════════════════════════════════════════════
  const handleBack = useCallback(() => {
    try {
      // Vibrate feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }

      setNavigationDirection('back');

      // Se estamos em uma pergunta, voltar para a pergunta anterior ou tela anterior
      if (state === 'questions') {
        if (currentQuestion > 0) {
          // Voltar para pergunta anterior dentro do quiz
          const newAnswers = answers.slice(0, -1);
          setAnswers(newAnswers);
          const prevQuestion = currentQuestion - 1;
          setCurrentQuestion(prevQuestion);
          trackEvent('QuizBackClick', { from: 'questions', questionIndex: currentQuestion, toQuestionIndex: prevQuestion });
          return;
        } else {
          // Primeira pergunta (index 0) - usar histórico ou fallback
          if (navigationHistory.length > 0) {
            const newHistory = [...navigationHistory];
            const previous = newHistory.pop()!;
            setNavigationHistory(newHistory);
            setState(previous.state);
            setCurrentQuestion(previous.questionIndex);
            trackEvent('QuizBackClick', { from: 'questions', to: previous.state });
            trackQuizStep(previous.state, 'back');
            return;
          }
          // Fallback: voltar para stat-percentage se disponível
          if (frontImage) {
            setState('stat-percentage');
            setCurrentQuestion(0);
            trackEvent('QuizBackClick', { from: 'questions', to: 'stat-percentage' });
            trackQuizStep('stat-percentage', 'back');
            return;
          }
          // Último fallback: personality-intro
          setState('personality-intro');
          setCurrentQuestion(0);
          trackEvent('QuizBackClick', { from: 'questions', to: 'personality-intro' });
          trackQuizStep('personality-intro', 'back');
          return;
        }
      }

      // Usar histórico de navegação se disponível
      if (navigationHistory.length > 0) {
        const newHistory = [...navigationHistory];
        const previous = newHistory.pop()!;
        
        setNavigationHistory(newHistory);
        setState(previous.state);
        setCurrentQuestion(previous.questionIndex);
        
        // Se voltando para questions e temos respostas, garantir índice correto
        if (previous.state === 'questions') {
          const correctIndex = Math.min(previous.questionIndex, answers.length);
          setCurrentQuestion(correctIndex);
        }

        trackEvent('QuizBackClick', { from: state, to: previous.state });
        trackQuizStep(previous.state, 'back');
        return;
      }

      // Fallback: mapeamento direto para estados iniciais
      const stateBackMap: Record<QuizState, QuizState | null> = {
        'intro': null,
        'gender': 'intro',
        'personality-intro': 'gender',
        'stat-percentage': 'selfie-upload',
        'questions': 'stat-percentage',
        'social-proof-transition': 'questions',
        'maxxing-effect': 'questions',
        'haircut-transition': 'questions',
        'stat-mission': 'questions',
        'testimonial': 'questions',
        'data-collection': 'testimonial',
        'selfie-upload': 'personality-intro',
        'analyzing': 'data-collection',
        'unlock': 'analyzing',
        'paywall': 'unlock',
      };

      const backState = stateBackMap[state];
      if (backState) {
        if (backState === 'questions') {
          const lastAnswerIndex = Math.max(0, answers.length - 1);
          setCurrentQuestion(lastAnswerIndex);
        }
        setState(backState);
        trackEvent('QuizBackClick', { from: state, to: backState });
        trackQuizStep(backState, 'back');
      }
    } catch (error) {
      console.error('[Quiz] Error in handleBack:', error);
      // Fallback seguro: voltar para intro se houver erro
      if (state !== 'intro') {
        setState('intro');
        setNavigationHistory([]);
      }
    }
  }, [state, navigationHistory, currentQuestion, answers, frontImage]);

  // ═══ EFFECT: Prevenir navegação do navegador ao usar botão voltar (após handleBack) ═══
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;

    const handlePopState = (event: PopStateEvent) => {
      // Prevenir que o botão voltar do navegador cause problemas
      // O componente controla a navegação internamente
      console.log('[Quiz] PopState event detected - state:', state, 'history length:', navigationHistory.length);
      
      // IMPORTANTE: Se estamos em 'intro', não fazer nada com popstate
      if (state === 'intro') {
        console.log('[Quiz] PopState ignored - already at intro');
        return;
      }
      
      if (navigationHistory.length > 0) {
        handleBack();
      } else if (state !== 'intro') {
        // Se não tem histórico mas não está no intro, voltar para intro
        console.log('[Quiz] PopState - going back to intro');
        setState('intro');
        setNavigationDirection('back');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigationHistory.length, state, handleBack, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════
  const handleGenderSelect = (gender: 'male' | 'female') => {
    console.log('[Quiz] handleGenderSelect called with gender:', gender);
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
    console.log('[Quiz] handleAnswer called:', { currentQuestion, answerId, score });
    
    const newAnswer: QuizAnswer = {
      questionId: questionsToShow[currentQuestion].id,
      answerId,
      score,
    };
    
    setAnswers(prev => {
      const updated = [...prev, newAnswer];
      console.log('[Quiz] Answers updated:', updated);
      return updated;
    });
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
    console.log('[Quiz] Next question index:', nextQuestion, 'Total questions:', questionsToShow.length);
    
    // Insert transition/stat screens between questions
    if (currentQuestion === 0) {
      // Show Social Proof after first question (index 0) - estratégico para criar engajamento
      console.log('[Quiz] Going to social-proof-transition');
      goToState('social-proof-transition', currentQuestion);
    } else if (currentQuestion === 1) {
      // Show Maxxing Effect after 2 questions (index 0 and 1)
      console.log('[Quiz] Going to maxxing-effect');
      goToState('maxxing-effect', currentQuestion);
    } else if (currentQuestion === 2) {
      console.log('[Quiz] Going to haircut-transition');
      goToState('haircut-transition', currentQuestion);
    } else if (currentQuestion === 5) {
      console.log('[Quiz] Going to stat-mission');
      goToState('stat-mission', currentQuestion);
    } else if (nextQuestion >= questionsToShow.length) {
      // Track quiz completed
      console.log('[Quiz] Quiz completed, going to testimonial');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quiz_completed', {
          event_category: 'Quiz',
          event_label: 'Quiz Completed',
        });
      }
      goToState('testimonial');
    } else {
      // Avançar para próxima pergunta mantendo no mesmo estado
      console.log('[Quiz] Advancing to next question:', nextQuestion);
      setCurrentQuestion(nextQuestion);
      trackQuizStep('questions', 'forward');
    }
  };

  const handleDataSubmit = (data: UserData) => {
    setUserData(prev => ({ ...prev, ...data }));
    trackEvent('Lead', { 
      content_name: 'Quiz Lead',
      email: data.email,
    });
    goToState('analyzing');
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
    // Clear storage on purchase
    clearQuizStorage();
    window.location.href = CHECKOUT_URL;
  };

  // ═══════════════════════════════════════════════════════════════
  // PROGRESS CALCULATION
  // ═══════════════════════════════════════════════════════════════
  const calculateProgress = () => {
    const stateProgress: Record<QuizState, number> = {
      'intro': 0,
      'gender': 5,
      'personality-intro': 8,
      'selfie-upload': 10,
      'stat-percentage': 15,
      'questions': 20 + (currentQuestion / questionsToShow.length) * 30,
      'social-proof-transition': 23,
      'maxxing-effect': 28,
      'haircut-transition': 45,
      'stat-mission': 55,
      'testimonial': 65,
      'data-collection': 75,
      'analyzing': 85,
      'unlock': 95,
      'paywall': 100,
    };
    return stateProgress[state] || 0;
  };

  const progress = calculateProgress();
  const showProgress = state !== 'intro';
  
  // Determinar se pode voltar baseado no histórico e estado atual
  const canGoBack = useCallback(() => {
    if (state === 'intro') return false;
    if (state === 'questions' && currentQuestion > 0) return true;
    if (navigationHistory.length > 0) return true;
    
    // Estados que sempre podem voltar (com fallback)
    const statesWithFallback = ['gender', 'personality-intro', 'stat-percentage', 'selfie-upload'];
    return statesWithFallback.includes(state);
  }, [state, currentQuestion, navigationHistory]);
  
  const showBackButton = state !== 'intro' && state !== 'personality-intro' && state !== 'analyzing' && state !== 'paywall' && canGoBack();

  // Animation variants based on direction - Melhorado com transições mais suaves
  const slideVariants = {
    enter: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? 30 : -30,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? -30 : 30,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const transitionConfig = {
    type: 'tween' as const,
    ease: [0.4, 0, 0.2, 1], // ease-in-out-cubic para transição mais suave
    duration: 0.25,
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background overflow-x-hidden">
      {/* Progress Bar - Melhorado */}
      {showProgress && (
        <QuizProgressBar 
          progress={progress}
          currentStep={state === 'questions' ? currentQuestion + 1 : 0}
          totalSteps={questionsToShow.length}
            />
      )}

      {/* Back Button */}
      {showBackButton && canGoBack() && (
        <BackButton onClick={handleBack} showProgress={showProgress} />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* DEBUG: Mostrar estado atual */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-0 right-0 bg-black/80 text-white text-xs p-2 z-50">
            State: {state} | Initialized: {isInitialized ? 'yes' : 'no'}
          </div>
        )}
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
              onAnimationStart={() => {
                console.log('[Quiz] IntroScreen animation started');
              }}
              onAnimationComplete={() => {
                console.log('[Quiz] IntroScreen animation completed');
              }}
            >
              <IntroScreen 
                onContinue={() => safeSetState('gender', 'user-action')}
              />
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
              <GenderSelectScreen onSelect={handleGenderSelect} />
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
              <PersonalityIntroScreen onContinue={() => goToState('selfie-upload', 0, true)} />
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
                  goToState('questions', 0);
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

          {state === 'social-proof-transition' && (
            <motion.div
              key="social-proof-transition"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <SocialProofTransitionScreen 
                gender={userData.gender as 'male' | 'female'}
                onContinue={() => {
                  const nextQuestion = currentQuestion + 1;
                  setCurrentQuestion(nextQuestion);
                  goToState('questions', nextQuestion);
                }} 
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
                  const nextQuestion = currentQuestion + 1;
                  setCurrentQuestion(nextQuestion);
                  goToState('questions', nextQuestion);
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
                  const nextQuestion = currentQuestion + 1;
                  setCurrentQuestion(nextQuestion);
                  goToState('questions', nextQuestion);
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
                  const nextQuestion = currentQuestion + 1;
                  setCurrentQuestion(nextQuestion);
                  goToState('questions', nextQuestion);
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
              <TestimonialScreen onContinue={() => goToState('data-collection', 0, true)} />
            </motion.div>
          )}

          {state === 'data-collection' && (
            <motion.div
              key="data-collection"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="pt-8"
            >
              <DataCollectionScreen onSubmit={handleDataSubmit} />
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
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
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

          {state === 'paywall' && analysisResults && (
            <motion.div
              key="paywall"
              custom={navigationDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
            >
              <PaywallScreen 
                results={analysisResults}
                userPhoto={frontImage}
                onPurchase={handlePurchase}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

