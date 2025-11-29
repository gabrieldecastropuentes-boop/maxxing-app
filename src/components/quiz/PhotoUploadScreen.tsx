import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUploader } from './ImageUploader';
import { CameraCapture } from './CameraCapture';
import { cn } from '../../lib/utils';

type UploadMode = 'choose' | 'upload' | 'camera';

interface PhotoUploadScreenProps {
  onPhotoSubmit: (imageData: string) => void;
  isLoading?: boolean;
}

export function PhotoUploadScreen({ onPhotoSubmit, isLoading = false }: PhotoUploadScreenProps) {
  const [mode, setMode] = useState<UploadMode>('choose');

  const handleImageSelect = (imageData: string) => {
    onPhotoSubmit(imageData);
  };

  return (
    <div className="w-full px-4 md:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium bg-primary/10 border border-primary/20 text-primary mb-4 md:mb-5">
          <span>📸</span>
          <span className="font-semibold">Análise Facial</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-2 md:mb-3">
          Envie sua
          <br />
          <span className="glow-text">melhor foto</span>
        </h2>
        
        <p className="text-sm md:text-base text-text-secondary max-w-sm mx-auto">
          Nossa IA analisará suas características faciais para uma avaliação mais precisa
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Upload Option */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setMode('upload')}
              className="w-full card p-5 md:p-6 text-left hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                    Fazer Upload
                  </h3>
                  <p className="text-sm text-text-muted">
                    Selecione uma foto da sua galeria
                  </p>
                </div>
                <svg className="w-5 h-5 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Camera Option */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setMode('camera')}
              className="w-full card p-5 md:p-6 text-left hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                    Usar Câmera
                  </h3>
                  <p className="text-sm text-text-muted">
                    Tire uma foto agora mesmo
                  </p>
                </div>
                <svg className="w-5 h-5 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 md:mt-8"
            >
              <p className="text-xs md:text-sm text-text-muted text-center mb-3">
                💡 Dicas para uma análise precisa:
              </p>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { icon: '☀️', text: 'Boa luz' },
                  { icon: '😐', text: 'Rosto frontal' },
                  { icon: '🚫', text: 'Sem óculos' },
                ].map((tip) => (
                  <div
                    key={tip.text}
                    className="text-center p-2 md:p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span className="text-lg md:text-xl">{tip.icon}</span>
                    <p className="text-[10px] md:text-xs text-text-muted mt-1">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Privacy note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-3 rounded-xl bg-green-500/5 border border-green-500/10"
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-text-secondary">
                  Sua foto é processada de forma segura e <span className="text-green-400 font-medium">não é armazenada</span> em nossos servidores.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setMode('choose')}
              className="mb-4 flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
          </motion.div>
        )}

        {mode === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CameraCapture
              onCapture={handleImageSelect}
              onCancel={() => setMode('choose')}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

