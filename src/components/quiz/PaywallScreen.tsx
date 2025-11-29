import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { AnalysisResults } from './AnalyzingScreen';

// ═══════════════════════════════════════════════════════════════
// VARIÁVEL DE CHECKOUT - ALTERE AQUI SEU LINK
// ═══════════════════════════════════════════════════════════════
const CHECKOUT_URL = 'https://checkout.perfectpay.com.br/pay/PPU38CQ3RIM';

interface PaywallScreenProps {
  results: AnalysisResults;
  userPhoto?: string;
  onPurchase: (plan: string) => void;
}

// Componente de botão CTA reutilizável (sem preço)
const CTAButton = ({ 
  text, 
  variant = 'primary',
  className = '' 
}: { 
  text: string; 
  variant?: 'primary' | 'secondary';
  className?: string;
}) => (
  <motion.a
    href={CHECKOUT_URL}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }}
    className={cn(
      "block w-full py-4 rounded-2xl text-center font-bold text-base",
      "transition-all duration-150 cursor-pointer no-underline",
      "min-h-[48px] active:scale-[0.98]",
      variant === 'primary' 
        ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_6px_24px_rgba(255,77,77,0.25)]"
        : "bg-white/5 border border-white/10 text-white hover:bg-white/10",
      className
    )}
  >
    {text}
  </motion.a>
);

// Emails mockados para social proof
const recentEmails = [
  'lucas***@outlook.com',
  'maria***@gmail.com', 
  'joao***@icloud.com',
  'ana***@hotmail.com',
  'pedro***@yahoo.com',
  'julia***@gmail.com',
  'carlos***@outlook.com',
  'beatriz***@icloud.com',
];

// Celebridades para seção de personalidade - COM FOTOS DE RANDOMUSER
const celebrities = [
  { 
    name: 'Chris H.', 
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'CH',
    color: '#3B82F6'
  },
  { 
    name: 'Marcus T.', 
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'MT',
    color: '#10B981'
  },
  { 
    name: 'James W.', 
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    initials: 'JW',
    color: '#8B5CF6'
  },
  { 
    name: 'Daniel R.', 
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    initials: 'DR',
    color: '#EF4444'
  },
  { 
    name: 'Ryan K.', 
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    initials: 'RK',
    color: '#F59E0B'
  },
  { 
    name: 'Alex M.', 
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
    initials: 'AM',
    color: '#EC4899'
  },
];

