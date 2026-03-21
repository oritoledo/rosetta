import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LandingNav() {
  const navigate = useNavigate()
  const isReturningUser = !!localStorage.getItem('rosetta_user')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'problem' },
    { label: 'Languages', id: 'languages' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        background: 'rgba(14,14,12,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,238,245,0.06)',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16, color: 'var(--lapis-bright)', opacity: 0.7 }}>𓂀</span>
        <span
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--moon-bright)',
            letterSpacing: '0.18em',
          }}
        >
          ROSETTA
        </span>
      </div>

      {/* Center nav links */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          // hide on narrow viewports via inline — handled by CSS class fallback
        }}
        className="landing-nav-links"
      >
        {navLinks.map(({ label, id }) => (
          <NavLink key={label} label={label} onClick={() => scrollTo(id)} />
        ))}
      </div>

      {/* CTA */}
      {isReturningUser ? (
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '1px solid rgba(232,238,245,0.15)',
            borderRadius: 20,
            padding: '8px 20px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: 'var(--moon)',
          }}
        >
          Open App →
        </button>
      ) : (
        <button
          onClick={() => navigate('/onboarding')}
          style={{
            background: 'var(--lapis)',
            border: '1px solid rgba(52,211,153,0.35)',
            borderRadius: 20,
            padding: '8px 20px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: 'var(--moon-bright)',
            boxShadow: '0 0 20px rgba(5,150,105,0.25)',
          }}
        >
          Start Free →
        </button>
      )}
    </motion.nav>
  )
}

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--moon)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--moon-dim)')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Cinzel, serif',
        fontSize: 10,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.12em',
        color: 'var(--moon-dim)',
        transition: 'color 150ms',
        padding: 0,
      }}
    >
      {label}
    </button>
  )
}
