import { motion } from 'framer-motion'

export default function SettingsScreen() {
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(42,82,152,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚙️</div>
        <h1
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            letterSpacing: '0.06em',
            marginBottom: '12px',
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '16px',
            fontStyle: 'italic',
            color: 'var(--lapis-bright)',
          }}
        >
          Preferences & account settings coming soon
        </p>
      </div>
    </motion.div>
  )
}
