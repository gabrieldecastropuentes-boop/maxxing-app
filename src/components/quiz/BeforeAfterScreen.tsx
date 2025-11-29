import { motion } from 'framer-motion';

interface BeforeAfterScreenProps {
  onContinue: () => void;
}

export function BeforeAfterScreen({ onContinue }: BeforeAfterScreenProps) {
  const beforePoints = [
    "Se sente indesejado no dating",
    "Desajeitado em situações sociais",
    "Sempre tem que dar o primeiro passo",
    "Inseguro com a aparência",
    "Medo de rejeição",
  ];

  const afterPoints = [
    "Se sente atraente e confiante",
    "Alta autoestima",
    "Mulheres te abordam primeiro",
    "Confiante em qualquer situação",
    "Vida social ativa",
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Comparison Cards */}
      <div className="flex-1 flex">
        {/* Before Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-gradient-to-b from-gray-800/50 to-gray-900/80 p-4 md:p-6 flex flex-col"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            Antes do
            <br />
            Maxxing
          </h2>

          <div className="space-y-3 md:space-y-4 flex-1">
            {beforePoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-red-500 text-lg">✕</span>
                <span className="text-sm md:text-base font-medium">{point}</span>
              </motion.div>
            ))}
          </div>

          {/* Before photo */}
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-40 md:w-40 md:h-48 rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img
                src="/media/antes%20do%20maxxing.png"
                alt="Antes do Maxxing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* After Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-gradient-to-b from-green-600 to-green-700 p-4 md:p-6 flex flex-col"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-green-950">
            Depois do
            <br />
            Maxxing
          </h2>

          <div className="space-y-3 md:space-y-4 flex-1">
            {afterPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-green-950 text-lg">✓</span>
                <span className="text-sm md:text-base font-medium text-green-950">{point}</span>
              </motion.div>
            ))}
          </div>

          {/* After photo */}
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-40 md:w-40 md:h-48 rounded-2xl overflow-hidden border border-green-500/60 bg-black">
              <img
                src="/media/depois%20do%20maxxing.png"
                alt="Depois do Maxxing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="p-5 pb-8 safe-bottom">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="btn-primary w-full py-4 text-lg font-semibold"
        >
          Próximo
        </motion.button>
      </div>
    </div>
  );
}

