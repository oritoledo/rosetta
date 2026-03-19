import { motion } from 'framer-motion'

export default function PracticeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        height: '100%',
        background: 'var(--basalt)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '24px',
            filter: 'drop-shadow(0 0 24px rgba(52,211,153,0.3))',
          }}
        >
          ⚡
        </div>
        <h1
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            letterSpacing: '0.06em',
            marginBottom: '12px',
          }}
        >
          Practice
        </h1>
        <p
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '16px',
            fontStyle: 'italic',
            color: 'var(--lapis-bright)',
            marginBottom: '8px',
          }}
        >
          Drills & exercises are on their way
        </p>
        <p
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--muted)',
          }}
        >
          Vocabulary drills · Grammar exercises · Listening practice
        </p>
      </div>
    </motion.div>
  )
}
