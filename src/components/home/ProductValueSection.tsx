import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/utils';

const highlights = [
  'Blueprint completo (PDF + versão mobile) com prioridades semanais',
  'Checklists de grooming, estilo e postura validados por especialistas',
  'Acesso ao grupo Maxxing com feedback semanal',
  'Atualizações vitalícias conforme o algoritmo evolui',
];

export function ProductValueSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="section-container py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center rounded-[30px] sm:rounded-[40px] border border-white/8 bg-white/[0.02] p-6 sm:p-8 lg:p-12 shadow-[0_35px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 bg-black/40 w-full">
          <picture>
            <source 
              srcSet="/media/product_blueprint-480w.avif 480w, /media/product_blueprint-768w.avif 768w, /media/product_blueprint-1024w.avif 1024w"
              type="image/avif"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
            <source 
              srcSet="/media/product_blueprint-480w.webp 480w, /media/product_blueprint-768w.webp 768w, /media/product_blueprint-1024w.webp 1024w"
              type="image/webp"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
          <img
            src="/media/product_blueprint.jpg"
            alt="Blueprint do produto Maxxing"
            className="w-full h-full object-cover"
              loading="lazy"
              width="500"
              height="667"
          />
          </picture>
        </div>

        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-3">
            Produto Maxxing
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Não é um ebook genérico. É seu manual de posicionamento pessoal.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
            Assim que o quiz terminar, você destrava o blueprint com as alavancas específicas
            para acelerar sua evolução. Cada recomendação vem com contexto, tempo de execução e impacto previsto.
          </p>
          <div className="mt-6 space-y-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 leading-relaxed'
                )}
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF4D4D]" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

