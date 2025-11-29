import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { processAndCompressImage, isIOS } from '../../utils/imageCompression';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  isLoading?: boolean;
}

export function ImageUploader({ onImageSelect, isLoading = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCompressing, setIsCompressing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setIsCompressing(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.');
      setIsCompressing(false);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 10MB.');
      setIsCompressing(false);
      return;
    }

    try {
      // Comprimir imagem antes de mostrar preview
      const compressedBase64 = await processAndCompressImage(file);
      setPreview(compressedBase64);
    } catch (error) {
      console.error('[ImageUploader] Erro ao processar imagem:', error);
      setError('Erro ao processar imagem. Tente novamente.');
      // Fallback: tentar sem compressão
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.onerror = () => {
        setError('Erro ao ler o arquivo. Tente novamente.');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (preview) {
      onImageSelect(preview);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture={isIOS() ? "environment" : "user"}
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload-input"
        style={{
          transform: 'none',
          filter: 'none',
          willChange: 'auto',
        }}
      />

      {!preview ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-white/20 bg-white/[0.03] hover:border-primary/50 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-colors",
              isDragging ? "bg-primary/20" : "bg-white/[0.06]"
            )}>
              <svg
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 transition-colors",
                  isDragging ? "text-primary" : "text-text-secondary"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-base md:text-lg font-semibold text-white mb-1">
                {isCompressing ? 'Comprimindo imagem...' : isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste uma foto'}
              </p>
              <p className="text-sm text-text-muted">
                JPG, PNG ou WEBP • Máximo 10MB
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Use uma foto frontal com boa iluminação</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-square max-w-sm mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 md:w-56 md:h-72 border-2 border-white/30 rounded-[50%] border-dashed" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className="flex-1 btn-secondary py-3 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Trocar
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

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

