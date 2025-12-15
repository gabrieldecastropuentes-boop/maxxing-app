import { useState, useRef, useEffect } from 'react';
import { tracking } from '../../lib/tracking';

interface PhotoUploadScreenProps {
  onPhotoCapture: (imageData: string) => void;
  onBack: () => void;
}

export function PhotoUploadScreen({ onPhotoCapture, onBack }: PhotoUploadScreenProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // FUNÇÃO: Iniciar Câmera (CORRIGIDO)
  // ============================================
  const startCamera = async () => {
    try {
      setError(null);
      tracking.photoUploadStart();
      
      // Parar stream anterior
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // CRÍTICO: Espelhar apenas preview (não a captura)
        if (facingMode === 'user') {
          videoRef.current.style.transform = 'scaleX(-1)';
        } else {
          videoRef.current.style.transform = 'scaleX(1)';
        }
        
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setIsCameraActive(false);
      tracking.photoUploadError(err instanceof Error ? err.message : 'Camera access error');
    }
  };

  // ============================================
  // FUNÇÃO: Capturar Foto (SEM espelhamento)
  // ============================================
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Espelhar canvas se for câmera frontal
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (facingMode === 'user') {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }

    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(imageData);
    stopCamera();
    tracking.photoUploadSuccess();
  };

  // ============================================
  // FUNÇÃO: Abrir Galeria (CORRIGIDO)
  // ============================================
  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    tracking.photoUploadStart();

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.');
      tracking.photoUploadError('Invalid file type');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem é muito grande. Máximo 10MB.');
      tracking.photoUploadError('File too large');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setError(null);
      tracking.photoUploadSuccess();
    };
    reader.onerror = () => {
      setError('Erro ao carregar imagem. Tente novamente.');
      tracking.photoUploadError('File read error');
    };
    reader.readAsDataURL(file);
  };

  // ============================================
  // FUNÇÃO: Alternar Câmera
  // ============================================
  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isCameraActive) {
      startCamera();
    }
  };

  // ============================================
  // FUNÇÃO: Parar Câmera
  // ============================================
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      
      {/* Header - SEM URL */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Enviar Selfie</h1>
        <div className="w-10" />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {!capturedImage ? (
          <>
            {/* Preview da Câmera */}
            <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-6">
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
              />

              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}

              {/* Botão Alternar Câmera */}
              {isCameraActive && (
                <button
                  onClick={switchCamera}
                  className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-md w-full flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Instruções */}
            <p className="text-center text-gray-400 mb-8 max-w-md px-4">
              Posicione seu rosto no centro e certifique-se de que está bem iluminado
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
              
              {/* BOTÃO GALERIA - CORRIGIDO */}
              <button
                onClick={openGallery}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Escolher da Galeria</span>
              </button>

              {/* Input File Escondido */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* BOTÃO CÂMERA - SEMPRE VISÍVEL */}
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] hover:opacity-90 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Abrir Câmera</span>
                </button>
              ) : (
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] hover:opacity-90 rounded-xl transition-all font-medium"
                >
                  📸 Tirar Foto
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Preview da Foto Capturada */}
            <div className="w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden mb-8">
              <img src={capturedImage} alt="Foto capturada" className="w-full h-full object-cover" />
            </div>

            {/* Botões Confirmar/Refazer */}
            <div className="flex gap-4 w-full max-w-md px-4">
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setError(null);
                  startCamera();
                }}
                className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium"
              >
                Tirar Novamente
              </button>
              <button
                onClick={() => onPhotoCapture(capturedImage)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] hover:opacity-90 rounded-xl transition-all font-medium"
              >
                Confirmar ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
