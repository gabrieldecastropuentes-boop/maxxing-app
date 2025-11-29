import imageCompression from 'browser-image-compression';

/**
 * Detecta se o dispositivo é iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Detecta se está em WebView
 */
export const isWebView = (): boolean => {
  return /wv/.test(navigator.userAgent);
};

/**
 * Comprime imagem client-side usando browser-image-compression
 * Otimizado para mobile com fallback e retry
 */
export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    initialQuality?: number;
  }
): Promise<File> {
  const {
    maxSizeMB = 0.5, // 500KB
    maxWidthOrHeight = 1280,
    useWebWorker = true,
    initialQuality = 0.85,
  } = options || {};

  // Validação inicial
  if (!file.type.startsWith('image/')) {
    throw new Error('Arquivo deve ser uma imagem');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Imagem muito grande. Máximo 10MB.');
  }

  // Ajustar qualidade para WebView ou devices low-end
  const quality = isWebView() ? 0.7 : initialQuality;

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker,
    fileType: 'image/jpeg',
    initialQuality: quality,
  };

  try {
    const compressed = await imageCompression(file, compressionOptions);

    // Validar resultado - se ainda muito grande, tentar novamente com qualidade menor
    if (compressed.size > 1024 * 1024) { // > 1MB
      console.warn('[ImageCompression] Primeira compressão não reduziu o suficiente, tentando novamente...');
      const retryOptions = {
        ...compressionOptions,
        initialQuality: 0.6,
      };
      return await imageCompression(file, retryOptions);
    }

    return compressed;
  } catch (error) {
    console.error('[ImageCompression] Erro ao comprimir:', error);
    // Fallback: retornar arquivo original se compressão falhar
    throw new Error('Erro ao processar imagem. Tente novamente.');
  }
}

/**
 * Converte File para base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Processa e comprime imagem, retornando base64
 * Função principal para uso nos componentes
 */
export async function processAndCompressImage(file: File): Promise<string> {
  try {
    const compressed = await compressImage(file);
    return await fileToBase64(compressed);
  } catch (error) {
    console.error('[processAndCompressImage] Erro:', error);
    throw error;
  }
}

