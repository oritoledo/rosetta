import { motion } from 'framer-motion'

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const oldWay = [
  {
    icon: '🔁',
    title: 'Endless vocabulary drills',
    desc: 'You memorize 500 words but freeze the moment a native speaker talks to you.',
  },
  {
    icon: '📖',
    title: 'Grammar rules in the abstract',
    desc: 'You study conjugation tables but never hear them used in a real sentence.',
  },
  {
    icon: '🎮',
    title: 'Gamification without depth',
    desc: "You keep streaks and collect hearts, but can't order coffee in the target language.",
  },
]

const newWay = [
  {
    icon: '☕',
    title: 'Real-scene conversations',
    desc: 'Order coffee, check into a hotel, navigate a market — in Italian, today.',
  },
  {
    icon: '✨',
    title: 'Grammar through feedback',
    desc: 'Make mistakes naturally. Get gentle corrections with context, not worksheets.',
  },
  {
    icon: '🧠',
    title: 'Retention that actually works',
    desc: "Spaced repetition surfaces vocabulary exactly when you're about to forget it.",
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{ padding: '120px 0', position: 'relative' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: 16 }}
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
            The problem
          </span>
        </motion.div>

        {/* Title */}
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
            maxWidth: 640,
            marginBottom: 16,
          }}
        >
          Apps teach you words.
          <br />
          <span style={{ color: 'var(--lapis-bright)' }}>We teach you conversations.</span>
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
            maxWidth: 560,
            marginBottom: 72,
          }}
        >
          Most language apps optimise for engagement metrics. Rosetta optimises for the moment
          you walk into a café abroad and actually say something real.
        </motion.p>

        {/* Two-column comparison */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {/* Old way */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div
              variants={itemVariant}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 9,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.2em',
                color: 'var(--muted)',
                marginBottom: 16,
              }}
            >
              The old way
            </motion.div>
            {oldWay.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariant}
                style={{
                  background: 'rgba(232,238,245,0.03)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  marginBottom: 12,
                  opacity: 0.7,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, opacity: 0.5 }}>{icon}</span>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--moon-dim)',
                        marginBottom: 4,
                        textDecoration: 'line-through',
                        textDecorationColor: 'rgba(232,238,245,0.2)',
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* New way */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div
              variants={itemVariant}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 9,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.2em',
                color: 'var(--lapis-bright)',
                marginBottom: 16,
              }}
            >
              The Rosetta way
            </motion.div>
            {newWay.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariant}
                style={{
                  background: 'rgba(5,150,105,0.07)',
                  border: '1px solid rgba(52,211,153,0.15)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--moon-bright)',
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--moon-dim)', lineHeight: 1.5 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
