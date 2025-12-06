import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { compressImage, fileToBase64, isIOS } from '../../utils/imageCompression';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFallbackToUpload?: () => void;
  title?: string;
  instruction?: string;
}

export function CameraCapture({ onCapture, onCancel, isLoading = false, onFallbackToUpload, title = 'Selfie Frontal', instruction = 'Olhe diretamente para a câmera' }: CameraCaptureProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isReady, setIsReady] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsReady(false);
    stopCamera();

    // Verifica suporte à câmera no navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setError('Este dispositivo/navegador não suporta acesso à câmera.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Sempre usar câmera frontal para selfie
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Acesso à câmera negado. Por favor, permita o acesso nas configurações.');
        } else if (err.name === 'NotFoundError') {
          setError('Nenhuma câmera encontrada no dispositivo.');
        } else {
          setError('Erro ao acessar a câmera. Tente novamente.');
        }
      } else {
        setError('Erro ao acessar a câmera. Tente novamente.');
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [startCamera, stopCamera, capturedImage]);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    setIsCompressing(true);

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video directly (no flip needed since video is already correct)
      ctx.drawImage(video, 0, 0);

      // Converter canvas para Blob primeiro
      canvas.toBlob(async (blob) => {
        if (!blob) {
          // Fallback: usar toDataURL direto
          const imageData = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(imageData);
          stopCamera();
          setIsCompressing(false);
          return;
        }

        try {
          // Criar File a partir do Blob para compressão
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          
          // Comprimir imagem
          const compressed = await compressImage(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            initialQuality: 0.85,
          });

          // Converter para base64
          const compressedBase64 = await fileToBase64(compressed);
          setCapturedImage(compressedBase64);
        } catch (compressionError) {
          console.warn('[CameraCapture] Erro na compressão, usando imagem original:', compressionError);
          // Fallback: usar imagem original
          const imageData = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(imageData);
        } finally {
          stopCamera();
          setIsCompressing(false);
        }
      }, 'image/jpeg', 0.9);

      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('[CameraCapture] Erro ao capturar:', error);
      setIsCompressing(false);
    }
  }, [isReady, stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  // Camera not supported or permission denied - Tela de erro baseada no print
  if (hasPermission === false) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        {/* Ícone de erro */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 mb-6 flex items-center justify-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Mensagem de erro */}
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-bold text-white mb-2"
        >
          Câmera indisponível
        </motion.h2>
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-white/70 mb-2 max-w-sm"
        >
          {error || 'Use o botão de upload para selecionar foto da galeria ou câmera.'}
        </motion.p>

        {/* Botões de ação */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 w-full max-w-xs mt-8"
        >
          {onFallbackToUpload && (
            <button
              onClick={onFallbackToUpload}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35] text-white font-semibold rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Enviar fotos da galeria
            </button>
          )}
          <button
            onClick={onCancel}
            className="w-full py-4 px-6 bg-white/10 backdrop-blur-sm text-white font-medium rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <canvas ref={canvasRef} className="hidden" />

      {!capturedImage ? (
        <>
          {/* Header com botão de voltar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 safe-top">
            <button
              onClick={onCancel}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Voltar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            
            {/* Avatar placeholder (opcional) */}
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20"></div>
          </div>

          {/* Camera View - Full Screen */}
          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Loading overlay */}
            {!isReady && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin w-10 h-10 text-white mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-white/70">Iniciando câmera...</p>
                </div>
              </div>
            )}

            {/* Face guide overlay - Oval branco como no print */}
            {isReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 md:w-72 md:h-96 border-2 border-white rounded-full"></div>
              </div>
            )}

            {/* Instrução */}
            {isReady && (
              <div className="absolute top-24 left-0 right-0 text-center pointer-events-none px-4">
                <p className="text-white text-sm">{instruction}</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar - Baseado no print */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 safe-bottom z-50">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Botão de Galeria - Melhorado */}
              {onFallbackToUpload && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onFallbackToUpload();
                  }}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center text-white hover:text-white transition-colors bg-white/10 rounded-full border border-white/20 hover:bg-white/20"
                  aria-label="Abrir galeria"
                  title="Abrir galeria"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              )}

              {/* Espaço flexível para centralizar o botão de captura */}
              <div className="flex-1" />

              {/* Botão de captura circular grande - Sempre visível */}
              <button
                onClick={handleCapture}
                disabled={!isReady || isCompressing}
                className={cn(
                  "w-14 h-14 rounded-full border-4 transition-all z-50",
                  isReady && !isCompressing
                    ? "bg-white border-white shadow-lg hover:scale-105 active:scale-95"
                    : "bg-white/50 border-white/50 cursor-not-allowed"
                )}
                aria-label="Capturar foto"
                title="Capturar foto"
              >
                {isCompressing && (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="animate-spin w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Espaço flexível para equilibrar */}
              <div className="flex-1" />

              {/* Menu dots (opcional - pode ser removido ou mantido) */}
              {onFallbackToUpload && (
                <div className="min-w-[44px] min-h-[44px] w-11 h-11" />
              )}
            </div>
          </div>
        </>
      ) : (
        // Preview Screen - Baseado no print
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col h-full bg-black"
        >
          {/* Preview Image */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={capturedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 safe-bottom bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Botão Confirmar */}
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full mb-3 py-4 px-6 bg-gradient-to-r from-[#FF4D4D] to-[#FF6B35] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Confirmar
            </button>

            {/* Botão Tirar Outra */}
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className="w-full py-2 text-white text-sm flex items-center justify-center gap-2 hover:text-white/80 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tirar outra foto
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}