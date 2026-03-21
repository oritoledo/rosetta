import { motion } from 'framer-motion'

const languages = [
  {
    flag: '🇮🇹',
    name: 'Italian',
    native: 'Italiano',
    scenes: 12,
    personas: 2,
    status: 'Available',
    statusColor: 'var(--lapis-bright)',
    highlight: true,
  },
  {
    flag: '🇪🇸',
    name: 'Spanish',
    native: 'Español',
    scenes: 12,
    personas: 2,
    status: 'Available',
    statusColor: 'var(--lapis-bright)',
    highlight: false,
  },
  {
    flag: '🇫🇷',
    name: 'French',
    native: 'Français',
    scenes: 8,
    personas: 1,
    status: 'Coming soon',
    statusColor: 'var(--moon-dim)',
    highlight: false,
  },
  {
    flag: '🇯🇵',
    name: 'Japanese',
    native: '日本語',
    scenes: 8,
    personas: 1,
    status: 'Coming soon',
    statusColor: 'var(--moon-dim)',
    highlight: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LanguageSection() {
  return (
    <section id="languages" style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: 16, textAlign: 'center' as const }}
        >
          <span
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 9,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.3em',
              color: 'var(--lapis-bright)',
              opacity: 0.8,
            }}
          >
            Languages
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            lineHeight: 1.1,
            textAlign: 'center' as const,
            marginBottom: 16,
          }}
        >
          4 languages.{' '}
          <span style={{ color: 'var(--lapis-bright)' }}>Infinite conversations.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.16 }}
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: 18,
            fontStyle: 'italic',
            color: 'var(--moon-dim)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 72px',
            textAlign: 'center' as const,
          }}
        >
          Start with Italian or Spanish today. French and Japanese are on the way.
        </motion.p>

        {/* Language grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          {languages.map((lang) => (
            <motion.div
              key={lang.name}
              variants={cardVariant}
              whileHover={
                lang.status === 'Available' ? { y: -4, transition: { duration: 0.2 } } : {}
              }
              style={{
                background: lang.highlight
                  ? 'rgba(5,150,105,0.1)'
                  : 'rgba(232,238,245,0.03)',
                border: lang.highlight
                  ? '1px solid rgba(52,211,153,0.2)'
                  : '1px solid rgba(232,238,245,0.07)',
                borderRadius: 18,
                padding: '28px 24px',
                textAlign: 'center' as const,
                opacity: lang.status === 'Available' ? 1 : 0.55,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{lang.flag}</div>
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--moon-bright)',
                  marginBottom: 4,
                }}
              >
                {lang.name}
              </div>
              <div
                style={{
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: 'var(--moon-dim)',
                  marginBottom: 16,
                }}
              >
                {lang.native}
              </div>

              {/* Stats */}
              {lang.status === 'Available' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ textAlign: 'center' as const }}>
                    <div
                      style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--lapis-bright)',
                      }}
                    >
                      {lang.scenes}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>scenes</div>
                  </div>
                  <div
                    style={{
                      width: 1,
                      background: 'rgba(232,238,245,0.08)',
                      alignSelf: 'stretch',
                    }}
                  />
                  <div style={{ textAlign: 'center' as const }}>
                    <div
                      style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--lapis-bright)',
                      }}
                    >
                      {lang.personas}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      personas
                    </div>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontFamily: 'Cinzel, serif',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.12em',
                  color: lang.statusColor,
                  background:
                    lang.status === 'Available'
                      ? 'rgba(52,211,153,0.1)'
                      : 'rgba(232,238,245,0.04)',
                  border: `1px solid ${lang.status === 'Available' ? 'rgba(52,211,153,0.2)' : 'rgba(232,238,245,0.08)'}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                }}
              >
                {lang.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
