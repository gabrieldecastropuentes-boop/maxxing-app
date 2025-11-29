import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scoreCategories } from '../../data/quizData';
import { cn } from '../../lib/utils';
import type { AnalysisResults } from './AnalyzingScreen';
import type { UserData, QuizAnswer } from '../Quiz';

interface ResultsScreenProps {
  quizScore: number;
  photoAnalysis: AnalysisResults | null;
  userData: UserData;
  answers: QuizAnswer[];
  onContinue?: () => void;
}

export function ResultsScreen({ quizScore, photoAnalysis, userData, answers, onContinue }: ResultsScreenProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  // Calculate final score: 70% photo (if available), 30% quiz
  // If no photo, use quiz score only
  const finalScore = photoAnalysis 
    ? Math.round(photoAnalysis.overallScore * 0.7 + quizScore * 0.3)
    : quizScore;

  const category = scoreCategories.find(
    (cat) => finalScore >= cat.min && finalScore <= cat.max
  ) || scoreCategories[0];

  const percentile = Math.min(99, Math.max(1, Math.round(finalScore * 0.9 + 5)));

  useEffect(() => {
    const duration = 1800;
    const steps = 50;
    const increment = finalScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalScore) {
        setAnimatedScore(finalScore);
        clearInterval(timer);
        setTimeout(() => setShowCTA(true), 400);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [finalScore]);

  const handleCTAClick = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Results CTA Clicked',
        value: finalScore,
      });
    }
    window.location.href = 'https://checkout.perfectpay.com.br/pay/PPU38CQ3RIM';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium bg-primary/10 border border-primary/20 text-primary mb-3 md:mb-4">
          <span>📊</span>
          <span className="font-semibold">Análise Completa</span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold mb-1">
          {userData.name ? `${userData.name}, aqui está sua` : "Aqui está sua"}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-primary">
          Pontuação de Atratividade
        </h2>
      </motion.div>

      {/* Score Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 md:mb-8"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: finalScore / 100 }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
            style={{ strokeDasharray: '264', strokeDashoffset: '0' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl md:text-6xl font-bold"
            style={{ color: category.color }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs md:text-sm text-text-muted">de 100</span>
        </div>
      </motion.div>

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-6 md:mb-8"
      >
        <div
          className="inline-block px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-bold"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
            border: `2px solid ${category.color}30`,
          }}
        >
          {category.title}
        </div>
        <p className="mt-2 text-sm md:text-base text-text-secondary">{category.subtitle}</p>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8"
      >
        <div className="card p-3 md:p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">{percentile}%</div>
          <div className="text-xs md:text-sm text-text-muted">Percentil</div>
        </div>
        {photoAnalysis && (
          <div className="card p-3 md:p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">{photoAnalysis.overallScore}</div>
            <div className="text-xs md:text-sm text-text-muted">Score Facial</div>
          </div>
        )}
        <div className={cn("card p-3 md:p-4 text-center", !photoAnalysis && "col-span-1")}>
          <div className="text-2xl md:text-3xl font-bold text-accent">{quizScore}</div>
          <div className="text-xs md:text-sm text-text-muted">Score Quiz</div>
        </div>
      </motion.div>

      {/* Before / After Example (visual transformation) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="card p-4 md:p-5 mb-6 md:mb-8"
      >
        <h3 className="text-base md:text-lg font-semibold mb-4">
          Transformação Potencial
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 items-end">
          <div>
            <div className="rounded-2xl overflow-hidden bg-black aspect-[3/4] mb-2 border border-white/10">
              <img
                src="/media/social_proof_before.png"
                alt="Antes do Maxxing"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-text-secondary">Antes do Maxxing</p>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden bg-black aspect-[3/4] mb-2 border border-green-500/40">
              <img
                src="/media/social_proof_after.png"
                alt="Depois do Maxxing"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-text-secondary">Depois do Maxxing</p>
          </div>
        </div>
      </motion.div>

      {/* Photo Analysis Section */}
      {photoAnalysis && photoAnalysis.features && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="card p-4 md:p-5 mb-6 md:mb-8"
        >
          <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧬</span> Análise Facial Detalhada
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Simetria Facial', value: photoAnalysis.features.symmetry, icon: '⚖️' },
              { label: 'Estrutura Facial', value: photoAnalysis.features.facialStructure, icon: '📐' },
              { label: 'Área dos Olhos', value: photoAnalysis.features.eyeArea, icon: '👁️' },
              { label: 'Linha da Mandíbula', value: photoAnalysis.features.jawline, icon: '💪' },
              { label: 'Qualidade da Pele', value: photoAnalysis.features.skinQuality, icon: '✨' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <span className="text-lg">{feature.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-text-secondary">{feature.label}</span>
                    <span className="text-sm font-semibold text-white">{feature.value}/100</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.value}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${feature.value >= 70 ? '#7ED321' : feature.value >= 50 ? '#FFB347' : '#FF6B35'} 0%, ${feature.value >= 70 ? '#4A90D9' : feature.value >= 50 ? '#FF6B35' : '#FF4D4D'} 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Text */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="text-primary font-medium">🤖 Análise IA:</span> {photoAnalysis.analysisSummary}
            </p>
          </div>
        </motion.div>
      )}

      {/* General Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-4 md:p-5 mb-6 md:mb-8"
      >
        <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
          <span>📋</span> Sua Análise
        </h3>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          {category.description}
        </p>
      </motion.div>

      {/* Improvement Areas */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-4 md:p-5 mb-6 md:mb-8"
      >
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <span>🎯</span> Áreas para Maximizar
        </h3>
        <div className="space-y-2 md:space-y-3">
          {[
            { area: 'Rotina de Skincare Avançada', potential: '+8 pontos', icon: '✨', desc: 'Melhore a qualidade da sua pele' },
            { area: 'Otimização de Grooming', potential: '+5 pontos', icon: '💈', desc: 'Estilo e apresentação pessoal' },
            { area: 'Fitness & Definição Facial', potential: '+7 pontos', icon: '💪', desc: 'Melhore estrutura e definição' },
            { area: 'Técnicas de Mewing', potential: '+4 pontos', icon: '🦷', desc: 'Otimize sua linha da mandíbula' },
          ].map((item, index) => (
            <motion.div
              key={item.area}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <span className="text-sm md:text-base font-medium block">{item.area}</span>
                  <span className="text-xs text-text-muted">{item.desc}</span>
                </div>
              </div>
              <span className="text-green-400 font-bold text-sm whitespace-nowrap">{item.potential}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      {showCTA && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-elevated p-5 md:p-8 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              {/* Product Image + Content Layout */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                {/* Product Blueprint Image */}
                <div className="w-full lg:w-1/3 flex-shrink-0">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(255,77,77,0.2)]">
                    <img
                      src="/media/product_blueprint.jpg"
                      alt="Blueprint Maxxing - Guia Completo"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
                        GUIA COMPLETO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    Vagas Limitadas Disponíveis
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
                    Você Está a <span className="text-primary">Um Passo</span> da Transformação
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary mb-4 max-w-md mx-auto lg:mx-0">
                    Seu score de <span className="text-primary font-bold">{finalScore}</span> revela um <span className="text-white font-semibold">potencial não explorado</span>. A boa notícia? Com as estratégias certas, você pode subir para <span className="text-green-400 font-bold">{Math.min(99, finalScore + 24)}</span> em poucas semanas.
                  </p>
                  <p className="text-xs text-text-muted mb-6 max-w-sm mx-auto lg:mx-0">
                    Não fique preso nesse nível. Milhares já desbloquearam seu verdadeiro potencial com nosso Guia de Maxxing personalizado.
                  </p>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto lg:mx-0">
                    {[
                      { icon: '📚', text: 'Guia Completo' },
                      { icon: '🎯', text: 'Personalizado' },
                      { icon: '📱', text: 'Acesso Vitalício' },
                      { icon: '💬', text: 'Suporte 24/7' },
                    ].map((benefit) => (
                      <div key={benefit.text} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span>{benefit.icon}</span>
                        <span>{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCTAClick}
                    className="btn-primary w-full lg:w-auto text-base md:text-lg px-10 py-4 md:py-5 animate-pulse-glow"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Desbloquear Meu Potencial Agora
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-xs md:text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Garantia de 30 dias
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Acesso imediato
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pagamento seguro
                </span>
              </div>
          </div>
        </div>

          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-5 p-3 md:p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center"
          >
            <p className="text-xs md:text-sm text-yellow-400">
              ⏰ <span className="font-semibold">Oferta Especial:</span> 60% de desconto expira em{' '}
              <span className="font-bold text-white">23:47:32</span>
            </p>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 md:mt-8"
          >
            <p className="text-xs text-text-muted text-center mb-3">O que nossos usuários dizem:</p>
            <div className="grid gap-3">
              {[
                { name: 'Carlos M.', text: 'Aumentei minha pontuação de 58 para 79 em 3 meses!', rating: 5 },
                { name: 'Pedro S.', text: 'O guia é muito completo. Vale cada centavo.', rating: 5 },
              ].map((testimonial) => (
                <div key={testimonial.name} className="card p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary">{testimonial.text}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">— {testimonial.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center"
      >
        <p className="text-xs md:text-sm text-text-muted mb-2 md:mb-3">Compartilhe seus resultados</p>
        <div className="flex justify-center gap-2 md:gap-3">
          {['WhatsApp', 'Instagram', 'Twitter'].map((platform) => (
            <button
              key={platform}
              className="px-3 md:px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-xs md:text-sm font-medium"
            >
              {platform}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
