import { motion } from 'framer-motion';

interface RiskFreeBadgesProps {
  variant?: 'horizontal' | 'grid';
  className?: string;
}

const badges = [
  { icon: '✅', text: '100% Gratuito', color: 'green' },
  { icon: '💳', text: 'Sem Cartão de Crédito', color: 'blue' },
  { icon: '⚡', text: 'Resultado Instantâneo', color: 'yellow' },
  { icon: '🔒', text: 'Dados Protegidos (SSL)', color: 'purple' },
];

export function RiskFreeBadges({ variant = 'horizontal', className = '' }: RiskFreeBadgesProps) {
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {badges.map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-sm text-white/90 font-medium">{badge.text}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 ${className}`}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/90"
        >
          <span>{badge.icon}</span>
          <span className="font-medium">{badge.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

