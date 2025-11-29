import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface HaircutInfoBlockProps {
  imageSrc?: string;
  gender?: 'male' | 'female';
}

export function HaircutInfoBlock({ imageSrc, gender = 'male' }: HaircutInfoBlockProps) {
  const isFemale = gender === 'female';
  
  // Usar imagem baseada no gênero se não for fornecida
  const defaultImage = isFemale ? '/media/cortecabelo.jpg' : '/media/cortecabelo.jpg';
  const finalImageSrc = imageSrc || defaultImage;

  // Textos adaptados por gênero
  const texts = {
    title: isFemale 
      ? 'A verdade é simples: seu corte e penteado podem realçar — ou esconder — sua beleza natural.'
      : 'A verdade é simples: seu corte de cabelo pode melhorar — ou destruir — sua aparência.',
    paragraph: isFemale
      ? '90% das mulheres usam um corte ou penteado que não valoriza seus traços… e nem percebem que estão escondendo seu potencial de beleza todos os dias.'
      : '90% das pessoas usam um corte totalmente incompatível com o formato do rosto… e nem percebem que estão desperdiçando 2 a 3 pontos de atratividade todos os dias.',
    callout: isFemale
      ? 'Veja como um simples ajuste no estilo pode valorizar toda a harmonia do seu rosto:'
      : 'Aqui está um exemplo de como um simples ajuste no estilo já muda toda a harmonia do rosto:',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full space-y-4 sm:space-y-5 md:space-y-6 mb-4 sm:mb-6"
    >
      {/* Micro-texto chamativo e emocional */}
      <div className="space-y-3 sm:space-y-4">
        {/* Título chamativo - otimizado para mobile */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug"
        >
          {texts.title}
        </motion.h2>

        {/* Parágrafo com impacto emocional */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed"
        >
          {texts.paragraph}
        </motion.p>

        {/* Linha final que cria curiosidade */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className={cn(
            "text-sm sm:text-base md:text-lg font-medium leading-relaxed",
            isFemale ? "text-pink-400" : "text-primary"
          )}
        >
          {texts.callout}
        </motion.p>
      </div>

      {/* Imagem destacada - otimizada para mobile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="w-full flex justify-center my-4 sm:my-6"
      >
        <div className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] relative">
          {/* Glow effect sutil - cores adaptadas por gênero */}
          <div className={cn(
            "absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-40",
            isFemale 
              ? "bg-gradient-to-r from-pink-500/25 via-rose-500/25 to-pink-500/25" 
              : "bg-gradient-to-r from-[#FF4D4D]/25 via-[#FF6B35]/25 to-[#FF4D4D]/25"
          )} />
          
          {/* Container da imagem */}
          <div className={cn(
            "relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
            isFemale ? "border-pink-500/20" : "border-white/5"
          )}>
            <img
              src={finalImageSrc}
              alt={isFemale 
                ? "Exemplo de como um penteado adequado valoriza a harmonia facial feminina" 
                : "Exemplo de como um corte de cabelo adequado transforma a harmonia do rosto"}
              className="w-full h-auto object-contain"
              style={{ 
                display: 'block',
                width: '100%',
                height: 'auto',
                maxWidth: '100%'
              }}
              loading="eager"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