export function PaywallScreen({ results, userPhoto, onPurchase }: PaywallScreenProps) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [emailIndex, setEmailIndex] = useState(0);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Email ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setEmailIndex((prev) => (prev + 1) % recentEmails.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular scores baseados nos resultados
  const beforeScore = Math.max(results.overallScore - 35, 25);
  const afterScore = Math.min(results.overallScore + 35, 95);
  const beforeConfidence = Math.max(results.overallScore - 45, 20);
  const afterConfidence = Math.min(results.overallScore + 44, 90);


  // Características fortes (bloqueadas)
  const strongFeatures = [
    { name: 'Mandíbula', score: 91 },
    { name: 'Qualidade da Pele', score: 72 },
    { name: 'Lábios', score: 71 },
  ];

  // O que está te segurando (bloqueadas)
  const weakFeatures = [
    { name: 'Simetria Facial', score: 54 },
    { name: 'Proporções', score: 48 },
    { name: 'Contorno', score: 42 },
  ];

  // Plano semanal
  const weeklyPlan = [
    { week: 1, days: ['Mewing', 'Massagem Facial', 'Postura', 'Skincare', 'Estilo', 'Dieta', 'Avaliação'] },
    { week: 2, days: ['Postura', 'Contato Visual', 'Confiança', 'Vestuário', 'Gratidão', 'Ação', 'Review'] },
    { week: 3, days: ['Guarda-Roupa', 'Cores', 'Fit', 'Calçados', 'Acessórios', 'Outfit', '🔒'] },
  ];

  // Produtos de skincare
  const skincareProducts = [
    { name: 'Gel Esfoliante BHA 2%', fit: 95 },
    { name: 'Niacinamida The Ordinary', fit: 100 },
    { name: 'CeraVe Hidratante', fit: 92 },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 1: BEFORE/AFTER + STATS (Print 1)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          {/* Headline Inspiradora */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-10 font-display leading-[1.15] tracking-tight px-3 sm:px-4"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 30%, #FF4D4D 60%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Sua transformação começa agora: descubra seu plano individual personalizado
          </motion.h1>

          {/* Before/After Photos - IMAGENS FIXAS */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* BEFORE Photo - before-photo.png */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] rounded-2xl overflow-hidden border-[3px] border-gray-700 bg-gray-900 shadow-xl">
                <img 
                  src="/media/before-photo.png" 
                  alt="Antes" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex-shrink-0"
            >
              <div className="flex">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
                <svg className="w-6 h-6 text-green-500 -ml-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </motion.div>

            {/* AFTER Photo - after-photo.png */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] rounded-2xl overflow-hidden border-[3px] border-gray-700 bg-gray-900 shadow-xl">
                <img 
                  src="/media/after-photo.png" 
                  alt="Depois" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Before Column */}
            <div className="space-y-5">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{beforeScore}%</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${beforeScore}%` }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1.5">Atratividade</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{beforeConfidence}%</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${beforeConfidence}%` }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1.5">Confiança</p>
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-5">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{afterScore}%</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${afterScore}%` }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1.5">Atratividade</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{afterConfidence}%</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${afterConfidence}%` }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1.5">Confiança</p>
              </div>
            </div>
          </div>

          {/* Social Proof - Recent Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-gray-300 mb-3">
              <span className="font-bold text-white">143 pessoas</span> compraram nosso plano na última hora
            </p>
            <div className="flex justify-center gap-2 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {[0, 1, 2].map((offset) => {
                  const idx = (emailIndex + offset) % recentEmails.length;
                  return (
                    <motion.span
                      key={`email-${idx}-${offset}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="px-3 py-1.5 bg-gray-800/90 rounded-full text-xs text-gray-400 whitespace-nowrap border border-gray-700/50"
                    >
                      {recentEmails[idx]}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA Button #1 */}
          <div className="mt-6">
            <CTAButton text="Obter acesso agora" variant="primary" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 2: ANÁLISE DE ATRATIVIDADE (Print 3)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="text-center py-5 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Análise de Atratividade</h3>
            </div>
            
            {/* User Photo - FOTO DO USUÁRIO */}
            <div className="p-6">
              <div className="w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-gray-900 mb-6 p-4">
                {userPhoto ? (
                  <div className="relative">
                    {/* Foto única do usuário */}
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-700">
                      <img 
                        src={userPhoto} 
                        alt="Sua foto de análise" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Pontos de análise na foto */}
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-[20%] left-[25%] w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className="absolute top-[35%] right-[20%] w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      className="absolute bottom-[30%] left-[30%] w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      className="absolute bottom-[45%] right-[25%] w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" 
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-2 border-gray-700">
                    <div className="text-center">
                      <span className="text-6xl opacity-40 block mb-2">👤</span>
                      <span className="text-xs text-gray-500">Foto não disponível</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Locked Main Scores */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300 font-medium">Atratividade</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-[60%] h-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-full animate-pulse" />
                    </div>
                    <span className="text-gray-500 text-lg">🔒</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300 font-medium">Potencial</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-[75%] h-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-full animate-pulse" />
                    </div>
                    <span className="text-gray-500 text-lg">🔒</span>
                  </div>
                </div>
              </div>

              {/* Strong Features */}
              <div className="border-t border-gray-800 pt-5">
                <h4 className="text-green-500 font-bold text-lg mb-1">Seus pontos fortes</h4>
                <p className="text-xs text-gray-500 mb-4">As qualidades que mais te destacam</p>
                
                <div className="space-y-3">
                  {strongFeatures.map((feature, i) => (
                    <motion.div 
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">🔒</span>
                        <div className="w-28 h-4 bg-gray-800 rounded animate-pulse" />
                      </div>
                      <span className="text-green-500 font-bold text-xl">{feature.score}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weak Features */}
              <div className="border-t border-gray-800 pt-5 mt-5">
                <h4 className="text-red-500 font-bold text-lg mb-1">O que está te segurando</h4>
                <p className="text-xs text-gray-500 mb-4">Características para melhorar sua atratividade</p>
                
                <div className="space-y-3">
                  {weakFeatures.map((feature, i) => (
                    <motion.div 
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">🔒</span>
                        <div className="w-28 h-4 bg-gray-800 rounded animate-pulse" />
                      </div>
                      <span className="text-red-500 font-bold text-xl">{feature.score}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA após Análise de Atratividade */}
          <div className="mt-6">
            <CTAButton text="Obter acesso agora" variant="primary" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 3: O QUE VOCÊ RECEBE (Print 2)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-center mb-2">
            Tudo que você recebe<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              no seu Plano Looksmaxxer
            </span>
          </h3>
          <p className="text-gray-400 text-sm text-center mb-6">Tecnologia exclusiva + acompanhamento personalizado</p>
          
          <div className="space-y-3">
            {[
              { icon: '🔬', title: 'Escaneamento Facial 3D', desc: 'Mapeamento automático de pontos fracos', value: 'R$197' },
              { icon: '📊', title: 'Score de Atração Atualizado', desc: 'Reavaliação semanal do seu progresso', value: 'R$97' },
              { icon: '🧴', title: 'Plano de Produtos Personalizado', desc: 'Ranking dos melhores para sua pele', value: 'R$147' },
              { icon: '📋', title: 'Rotina Looksmaxxer Exclusiva', desc: 'Horários exatos + passos numerados', value: 'R$127' },
              { icon: '💋', title: 'Mapa de Atração Feminina', desc: 'Pontos mais valorizados por mulheres', value: 'R$97' },
              { icon: '📈', title: 'Acompanhamento Mensal', desc: 'Check-in de evolução + ajustes', value: 'R$67' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-2xl border border-gray-800"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 line-through">{item.value}</span>
                  <span className="block text-xs text-green-500">Incluído</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl border border-primary/30 text-center">
            <p className="text-xs text-gray-400">Valor total:</p>
            <p className="text-2xl font-bold text-white line-through opacity-50">R$732</p>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              GRÁTIS HOJE
            </p>
          </div>

          {/* CTA Button #4 */}
          <div className="mt-6">
            <CTAButton text="Finalizar minha inscrição" variant="primary" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 4: GLOW-UP PLAN (Print 4)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto text-center">
          {/* Glow-up Plan */}
          <h2 className="text-3xl font-bold mb-2">
            Criamos um plano de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              glow-up para você
            </span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Baseado no seu scan facial e respostas
          </p>

          {/* Weekly Plan Grid */}
          <div className="space-y-3">
            {weeklyPlan.map((week) => (
              <motion.div 
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * week.week }}
                className="rounded-2xl bg-[#1a1a1a] border border-gray-800 overflow-hidden"
              >
                <div className="flex">
                  {/* Week Label */}
                  <div className="w-14 bg-gradient-to-b from-primary/30 to-accent/30 flex items-center justify-center py-4">
                    <span className="text-[10px] font-bold text-white/80 -rotate-90 whitespace-nowrap tracking-wider">
                      SEMANA {week.week}
                    </span>
                  </div>
                  {/* Days Grid */}
                  <div className="flex-1 p-3">
                    <div className="grid grid-cols-7 gap-1">
                      {['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'].map((day, i) => (
                        <div key={day} className="text-center">
                          <p className="text-[8px] text-gray-500 mb-1">{day}</p>
                          <div className={cn(
                            "h-9 rounded text-[7px] flex items-center justify-center font-medium px-0.5",
                            week.days[i] === '🔒' 
                              ? "bg-gray-800/50 text-gray-600" 
                              : "bg-gray-800 text-gray-300"
                          )}>
                            {week.days[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-primary text-sm mt-5 mb-4 font-medium">Mais dados no relatório completo</p>
          
          {/* CTA Button #2 */}
          <CTAButton text="Desbloquear meu plano personalizado" variant="primary" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 4.5: SUA JORNADA DE TRANSFORMAÇÃO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">
            Sua Jornada de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Transformação
            </span>
          </h3>
          
            <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-green-500" />
            
            {[
              { week: 'Semana 1', title: 'Fundação', desc: 'Rotina de skincare + correções de estilo', icon: '🎯' },
              { week: 'Semana 2', title: 'Otimização', desc: 'Mewing + postura + grooming avançado', icon: '⚡' },
              { week: 'Semana 4', title: 'Resultados Visíveis', desc: 'Pele mais clara, rosto mais definido', icon: '✨' },
              { week: 'Semana 8', title: 'Transformação', desc: 'Visual completamente elevado', icon: '🔥' },
            ].map((item, i) => (
                  <motion.div 
                key={item.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="relative flex gap-4 mb-6 last:mb-0"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-primary flex items-center justify-center text-xl z-10">
                  {item.icon}
                </div>
                <div className="flex-1 pt-1">
                  <span className="text-xs text-primary font-medium">{item.week}</span>
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
              </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 4.6: AI SKINCARE PRODUCTS (Print 6)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Produtos Escolhidos pela IA<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Para Sua Melhor Pele
            </span>
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6 max-w-xs mx-auto">
            Nem todo skincare funciona para todos. Por isso escaneamos sua pele e escolhemos os MELHORES produtos — sem tentativa e erro.
          </p>

          {/* Product Cards */}
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {skincareProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex-shrink-0 w-28 rounded-2xl bg-gray-800/80 border border-gray-700 p-3 text-center"
              >
                <div className="w-16 h-20 mx-auto bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-2xl">🧴</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-tight mb-1">{product.name}</p>
                <p className={cn(
                  "text-xs font-bold",
                  product.fit === 100 ? "text-green-500" : "text-primary"
                )}>
                  {product.fit}% fit
                </p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl bg-[#1a1a1a] border border-gray-800 p-5 mt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-[10px] text-gray-500">Usou Maxxing<br />por 3 meses</p>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              "Eu costumava pegar skincare aleatório do TikTok, mas isso realmente me deu o que minha pele precisava. Grande diferença em apenas um mês."
            </p>
            <p className="text-sm font-semibold text-white">Leo, 20</p>
          </div>

          {/* Look Better Feel Better */}
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold mb-2">
              Pareça melhor.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Sinta-se melhor.
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Melhorias reais, resultados reais. Veja como pequenas mudanças se somam a uma transformação massiva.
            </p>
          </div>

          {/* Discount Banner */}
          <motion.div
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-4 text-center"
          >
            <p className="text-primary font-bold text-sm">
              -50% DESCONTO RESERVADO POR {formatTime(timeLeft)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 6.5: MAPA DE ATRAÇÃO FEMININA (Print 7)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-pink-900/30 to-red-900/30 border border-pink-500/30 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💋</span>
              <h3 className="text-xl font-bold text-white">Mapa de Atração Feminina</h3>
              <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">EXCLUSIVO</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Nossa IA analisa os pontos do seu rosto mais valorizados por mulheres — 
              baseado em estudos de psicologia da atração.
            </p>
            
            <div className="space-y-3 mb-4">
              {[
                { label: 'Mandíbula definida', score: 78, color: 'bg-green-500' },
                { label: 'Simetria facial', score: 65, color: 'bg-yellow-500' },
                { label: 'Proporção olhos/rosto', score: 82, color: 'bg-green-500' },
                { label: 'Estrutura óssea', score: 71, color: 'bg-yellow-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-xs text-white/60 blur-[2px]">{item.score}%</span>
                    <span className="text-gray-600">🔒</span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-pink-300/80 italic">
              "Mulheres avaliam o rosto nos primeiros 0,6 segundos — descubra como maximizar sua primeira impressão."
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 7: COMO SEU VISUAL INFLUENCIA SUA VIDA AMOROSA (Print 8)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-[#1a1a1a] border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Como seu visual influencia<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
                sua vida amorosa
              </span>
            </h3>
            
            <div className="space-y-3">
              {[
                { icon: '👁️', text: 'Aumento de presença e confiança percebida' },
                { icon: '⚡', text: 'Primeiras impressões 3x mais impactantes' },
                { icon: '💎', text: 'Sinais de alto valor percebido instantaneamente' },
                { icon: '🎯', text: 'Usuários relatam 3x mais matches em apps' },
                { icon: '🔥', text: 'Tecnologias usadas por influencers e modelos' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 5: PERSONALITY BLUEPRINT (Print 5)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Seu Blueprint de<br />Personalidade
          </h2>
          
          {/* Benefits List */}
          <div className="space-y-2 mb-8">
            {[
              { emoji: '🧠', text: 'Aprenda como você pensa, sente e age' },
              { emoji: '🚀', text: 'Entenda o que constrói ou destrói sua confiança' },
              { emoji: '✅', text: 'Melhore os traços que impulsionam o sucesso' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
            ))}
          </div>

          {/* Confidence Card */}
          <div className="rounded-3xl bg-[#1a1a1a] border border-gray-800 p-6 mb-6">
            <h4 className="text-red-500 font-bold text-lg mb-1">O que afeta sua confiança</h4>
            <p className="text-xs text-gray-500 mb-4">3 traços estão causando baixa confiança</p>
          
          <div className="space-y-3">
              {['Mandíbula', 'Qualidade da Pele', 'Lábios'].map((trait, i) => (
                <div key={trait} className="flex items-center gap-3">
                  <span className="text-white font-bold text-lg">{i + 1}.</span>
                  <span className="text-gray-400 blur-[2px] select-none">{trait}</span>
                  <span className="text-gray-600 ml-auto">🔒</span>
                </div>
            ))}
          </div>
          </div>

          {/* Hidden Talents - Podium */}
          <div className="rounded-3xl bg-[#1a1a1a] border border-gray-800 p-6 mb-6">
            <h4 className="text-yellow-500 font-bold text-lg mb-1">Seus talentos ocultos</h4>
            <p className="text-xs text-gray-500 mb-6">Aqui estão seus 3 talentos mais valiosos</p>
            
            {/* Podium Visual */}
            <div className="flex items-end justify-center gap-2 h-32">
              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-lg mb-2">🔒</span>
                <div className="w-16 h-16 bg-gray-700 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">3</span>
            </div>
                </div>
              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-lg mb-2">🔒</span>
                <div className="w-16 h-24 bg-gray-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
            </div>
            </div>
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-lg mb-2">🔒</span>
                <div className="w-16 h-20 bg-gray-700 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">2</span>
        </div>
            </div>
            </div>
        </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STICKY TIMER BAR (sempre visível)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-gray-800 px-4 py-3 safe-bottom">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl font-bold text-white"
              >
                {formatTime(timeLeft)}
              </motion.span>
              <span className="text-gray-500 text-sm">restantes</span>
            </div>
            {/* Botão de Preço R$39,90 - Especificação Exata */}
            <motion.a
              href={CHECKOUT_URL}
              initial={{ scale: 1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: '0 0 18px rgba(255,77,77,0.45), 0 4px 12px rgba(255,77,77,0.35)'
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 4px 12px rgba(255,77,77,0.35)',
                  '0 4px 18px rgba(255,77,77,0.5)',
                  '0 4px 12px rgba(255,77,77,0.35)'
                ]
              }}
              transition={{
                boxShadow: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.2, ease: 'easeInOut' }
              }}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              className={cn(
                // Layout
                "relative flex items-center justify-center",
                "w-full sm:w-auto sm:flex-1 sm:max-w-[200px]",
                "min-h-[60px] min-w-[44px]",
                "py-4 px-5",
                "rounded-[16px]",
                // Cores - Gradiente Primary → Accent
                "bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35]",
                "text-[#FFFFFF]",
                // Tipografia
                "font-semibold text-[1.4rem]",
                "font-sans", // Plus Jakarta Sans
                // Sombra
                "shadow-[0_4px_12px_rgba(255,77,77,0.35)]",
                // Transições
                "transition-all duration-200 ease-in-out",
                // Outros
                "no-underline cursor-pointer",
                "active:scale-[0.97]"
              )}
            >
              R$39,90
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Bottom spacing for sticky bar */}
      <div className="h-28" />
    </div>
  );
}
