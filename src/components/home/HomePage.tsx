import { useEffect } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { AspirationalHero } from './AspirationalHero';
import { LooksmaxxingSection } from './LooksmaxxingSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SocialProofSection } from './SocialProofSection';
import { TopArtistsSection } from './TopArtistsSection';
import { FinalCTASection } from './FinalCTASection';
import { RiskFreeBadges } from './RiskFreeBadges';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { SocialProofBanner } from './SocialProofBanner';
import { FAQSection } from './FAQSection';
import { ExitIntentPopup } from './ExitIntentPopup';
import { tracking } from '../../lib/tracking';

export function HomePage() {
  // Track home view
  useEffect(() => {
    tracking.homeView();
  }, []);
  
  return (
    <div 
      className="relative min-h-screen overflow-x-hidden"
      style={{
        isolation: 'isolate',
        position: 'relative'
      }}
    >
      <Header />
      <div 
        className="pt-[60px] sm:pt-[80px] overflow-x-hidden"
        style={{
          isolation: 'isolate',
          position: 'relative',
          contain: 'layout style'
        }}
      >
        {/* Modularização: Cada seção isolada para evitar interferências - OTIMIZADO */}
        <section className="isolation-section">
      <HeroSection />
        </section>
        <section className="isolation-section">
      <AspirationalHero />
        </section>
        <section className="isolation-section">
      <LooksmaxxingSection />
        </section>
        <section className="isolation-section">
      <HowItWorksSection />
        </section>
        <section className="isolation-section">
      <SocialProofSection />
        </section>
        <section className="isolation-section">
      <TopArtistsSection />
        </section>
        
        {/* Testimonials Carousel */}
        <section className="isolation-section section-container py-10 sm:py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Resultados Reais
            </h2>
            <p className="text-sm sm:text-base text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Veja o que nossos usuários estão alcançando
            </p>
          </div>
          <TestimonialsCarousel />
        </section>
        
        {/* FAQ Section */}
        <section className="isolation-section">
          <FAQSection />
        </section>
        
        <section className="isolation-section">
      <FinalCTASection />
        </section>
      </div>
      
      {/* Social Proof Banner (floating) */}
      <SocialProofBanner />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
}
