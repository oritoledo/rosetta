import { useEffect } from 'react'
import LandingNav from '../components/landing/LandingNav'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import PersonaSection from '../components/landing/PersonaSection'
import LanguageSection from '../components/landing/LanguageSection'
import LandingFooter from '../components/landing/LandingFooter'

export default function LandingScreen() {
  // The app-level body has overflow: hidden — we need our own scroll context
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#0e0e0c',
        color: 'var(--moon)',
      }}
    >
      {/* Suppress horizontal scroll globally for this page */}
      <style>{`
        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
        }
        @media (max-width: 960px) {
          .landing-hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; padding: 0 24px !important; }
          .landing-hero-phone { display: none !important; }
        }
        @media (max-width: 720px) {
          .landing-hero-grid { padding: 0 20px !important; }
        }
      `}</style>

      <LandingNav />

      {/* Page offset for fixed nav */}
      <div id="landing-root">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <PersonaSection />
        <LanguageSection />
        <LandingFooter />
      </div>
    </div>
  )
}
