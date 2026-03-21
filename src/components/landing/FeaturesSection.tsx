import { motion } from 'framer-motion'

const features = [
  {
    icon: '🗣',
    title: 'Live Conversation Practice',
    desc: 'Chat with AI personas in real café, hotel, clinic, and market scenes. No scripts — genuine back-and-forth.',
    accent: true,
  },
  {
    icon: '📍',
    title: 'Scene-Based Learning',
    desc: '12 realistic locations, 48 unique conversations across 4 languages. Every scene, a new skill.',
    accent: false,
  },
  {
    icon: '✨',
    title: 'Instant Grammar Feedback',
    desc: 'Mistakes are caught in the moment and explained in plain language — not a grammar worksheet in sight.',
    accent: false,
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    desc: 'Your vocabulary surfaces again exactly when forgetting would happen. SM-2 algorithm, built in.',
    accent: false,
  },
  {
    icon: '📅',
    title: 'Personalised Weekly Plan',
    desc: 'A study schedule seeded to your level and progress. Regenerates every 24 hours, adapts to you.',
    accent: false,
  },
  {
    icon: '🎙',
    title: 'Voice Practice',
    desc: 'Speak aloud using your microphone. Text-to-speech plays native responses back to train your ear.',
    accent: false,
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

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '120px 0',
        position: 'relative',
        background:
          'linear-gradient(180deg, transparent 0%, rgba(5,150,105,0.03) 50%, transparent 100%)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        {/* Section label */}
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
            Features
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
          Everything you need to speak
          <br />
          <span style={{ color: 'var(--lapis-bright)' }}>with confidence.</span>
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
          Each feature is designed around one goal: getting you from textbook phrases to real,
          confident speech — faster.
        </motion.p>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {features.map(({ icon, title, desc, accent }) => (
            <motion.div
              key={title}
              variants={cardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: accent ? 'rgba(5,150,105,0.1)' : 'rgba(232,238,245,0.03)',
                border: accent
                  ? '1px solid rgba(52,211,153,0.2)'
                  : '1px solid rgba(232,238,245,0.08)',
                borderRadius: 16,
                padding: '28px 24px',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
              <h3
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: accent ? 'var(--lapis-bright)' : 'var(--moon-bright)',
                  letterSpacing: '0.03em',
                  marginBottom: 10,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--moon-dim)',
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
