import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { compressImage, fileToBase64, isIOS } from '../../utils/imageCompression';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFallbackToUpload?: () => void;
}

export function CameraCapture({ onCapture, onCancel, isLoading = false, onFallbackToUpload }: CameraCaptureProps) {
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

    // CORREÇÃO: iOS Safari - usar input file direto em vez de getUserMedia (mais estável)
    if (isIOS()) {
      setHasPermission(false);
      setError('Use o botão de upload para selecionar foto da galeria ou câmera.');
      if (onFallbackToUpload) {
        // Auto-fallback para input file em iOS
        setTimeout(() => {
          onFallbackToUpload();
        }, 1000);
      }
      return;
    }

    // Verifica suporte à câmera no navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setError('Este dispositivo/navegador não suporta acesso à câmera.');
      if (onFallbackToUpload) {
        setTimeout(() => {
          onFallbackToUpload();
        }, 1000);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
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
      
      // Fallback para input file se getUserMedia falhar
      if (onFallbackToUpload) {
        setTimeout(() => {
          onFallbackToUpload();
        }, 2000);
      }
    }
  }, [facingMode, stopCamera, onFallbackToUpload]);

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

      // Flip horizontally if using front camera
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

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
  }, [facingMode, isReady, stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setCapturedImage(null);
  }, []);

  // Camera not supported or permission denied
  if (hasPermission === false) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-white font-medium mb-2">Câmera indisponível</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <div className="flex flex-col gap-3 items-center">
          {onFallbackToUpload && (
            <button
              onClick={onFallbackToUpload}
              className="btn-primary w-full max-w-xs"
            >
              Enviar fotos da galeria
            </button>
          )}
          <button onClick={onCancel} className="btn-secondary w-full max-w-xs">
            Voltar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {!capturedImage ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Camera View */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                facingMode === 'user' && "scale-x-[-1]"
              )}
            />

            {/* Loading overlay */}
            {!isReady && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin w-8 h-8 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-text-muted">Iniciando câmera...</p>
                </div>
              </div>
            )}

            {/* Face guide overlay */}
            {isReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 md:w-56 md:h-72 border-2 border-white/40 rounded-[50%] border-dashed">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full">
                    <p className="text-xs text-white whitespace-nowrap">Posicione seu rosto aqui</p>
                  </div>
                </div>
              </div>
            )}

            {/* Camera controls */}
            {isReady && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={toggleCamera}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Capture button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="btn-secondary px-6 py-3"
            >
              Cancelar
            </button>
            <button
              onClick={handleCapture}
              disabled={!isReady || isCompressing}
              className="btn-primary px-8 py-3 disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {isCompressing ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Comprimindo...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capturar
                  </>
                )}
              </span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 max-w-sm mx-auto">
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className="flex-1 btn-secondary py-3 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tirar outra
              </span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analisando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar
                </span>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

