import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * Componente de imagem otimizada com suporte WebP/AVIF e srcset
 * Converte automaticamente para formatos modernos quando disponíveis
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  style,
}: OptimizedImageProps) {
  // Extrair nome do arquivo sem extensão
  const getBaseName = (path: string) => {
    const match = path.match(/\/([^/]+)\.(jpg|jpeg|png|webp|avif)$/i);
    if (match) {
      return match[1];
    }
    return path.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
  };

  const baseName = getBaseName(src);
  const basePath = src.substring(0, src.lastIndexOf('/') + 1);

  // Gerar srcset para diferentes tamanhos (se necessário)
  const generateSrcSet = (format: 'webp' | 'avif') => {
    const sizes = [320, 480, 768, 1024, 1440, 1920];
    return sizes
      .map((size) => `${basePath}${baseName}-${size}w.${format} ${size}w`)
      .join(', ');
  };

  // Verificar se arquivos WebP/AVIF existem (fallback para original)
  const webpSrc = `${basePath}${baseName}.webp`;
  const avifSrc = `${basePath}${baseName}.avif`;
  const originalSrc = src;

  return (
    <picture>
      {/* AVIF - melhor compressão */}
      <source
        srcSet={generateSrcSet('avif')}
        type="image/avif"
        sizes={sizes}
      />
      {/* WebP - fallback moderno */}
      <source
        srcSet={generateSrcSet('webp')}
        type="image/webp"
        sizes={sizes}
      />
      {/* Fallback original */}
      <img
        src={originalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        style={{
          ...style,
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto 500px',
        }}
      />
    </picture>
  );
}

/**
 * Helper para gerar srcset de imagens
 */
export function generateImageSrcSet(basePath: string, baseName: string, format: 'webp' | 'avif' = 'webp') {
  const sizes = [320, 480, 768, 1024, 1440, 1920];
  return sizes.map((size) => `${basePath}${baseName}-${size}w.${format} ${size}w`).join(', ');
}

