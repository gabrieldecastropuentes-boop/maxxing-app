import { motion } from 'framer-motion';
import { HaircutInfoBlock } from '../HaircutInfoBlock';
import { cn } from '../../lib/utils';

interface StatScreenProps {
  type: 'percentage' | 'hairstyle' | 'mission' | 'improvement';
  gender?: 'male' | 'female';
  onContinue: () => void;
}

export function StatScreen({ type, gender = 'male', onContinue }: StatScreenProps) {
  const isFemale = gender === 'female';

  const renderContent = () => {
    switch (type) {
      case 'percentage':
        return (
          <div className={cn(
            "flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-5",
            isFemale 
              ? "bg-gradient-to-b from-pink-500/90 to-rose-600/90" 
              : "bg-gradient-to-b from-primary/90 to-accent/90"
          )}>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-lg md:text-xl text-white/80 mb-1 sm:mb-2"
            >
              {isFemale ? 'Entendemos você.' : 'Entendemos.'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="text-6xl sm:text-7xl md:text-9xl font-black text-white mb-2 sm:mb-4"
            >
              {isFemale ? '91%' : '89%'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base sm:text-lg md:text-xl text-white/80 mb-2"
            >
              {isFemale ? 'das nossas usuárias' : 'dos nossos usuários'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4"
            >
              <span className={cn(
                "font-bold text-sm sm:text-base lg:text-lg",
                isFemale ? "text-pink-600" : "text-primary"
              )}>
                {isFemale 
                  ? 'se sentem mais bonitas e confiantes' 
                  : 'se sentem mais atraentes e confiantes'}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 text-center"
            >
              {isFemale 
                ? 'após 28 dias seguindo seu protocolo personalizado' 
                : 'após 28 dias seguindo seu plano pessoal'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-xs sm:text-sm text-white/60 text-center"
            >
              {isFemale 
                ? '*Baseado em feedback de 78.432 usuárias Maxxing' 
                : '*Baseado em feedback de 105.439 usuários Maxxing'}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(30);
                }
                onContinue();
              }}
              className={cn(
                "mt-6 sm:mt-8 w-full max-w-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-colors",
                isFemale 
                  ? "bg-white text-pink-600 active:bg-white/90" 
                  : "bg-white text-black active:bg-white/90"
              )}
            >
              Próxima
            </motion.button>
          </div>
        );

      case 'hairstyle':
        return (
          <div className="flex flex-col items-start justify-start min-h-[100dvh] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">
            {/* Título principal - adaptado por gênero */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-5 sm:mb-8 w-full",
                isFemale ? "text-pink-500" : "text-primary"
              )}
            >
              {isFemale 
                ? 'O corte e penteado certos podem transformar completamente sua aparência.'
                : 'Um bom corte de cabelo pode adicionar 2-3 pontos na sua atratividade.'}
            </motion.h1>

            {/* Bloco com texto impactante e imagem */}
            <div className="w-full flex-1 overflow-y-auto">
              <HaircutInfoBlock gender={gender} />
            </div>

            {/* Botão Continuar */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className={cn(
                "w-full py-4 text-lg font-semibold mt-8 mb-8 safe-bottom rounded-2xl",
                isFemale 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" 
                  : "btn-primary"
              )}
            >
              Continuar
            </motion.button>
          </div>
        );

      case 'mission':
        return (
          <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "inline-block px-4 py-2 rounded-full border mb-8",
                isFemale 
                  ? "bg-pink-500/10 border-pink-500/30" 
                  : "bg-white/[0.1] border-white/[0.2]"
              )}
            >
              <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                NOSSA MISSÃO
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            >
              <span className="text-white">Ajudar </span>
              <span className={isFemale ? "text-pink-500" : "text-primary"}>
                {isFemale ? 'mulheres como você' : 'pessoas como você'}
              </span>
              <br />
              <span className="text-white">
                {isFemale 
                  ? 'a descobrir e realçar sua beleza natural, ' 
                  : 'a se tornar o mais atraente possível, '}
              </span>
              <span className={isFemale ? "text-pink-500" : "text-primary"}>
                {isFemale 
                  ? 'revelando todo seu potencial feminino' 
                  : 'tanto física quanto mentalmente'}
              </span>
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className={cn(
                "w-full max-w-sm py-4 text-lg font-semibold mt-auto mb-8 safe-bottom rounded-2xl",
                isFemale 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" 
                  : "btn-primary"
              )}
            >
              Continuar
            </motion.button>
          </div>
        );

      case 'improvement':
        return (
          <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-text-secondary mb-4"
            >
              {isFemale 
                ? 'Baseado na análise da sua harmonia facial e respostas:' 
                : 'Baseado no seu escaneamento facial e respostas:'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "rounded-2xl px-6 py-4 mb-6",
                isFemale ? "bg-pink-500" : "bg-green-500"
              )}
            >
              <p className={cn(
                "font-semibold text-lg mb-1",
                isFemale ? "text-pink-950" : "text-green-950"
              )}>
                {isFemale 
                  ? 'você vai realçar sua beleza feminina' 
                  : 'você vai melhorar sua atratividade'}
              </p>
              <p className={cn(
                "font-bold text-xl",
                isFemale ? "text-pink-950" : "text-green-950"
              )}>
                em <span className={cn(
                  "px-2 py-0.5 rounded",
                  isFemale ? "bg-pink-400" : "bg-green-400"
                )}>8 semanas</span> em{' '}
                <span className={cn(
                  "px-2 py-0.5 rounded",
                  isFemale ? "bg-pink-400" : "bg-green-400"
                )}>64%</span>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-text-muted mb-8"
            >
              {isFemale 
                ? '*transformação visível que as pessoas vão notar' 
                : '*o suficiente para os outros perceberem'}
            </motion.p>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-md mb-8"
            >
              <svg viewBox="0 0 300 150" className="w-full">
                {/* Grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1={80 + i * 70}
                    y1="20"
                    x2={80 + i * 70}
                    y2="120"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* Progress curve */}
                <path
                  d="M 50 100 Q 120 90, 150 70 T 250 30"
                  fill="none"
                  stroke={isFemale ? "#EC4899" : "#22C55E"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Points */}
                <circle cx="80" cy="95" r="8" fill={isFemale ? "#EC4899" : "#22C55E"} />
                <circle cx="150" cy="70" r="8" fill={isFemale ? "#EC4899" : "#22C55E"} />
                <circle cx="220" cy="40" r="8" fill={isFemale ? "#EC4899" : "#22C55E"} />

                {/* Labels */}
                <text x="80" y="140" fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
                  Semana 1
                </text>
                <text x="150" y="140" fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
                  Semana 2
                </text>
                <text x="220" y="140" fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
                  Semana 3
                </text>

                {/* Callouts */}
                <rect x="40" y="70" width="80" height="20" rx="4" fill="white" />
                <text x="80" y="84" fill="black" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {isFemale ? 'Você vai sentir' : 'Você vai sentir'}
                </text>

                <rect x="110" y="45" width="80" height="20" rx="4" fill="white" />
                <text x="150" y="59" fill="black" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {isFemale ? 'Você vai ver' : 'Você vai ver'}
                </text>

                <rect x="170" y="15" width="100" height="20" rx="4" fill="white" />
                <text x="220" y="29" fill="black" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {isFemale ? 'Todos vão notar' : 'Outros vão notar'}
                </text>
              </svg>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className={cn(
                "w-full max-w-sm py-4 text-lg font-semibold mb-8 safe-bottom rounded-2xl",
                isFemale 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" 
                  : "btn-primary"
              )}
            >
              Próxima
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
}
