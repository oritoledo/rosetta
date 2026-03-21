import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LandingFooter() {
  const navigate = useNavigate()
  const isReturningUser = !!localStorage.getItem('rosetta_user')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(232,238,245,0.06)',
        padding: '80px 0 48px',
        position: 'relative',
      }}
    >
      {/* Top CTA band */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          maxWidth: 1100,
          margin: '0 auto 72px',
          padding: '0 48px',
          textAlign: 'center' as const,
        }}
      >
        <h2
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Your first conversation
          <br />
          <span style={{ color: 'var(--lapis-bright)' }}>starts here.</span>
        </h2>

        <p
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: 17,
            fontStyle: 'italic',
            color: 'var(--moon-dim)',
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Free to start. No credit card. Pick a language and your first scene in two minutes.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(isReturningUser ? '/' : '/onboarding')}
          style={{
            background: 'var(--lapis)',
            border: '1px solid rgba(52,211,153,0.4)',
            borderRadius: 14,
            height: 56,
            padding: '0 40px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.12em',
            color: 'var(--moon-bright)',
            boxShadow: '0 0 40px rgba(5,150,105,0.3)',
          }}
        >
          {isReturningUser ? 'Open App →' : 'Begin Your Journey →'}
        </motion.button>
      </motion.div>

      {/* Footer bottom */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          gap: 24,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--lapis-bright)', opacity: 0.6 }}>𓂀</span>
          <span
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 14,
              fontWeight: 900,
              color: 'var(--moon-dim)',
              letterSpacing: '0.18em',
            }}
          >
            ROSETTA
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'Languages', id: 'languages' },
          ].map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--moon)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: 10,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                transition: 'color 150ms',
                padding: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontSize: 11,
            color: 'var(--muted)',
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          © 2026 Rosetta · Speak every tongue.
        </p>
      </div>
    </footer>
  )
}
