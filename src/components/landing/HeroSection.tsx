import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HeroSection() {
  const navigate = useNavigate()

  const scrollToProblem = () => {
    document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG Layer 1 — emerald radial glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          top: -200,
          right: -200,
          background: 'radial-gradient(ellipse, rgba(5,150,105,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* BG Layer 2 — drifting hieroglyph grid */}
      <motion.div
        animate={{ y: [0, -30] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 0,
          color: 'rgba(52,211,153,0.06)',
          fontSize: '1.2rem',
          letterSpacing: '2.5rem',
          lineHeight: '3rem',
          userSelect: 'none',
        }}
      >
        {'𓂀'.repeat(200)}
      </motion.div>

      {/* BG Layer 3 — bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(0deg, #0e0e0c 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content */}
      <div
        className="landing-hero-grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 48px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 480px',
          gap: 80,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left column */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Eyebrow pill */}
          <motion.div variants={itemVariant}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(5,150,105,0.2)',
                border: '1px solid rgba(52,211,153,0.25)',
                borderRadius: 20,
                padding: '6px 16px',
                fontFamily: 'Cinzel, serif',
                fontSize: 9,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.2em',
                color: 'var(--lapis-bright)',
              }}
            >
              𓆣 Language Learning · Reimagined
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginTop: 20 }}>
            {[
              { text: 'Speak', style: { color: 'var(--moon-bright)' } },
              {
                text: 'Every',
                style: {
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(232,238,245,0.4)',
                },
              },
              {
                text: 'Tongue.',
                style: {
                  color: 'var(--lapis-bright)',
                  textShadow: '0 0 60px rgba(5,150,105,0.5)',
                },
              },
            ].map(({ text, style }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 * i }}
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 'clamp(48px, 7vw, 72px)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  display: 'block',
                  ...style,
                }}
              >
                {text}
              </motion.div>
            ))}
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            style={{
              marginTop: 24,
              fontFamily: 'Crimson Pro, Georgia, serif',
              fontSize: 20,
              fontStyle: 'italic',
              color: 'var(--moon-dim)',
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            Real conversations. Real scenarios. The language learning app that teaches you to
            speak, not just remember.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
            style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' as const }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/onboarding')}
              style={{
                background: 'var(--lapis)',
                border: '1px solid rgba(52,211,153,0.4)',
                borderRadius: 14,
                height: 56,
                padding: '0 32px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                color: 'var(--moon-bright)',
                boxShadow: '0 0 40px rgba(5,150,105,0.35)',
              }}
            >
              Begin Your Journey →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToProblem}
              style={{
                background: 'none',
                border: '1px solid rgba(232,238,245,0.15)',
                borderRadius: 14,
                height: 56,
                padding: '0 28px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: 13,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                color: 'var(--moon-dim)',
              }}
            >
              See how it works ↓
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.75 }}
            style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 20 }}
          >
            <div style={{ display: 'flex' }}>
              {['👩‍🦰', '👨‍🏫', '🧔'].map((emoji, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--lapis-deep)',
                    border: '2px solid var(--lapis)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: 13,
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              Built for real conversations · 4 languages · 48 scenes
            </p>
          </motion.div>
        </motion.div>

        {/* Right column — mock app preview */}
        <motion.div
          className="landing-hero-phone"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3, type: 'spring', damping: 20 }}
          style={{
            width: 360,
            height: 480,
            background: 'var(--basalt)',
            border: '1px solid rgba(232,238,245,0.08)',
            borderRadius: 28,
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,238,245,0.04)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column' as const,
            flexShrink: 0,
          }}
        >
          {/* Frame header */}
          <div
            style={{
              padding: '16px 20px 12px',
              borderBottom: '1px solid rgba(232,238,245,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1b3a5c',
                border: '1px solid #5b8fd6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              👩‍🦰
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 10,
                  color: 'var(--moon)',
                  letterSpacing: '0.05em',
                }}
              >
                Sofia · Caffè della Pace
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--lapis-bright)',
                  }}
                />
                <span style={{ fontSize: 9, color: 'var(--muted)' }}>Italian · Rome</span>
              </div>
            </div>
          </div>

          {/* Chat bubbles */}
          <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            <MockBubble role="ai" text="Ciao ciao! Cosa ti porto?" sub="Hey! What can I get you?" />
            <MockBubble role="user" text="Vorrei un cappuccino, per favore." />
            <MockBubble
              role="ai"
              text='Esatto! Grande o normale? Dai, non ti preoccupare — siamo amici! 😄'
              sub="Large or regular? Don't worry — we're friends!"
            />
            {/* Correction chip */}
            <div
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(5,150,105,0.12)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 8,
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 10 }}>✨</span>
              <span style={{ fontSize: 10, color: 'var(--lapis-bright)', fontFamily: 'Crimson Pro, serif', fontStyle: 'italic' }}>
                <strong style={{ fontStyle: 'normal', fontFamily: 'Public Sans, sans-serif', fontWeight: 600 }}>vorrei</strong>
                {' '}= polite "I'd like" — perfect for ordering
              </span>
            </div>
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(232,238,245,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                background: 'rgba(232,238,245,0.04)',
                border: '1px solid rgba(232,238,245,0.08)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 11,
                color: 'var(--muted)',
                fontStyle: 'italic',
              }}
            >
              Speak or type in Italian…
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--lapis)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              🎙
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MockBubble({
  role,
  text,
  sub,
}: {
  role: 'ai' | 'user'
  text: string
  sub?: string
}) {
  const isAI = role === 'ai'
  return (
    <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end' }}>
      <div
        style={{
          maxWidth: '78%',
          background: isAI ? 'rgba(232,238,245,0.06)' : 'var(--lapis-deep)',
          border: isAI
            ? '1px solid rgba(232,238,245,0.08)'
            : '1px solid rgba(52,211,153,0.15)',
          borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
          padding: '8px 12px',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--moon)', lineHeight: 1.5 }}>{text}</p>
        {sub && (
          <p
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              fontStyle: 'italic',
              marginTop: 3,
              fontFamily: 'Crimson Pro, serif',
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}
