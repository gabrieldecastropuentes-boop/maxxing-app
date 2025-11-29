import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  location: string;
  points: number;
  stars: number;
  text?: string;
}

const testimonials: Testimonial[] = [
  { name: 'Felipe', location: 'São Paulo', points: 26, stars: 5 },
  { name: 'João', location: 'Rio de Janeiro', points: 31, stars: 5 },
  { name: 'Maria', location: 'Belo Horizonte', points: 19, stars: 5 },
  { name: 'Carlos', location: 'Curitiba', points: 28, stars: 5 },
  { name: 'Ana', location: 'Porto Alegre', points: 22, stars: 5 },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold text-base sm:text-lg">
                {current.name}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">{current.location}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl sm:text-2xl">
                +{current.points} pontos
              </p>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: current.stars }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-white/20'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

