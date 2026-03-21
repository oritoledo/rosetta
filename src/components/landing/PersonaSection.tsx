import { motion } from 'framer-motion'

const personas = [
  {
    emoji: '👩‍🦰',
    name: 'Sofia',
    role: 'Barista',
    location: 'Rome, Italy 🇮🇹',
    difficulty: 'Beginner-friendly',
    difficultyColor: '#34d399',
    personality:
      'Warm, fast-talking, uses Roman slang. Very forgiving of mistakes, adds little jokes.',
    sample: 'Ciao ciao! Cosa ti porto? Dai, non ti preoccupare! 😄',
    sampleTranslation: 'Hey! What can I get you? Come on, don\'t worry!',
    avatarBg: '#1b3a5c',
    avatarBorder: '#5b8fd6',
    tags: ['Casual', 'Encouraging', 'Slang'],
  },
  {
    emoji: '👨‍🏫',
    name: 'Marco',
    role: 'Professor',
    location: 'Florence, Italy 🇮🇹',
    difficulty: 'Intermediate',
    difficultyColor: '#fbbf24',
    personality:
      'Precise and academic. Corrects grammar directly but kindly. Loves etymology.',
    sample: 'Attenzione — il congiuntivo è fondamentale qui. Riproviamo.',
    sampleTranslation: 'Careful — the subjunctive is essential here. Let\'s try again.',
    avatarBg: '#1a2e1a',
    avatarBorder: '#34d399',
    tags: ['Academic', 'Precise', 'Grammar-focused'],
  },
  {
    emoji: '🧔',
    name: 'Kenji',
    role: 'Chef',
    location: 'Tokyo, Japan 🇯🇵',
    difficulty: 'Challenging',
    difficultyColor: '#f87171',
    personality:
      'Formal, high standards, speaks quickly. Pushes you to use respectful register.',
    sample: 'もう一度おっしゃっていただけますか？ゆっくりで大丈夫ですよ。',
    sampleTranslation: 'Could you say that once more? Slowly is perfectly fine.',
    avatarBg: '#2a1a1a',
    avatarBorder: '#f87171',
    tags: ['Formal', 'Fast-paced', 'Japanese honorifics'],
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

export default function PersonaSection() {
  return (
    <section
      style={{
        padding: '120px 0',
        background: 'rgba(232,238,245,0.015)',
        borderTop: '1px solid rgba(232,238,245,0.05)',
        borderBottom: '1px solid rgba(232,238,245,0.05)',
      }}
    >
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
            Your guides
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
          Meet your language guides.
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
          Each persona has a unique voice, teaching style, and difficulty level. Pick the one that
          fits your moment.
        </motion.p>

        {/* Persona cards */}
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
          {personas.map((p) => (
            <motion.div
              key={p.name}
              variants={cardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(232,238,245,0.03)',
                border: '1px solid rgba(232,238,245,0.08)',
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 16,
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: p.avatarBg,
                    border: `2px solid ${p.avatarBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {p.emoji}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--moon-bright)',
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--moon-dim)', marginTop: 2 }}>
                    {p.role} · {p.location}
                  </div>
                </div>
              </div>

              {/* Difficulty badge */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'Cinzel, serif',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                    color: p.difficultyColor,
                    background: `${p.difficultyColor}15`,
                    border: `1px solid ${p.difficultyColor}30`,
                    borderRadius: 6,
                    padding: '3px 8px',
                  }}
                >
                  {p.difficulty}
                </span>
                {p.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      color: 'var(--muted)',
                      background: 'rgba(232,238,245,0.05)',
                      border: '1px solid rgba(232,238,245,0.08)',
                      borderRadius: 6,
                      padding: '3px 8px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Personality */}
              <p style={{ fontSize: 13, color: 'var(--moon-dim)', lineHeight: 1.6 }}>
                {p.personality}
              </p>

              {/* Sample dialogue */}
              <div
                style={{
                  background: 'rgba(232,238,245,0.04)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--moon)',
                    fontStyle: 'italic',
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    lineHeight: 1.5,
                    marginBottom: 4,
                  }}
                >
                  "{p.sample}"
                </p>
                <p style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>
                  {p.sampleTranslation}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
