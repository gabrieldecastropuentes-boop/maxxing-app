import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-5 md:px-6 max-w-2xl mx-auto py-4">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium bg-primary/10 border border-primary/20 text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="uppercase tracking-wider font-semibold">
            Análise Científica
          </span>
        </div>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display mb-4 md:mb-6 leading-[1.1] tracking-tight"
      >
        A Verdade Científica
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
          Sobre Sua Atratividade
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-text-secondary mb-6 md:mb-8 max-w-md leading-relaxed"
      >
        Seu rosto esconde um segredo. Descubra sua pontuação exata de atratividade e o que{' '}
        <span className="text-white font-medium">a ciência das proporções faciais</span>{' '}
        diz sobre o seu verdadeiro potencial de Maxxing.
      </motion.p>

      {/* Social Proof Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 md:mb-10"
      >
        {[
          { value: '2M+', label: 'Pessoas testadas' },
          { value: '4.9', label: 'Avaliação', icon: '⭐' },
          { value: '2min', label: 'Tempo médio' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-1">
              {stat.icon && <span className="text-lg">{stat.icon}</span>}
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-text-muted">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <button
          onClick={onStart}
          className="btn-primary w-full text-base md:text-lg px-8 py-4 md:py-5 rounded-2xl group"
        >
          <span className="flex items-center justify-center gap-2">
            Iniciar Análise Facial Secreta
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        <p className="mt-3 text-xs md:text-sm text-text-muted flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Algoritmo exclusivo, 100% anônimo e baseado em IA de proporções faciais
        </p>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 md:mt-14 grid grid-cols-3 gap-3 md:gap-4 w-full"
      >
        {[
          { icon: '', label: 'Análise de Simetria', desc: 'IA avançada aplicada aos seus traços faciais' },
          { icon: '', label: 'Proporções Áureas', desc: 'Os mesmos critérios usados em modelos e celebridades' },
          { icon: '', label: 'Potencial de Maxxing', desc: 'O que está segurando sua nota atual – e como destravar' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className={cn(
              "card p-3 md:p-4 text-left",
              "hover:bg-white/[0.06] transition-colors"
            )}
          >
            <div className="text-xs md:text-sm font-semibold text-white mb-0.5">{item.label}</div>
            <div className="text-[10px] md:text-xs text-text-muted">{item.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-10 md:mt-14 pt-6 md:pt-8 border-t border-white/[0.06] w-full"
      >
        <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-wider mb-3 md:mb-4">
          Baseado em pesquisas de
        </p>
        <div className="flex justify-center items-center gap-6 md:gap-10">
          {['Harvard', 'Stanford', 'MIT'].map((uni) => (
            <span key={uni} className="text-sm md:text-base font-semibold text-white/40 hover:text-white/60 transition-colors">
              {uni}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 md:mt-10 card p-4 md:p-5 max-w-md"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
            JP
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              "Incrível como foi preciso! Me ajudou a entender meus pontos fortes e o que melhorar."
            </p>
            <p className="text-xs text-text-muted mt-1">João P. — São Paulo</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
