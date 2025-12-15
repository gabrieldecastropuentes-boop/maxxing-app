import { useState } from 'react';
import { motion } from 'framer-motion';
import type { UserData } from '../Quiz';
import { cn } from '../../lib/utils';

interface DataCollectionScreenProps {
  onSubmit: (data: UserData) => void;
}

export function DataCollectionScreen({ onSubmit }: DataCollectionScreenProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    age: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Digite seu nome';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Digite seu email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Haptic feedback on submit
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(formData);
    }, 500);
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 md:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="badge badge-success mb-4 md:mb-5">
          <span className="text-base">🎉</span>
          <span className="font-semibold">Análise Completa!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-2 md:mb-3">
          Seus resultados estão
          <br />
          <span className="text-primary">prontos!</span>
        </h2>
        
        <p className="text-sm md:text-base text-text-secondary max-w-sm mx-auto">
          Insira seus dados para desbloquear sua análise personalizada de atratividade
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit}
        className="card p-5 md:p-7"
      >
        {/* Name Field */}
        <div className="mb-4 md:mb-5">
          <label className="block text-xs md:text-sm font-medium text-text-secondary mb-1.5 md:mb-2">
            Seu Nome
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite seu nome"
            autoComplete="name"
            className={cn(
              "input-field",
              errors.name && "border-red-500/50 focus:border-red-500"
            )}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1.5"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-5 md:mb-6">
          <label className="block text-xs md:text-sm font-medium text-text-secondary mb-1.5 md:mb-2">
            Seu Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            inputMode="email"
            className={cn(
              "input-field",
              errors.email && "border-red-500/50 focus:border-red-500"
            )}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1.5"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mb-5 md:mb-6 p-3 md:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-start gap-2.5 md:gap-3">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Seus dados são <span className="text-white font-medium">100% seguros</span> e nunca serão compartilhados. Usamos apenas para enviar seus resultados.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-4 md:py-5 text-base md:text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Ver Meus Resultados
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>

        {/* Social Proof */}
        <div className="mt-4 md:mt-5 text-center">
          <p className="text-xs md:text-sm text-text-muted">
            Junte-se a <span className="text-white font-semibold">2.347.892</span> pessoas
          </p>
        </div>
      </motion.form>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 md:mt-6 flex flex-wrap justify-center gap-4 md:gap-6"
      >
        {[
          { icon: '⚡', text: 'Resultado Instantâneo' },
          { icon: '🔒', text: 'SSL Criptografado' },
        ].map((badge) => (
          <div key={badge.text} className="flex items-center gap-1.5 text-xs md:text-sm text-text-muted">
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
