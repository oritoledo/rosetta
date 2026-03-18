import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAS, getPersonaById } from '../data/personas'
import PersonaCard from './PersonaCard'

interface PersonaPickerProps {
  selectedId: string
  onSelect: (id: string) => void
  currentSceneId?: string
}

export default function PersonaPicker({
  selectedId,
  onSelect,
  currentSceneId,
}: PersonaPickerProps) {
  const selected = getPersonaById(selectedId)
  const sceneKey = (currentSceneId ?? 'cafe') as keyof typeof selected.conversation
  const firstMessage = selected.conversation[sceneKey]?.find(
    (m) => m.role === 'ai',
  )

  return (
    <div>
      {/* Section label */}
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'var(--lapis-bright)',
          marginBottom: '12px',
        }}
      >
        Choose your guide
      </div>

      {/* 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={selectedId === persona.id}
            onSelect={onSelect}
            currentSceneId={currentSceneId}
          />
        ))}
      </div>

      {/* Selected persona preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--basalt-raised)',
            border: '1px solid rgba(232,238,245,0.06)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginTop: '10px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          {/* Large avatar */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: selected.avatarBg,
              border: `1.5px solid ${selected.avatarAccent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0,
            }}
          >
            {selected.emoji}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Quote */}
            {firstMessage && (
              <p
                style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'var(--moon-dim)',
                  lineHeight: '1.55',
                  margin: '0 0 8px 0',
                }}
              >
                "{firstMessage.text}"
              </p>
            )}

            {/* They speak tags */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  marginRight: '2px',
                }}
              >
                They speak:
              </span>
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--moon-dim)',
                    background: 'rgba(232,238,245,0.06)',
                    border: '1px solid rgba(232,238,245,0.08)',
                    borderRadius: '20px',
                    padding: '2px 7px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
