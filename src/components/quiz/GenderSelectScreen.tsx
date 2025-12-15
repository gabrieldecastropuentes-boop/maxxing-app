import { useState } from 'react';
import { motion } from 'framer-motion';
import { BackButton } from './BackButton';

interface GenderSelectScreenProps {
  onSelect: (gender: 'male' | 'female') => void;
  onBack?: () => void;
}

export function GenderSelectScreen({ onSelect, onBack }: GenderSelectScreenProps) {
  const [selected, setSelected] = useState<'male' | 'female' | null>(null);

  return (
    <div className="quiz-screen min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {onBack && <BackButton onClick={onBack} />}
          {!onBack && <div className="w-10" />}
          <div className="w-10" />
        </div>

        {/* Título - FONTE AJUSTADA */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-tight">
          Selecione seu gênero
        </h1>
        
        {/* Subtítulo - ESCALA MELHORADA */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto leading-relaxed">
          Nosso algoritmo personaliza a análise baseado no seu perfil
        </p>
      </div>

      {/* Opções - ELEMENTOS VISUAIS MELHORADOS */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* Opção Masculino */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: selected === 'male' ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected('male')}
            className={`
              relative overflow-hidden rounded-3xl p-8 transition-all duration-300
              ${selected === 'male' 
                ? 'bg-gradient-to-br from-[#FF4D4D]/20 to-[#FF8A00]/20 border-2 border-[#FF4D4D] scale-105 shadow-2xl shadow-[#FF4D4D]/30' 
                : 'bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10'
              }
            `}
          >
            {/* Ícone */}
            <div className="mb-6 flex justify-center">
              <div className={`
                w-24 h-24 rounded-2xl flex items-center justify-center transition-all
                ${selected === 'male' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                  : 'bg-blue-500/20'
                }
              `}>
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 2v2h3.586L11 12.586V9H9v7h7v-2h-3.586L21 5.414V9h2V2h-7zM9 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                </svg>
              </div>
            </div>

            {/* Texto */}
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Masculino
            </h3>
            <p className="text-sm sm:text-base text-gray-400 text-center">
              Análise otimizada para homens
            </p>

            {/* Checkmark */}
            {selected === 'male' && (
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FF4D4D] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </motion.button>

          {/* Opção Feminino */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: selected === 'female' ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected('female')}
            className={`
              relative overflow-hidden rounded-3xl p-8 transition-all duration-300
              ${selected === 'female' 
                ? 'bg-gradient-to-br from-[#FF4D4D]/20 to-[#FF8A00]/20 border-2 border-[#FF4D4D] scale-105 shadow-2xl shadow-[#FF4D4D]/30' 
                : 'bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10'
              }
            `}
          >
            <div className="mb-6 flex justify-center">
              <div className={`
                w-24 h-24 rounded-2xl flex items-center justify-center transition-all
                ${selected === 'female' 
                  ? 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg' 
                  : 'bg-pink-500/20'
                }
              `}>
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.5 9.5c0-2.76-2.24-5-5-5s-5 2.24-5 5c0 2.4 1.69 4.39 3.95 4.87V17H9v2h2.45v2h2v-2H16v-2h-2.55v-2.63c2.26-.48 3.95-2.47 3.95-4.87z"/>
                </svg>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Feminino
            </h3>
            <p className="text-sm sm:text-base text-gray-400 text-center">
              Análise otimizada para mulheres
            </p>

            {selected === 'female' && (
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FF4D4D] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Botão Continuar */}
      <div className="p-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: selected ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className={`
            w-full px-8 py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300
            ${selected
              ? 'bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-[#FF4D4D]/30'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selected ? 'Continuar →' : 'Selecione uma opção'}
        </motion.button>
      </div>
    </div>
  );
}

