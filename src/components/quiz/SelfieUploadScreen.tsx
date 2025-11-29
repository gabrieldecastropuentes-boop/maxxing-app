import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CameraCapture } from './CameraCapture';
import { processAndCompressImage, isIOS } from '../../utils/imageCompression';

interface SelfieUploadScreenProps {
  onComplete: (frontImage: string, sideImage: string | null) => void;
  gender?: 'male' | 'female';
}

type UploadStep = 'intro' | 'front' | 'side' | 'confirm';

export function SelfieUploadScreen({ onComplete, gender = 'male' }: SelfieUploadScreenProps) {
  const [step, setStep] = useState<UploadStep>('intro');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUpload = useRef<'front' | 'side'>('front');

  const isFemale = gender === 'female';

  // Imagens de referência baseadas no gênero (com fallback)
  const referenceImages = {
    front: isFemale 
      ? '/media/female_front_reference.jpg' 
      : '/media/frontal-1.png',
    side: isFemale 
      ? '/media/female_side_reference.jpg' 
      : '/media/side-1.png',
  };
  
  // Fallback para imagens que não existem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, type: 'front' | 'side') => {
    const target = e.currentTarget;
    // Se a imagem falhar, usar placeholder ou imagem padrão
    if (type === 'front') {
      target.src = '/media/scan_male.jpg'; // Fallback genérico
    } else {
      target.src = '/media/scan_female.jpg'; // Fallback genérico
    }
  };

  // Textos adaptados por gênero
  const texts = {
    title: isFemale 
      ? <>Envie <span className="text-primary">2 selfies</span> para sua análise facial feminina</>
      : <>Envie <span className="text-primary">2 selfies</span> para ter seu rosto analisado</>,
    subtitle: isFemale
      ? 'Use estas referências femininas como guia. Luz natural, rosto limpo e neutro.'
      : '',
    frontLabel: isFemale ? 'Exemplo frontal — siga este padrão' : 'Selfie Frontal',
    sideLabel: isFemale ? 'Exemplo lateral — siga este padrão' : 'Selfie Lateral',
    safetyText: isFemale 
      ? 'É seguro, suas fotos são privadas e usadas apenas para análise'
      : 'É seguro, sua selfie não será visível para ninguém',
    ctaText: isFemale ? 'Adicionar minhas selfies' : 'Adicionar selfies',
  };

  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica
    if (!file.type.startsWith('image/')) {
      console.error('[SelfieUpload] Arquivo não é uma imagem');
      return;
    }

    setIsCompressing(true);

    try {
      // Comprimir imagem antes de processar
      const compressedBase64 = await processAndCompressImage(file);
      
      if (currentUpload.current === 'front') {
        setFrontImage(compressedBase64);
        setStep('side');
      } else {
        setSideImage(compressedBase64);
        setStep('confirm');
      }
    } catch (error) {
      console.error('[SelfieUpload] Erro ao processar imagem:', error);
      // Fallback: tentar sem compressão se houver erro
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (currentUpload.current === 'front') {
          setFrontImage(result);
          setStep('side');
        } else {
          setSideImage(result);
          setStep('confirm');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleConfirm = () => {
    if (frontImage) {
      onComplete(frontImage, sideImage);
    }
  };

  const handleSkipSide = () => {
    setStep('confirm');
  };

  return (
    <div className={cn(
      "flex flex-col min-h-[100dvh] px-5",
      isFemale && "female-flow" // Classe para estilização feminina
    )}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture={isIOS() ? "environment" : "user"}
        onChange={handleFileSelect}
        className="hidden"
        id="selfie-file-input"
        style={{
          transform: 'none',
          filter: 'none',
          willChange: 'auto',
        }}
      />
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              {texts.title}
            </motion.h1>

            {/* Subtítulo para fluxo feminino */}
            {isFemale && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base text-white/70 mb-4 max-w-sm"
              >
                {texts.subtitle}
              </motion.p>
            )}

            {/* Example Photos - Melhorado para mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 my-6 sm:my-8 w-full max-w-md mx-auto"
            >
              {/* Front Selfie Example */}
              <div className="text-center flex-1">
                <div className={cn(
                  "w-full max-w-[160px] mx-auto aspect-[3/4] rounded-2xl bg-gradient-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden relative border-2 shadow-lg",
                  isFemale ? "border-pink-400/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]" : "border-white/20"
                )}>
                  <img
                    src={referenceImages.front}
                    alt={isFemale ? "Exemplo de selfie frontal feminina" : "Exemplo de selfie frontal"}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width="160"
                    height="213"
                    onError={(e) => {
                      const target = e.currentTarget;
                      // Fallback para imagem padrão se a referência não existir
                      target.src = isFemale ? '/media/scan_female.jpg' : '/media/scan_male.jpg';
                    }}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      minHeight: '100%',
                    }}
                  />
                  <div className={cn(
                    "absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10",
                    isFemale ? "bg-pink-500" : "bg-primary"
                  )}>
                    1
                  </div>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary font-medium">{texts.frontLabel}</p>
              </div>

              {/* Side Selfie Example */}
              <div className="text-center flex-1">
                <div className={cn(
                  "w-full max-w-[160px] mx-auto aspect-[3/4] rounded-2xl bg-gradient-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden relative border-2 shadow-lg",
                  isFemale ? "border-pink-400/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]" : "border-white/20"
                )}>
                  <img
                    src={referenceImages.side}
                    alt={isFemale ? "Exemplo de selfie lateral feminina" : "Exemplo de selfie lateral"}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width="160"
                    height="213"
                    onError={(e) => {
                      const target = e.currentTarget;
                      // Fallback para imagem padrão se a referência não existir
                      target.src = isFemale ? '/media/scan_female.jpg' : '/media/scan_male.jpg';
                    }}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      minHeight: '100%',
                    }}
                  />
                  <div className={cn(
                    "absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10",
                    isFemale ? "bg-pink-500" : "bg-primary"
                  )}>
                    2
                  </div>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary font-medium">{texts.sideLabel}</p>
              </div>
            </motion.div>

            {/* Safety Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "flex items-center gap-2 mb-8",
                isFemale ? "text-pink-400" : "text-green-500"
              )}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{texts.safetyText}</span>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('front')}
              className={cn(
                "w-full max-w-sm py-4 text-lg font-semibold flex items-center justify-center gap-2 rounded-2xl",
                isFemale 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                  : "btn-primary"
              )}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {texts.ctaText}
            </motion.button>
          </motion.div>
        )}

        {step === 'front' && (
          <motion.div
            key="front"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-2xl font-bold mb-2">
              {isFemale ? 'Selfie Frontal' : 'Selfie Frontal'}
            </h2>
            <p className="text-text-secondary mb-4">
              {isCompressing ? 'Comprimindo imagem...' : isFemale ? 'Olhe diretamente para a câmera, rosto neutro' : 'Olhe diretamente para a câmera'}
            </p>
            
            {isCompressing && (
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Otimizando foto...</span>
              </div>
            )}

            <div className="w-full max-w-sm">
              <CameraCapture
                onCapture={(imageData) => {
                  setFrontImage(imageData);
                  setStep('side');
                }}
                onCancel={() => setStep('intro')}
                onFallbackToUpload={() => {
                  currentUpload.current = 'front';
                  fileInputRef.current?.click();
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                isFemale ? "bg-pink-500" : "bg-primary"
              )}>1</div>
              <span>de 2 fotos</span>
            </div>

            <button
              type="button"
              onClick={() => {
                currentUpload.current = 'front';
                fileInputRef.current?.click();
              }}
              className="mt-3 text-xs md:text-sm text-text-muted hover:text-white underline underline-offset-4"
            >
              {isFemale ? 'Ou escolher da galeria' : 'Ou enviar suas melhores fotos da galeria'}
            </button>
          </motion.div>
        )}

        {step === 'side' && (
          <motion.div
            key="side"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-2xl font-bold mb-2">
              {isFemale ? 'Selfie Lateral' : 'Selfie Lateral'}
            </h2>
            <p className="text-text-secondary mb-4">
              {isCompressing ? 'Comprimindo imagem...' : isFemale ? 'Vire o rosto levemente para o lado (perfil)' : 'Vire o rosto levemente para o lado'}
            </p>
            
            {isCompressing && (
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Otimizando foto...</span>
              </div>
            )}
            
            <div className="w-full max-w-sm">
              <CameraCapture
                onCapture={(imageData) => {
                  setSideImage(imageData);
                  setStep('confirm');
                }}
                onCancel={() => setStep('front')}
                onFallbackToUpload={() => {
                  currentUpload.current = 'side';
                  fileInputRef.current?.click();
                }}
              />
            </div>

            <button
              onClick={handleSkipSide}
              className="mt-4 text-text-muted text-sm hover:text-white transition-colors"
            >
              Pular esta foto →
            </button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            {/* Photo previews */}
            <div className="relative mb-8">
              <div className="flex items-center">
                {frontImage && (
                  <motion.div
                    initial={{ rotate: -10, x: 20 }}
                    animate={{ rotate: -10, x: 0 }}
                    className="relative z-10"
                  >
                    <img
                      src={frontImage}
                      alt="Front"
                      className={cn(
                        "w-40 h-52 md:w-48 md:h-64 rounded-2xl object-cover border-4 shadow-2xl",
                        isFemale ? "border-pink-400/30" : "border-white/20"
                      )}
                    />
                  </motion.div>
                )}
                <motion.div
                  initial={{ rotate: 10, x: -20 }}
                  animate={{ rotate: 10, x: 0 }}
                  className={cn(
                    "w-40 h-52 md:w-48 md:h-64 rounded-2xl border-4 -ml-8",
                    isFemale ? "border-pink-400/30" : "border-white/20",
                    sideImage ? "" : "bg-white/[0.06] flex items-center justify-center"
                  )}
                >
                  {sideImage ? (
                    <img
                      src={sideImage}
                      alt="Side"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-text-muted text-sm">Opcional</span>
                  )}
                </motion.div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {isFemale 
                ? 'Sua análise facial feminina vai começar'
                : 'Sua análise facial vai levar alguns minutos'}
            </h2>

            <p className="text-sm text-text-secondary mb-8 max-w-sm">
              {isFemale 
                ? <>Ao continuar, você consente que analisemos suas fotos para avaliar sua harmonia facial feminina e fornecer recomendações personalizadas para mulheres, conforme descrito em nossa{' '}<a href="#" className="text-pink-400 underline">Política de Privacidade</a>.</>
                : <>Ao continuar, você consente que analisemos suas fotos ('Dados Faciais') para avaliar sua aparência e fornecer recomendações personalizadas, conforme descrito em nossa{' '}<a href="#" className="text-primary underline">Política de Privacidade</a>.</>
              }
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className={cn(
                "w-full max-w-sm py-4 text-lg font-semibold rounded-2xl",
                isFemale 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                  : "btn-primary"
              )}
            >
              Continuar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
