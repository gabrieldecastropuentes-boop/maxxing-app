import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/utils';

// Mock data for top artists - replace with real data
const topArtists = [
  { id: 1, name: 'Artist 1', score: 92, image: '/media/scan_male.jpg' },
  { id: 2, name: 'Artist 2', score: 89, image: '/media/scan_male.jpg' },
  { id: 3, name: 'Artist 3', score: 87, image: '/media/scan_male.jpg' },
  { id: 4, name: 'Artist 4', score: 85, image: '/media/scan_male.jpg' },
];

export function TopArtistsSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="section-container py-16 sm:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="rounded-[28px] sm:rounded-[36px] border border-white/8 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 lg:p-12 shadow-[0_25px_90px_rgba(0,0,0,0.5)]"
      >
        {/* Header with View All button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-2 sm:mb-3">
              TOP PERFORMERS
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Top Artists
            </h2>
          </div>
          <a
            href="/artists"
            className={cn(
              'inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3',
              'rounded-xl sm:rounded-2xl border border-white/20 bg-white/5',
              'text-sm sm:text-base font-medium text-white',
              'hover:bg-white/10 hover:border-white/30 transition-all duration-200',
              'whitespace-nowrap'
            )}
          >
            View All
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {topArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className={cn(
                'rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0F0D10]/80',
                'overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.4)]',
                'hover:border-white/20 transition-all duration-300'
              )}
            >
              <div className="relative aspect-square">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/media/scan_male.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90 text-white text-xs font-bold">
                  {artist.score}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {artist.name}
                </h3>
                <p className="text-xs text-white/60 mt-1">Score: {artist.score}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

