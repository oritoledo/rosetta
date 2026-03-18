import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { scenes } from '../data/scenes'
import { useStore } from '../store/userStore'
import PersonaPicker from '../components/PersonaPicker'

export default function SceneIntroScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const scene = (id && scenes[id]) ? scenes[id] : scenes.cafe
  const { state, dispatch } = useStore()

  function handleSelectPersona(personaId: string) {
    dispatch({ type: 'SET_PERSONA', payload: personaId })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {/* LEFT HERO PANEL */}
        <div
          style={{
            background: 'linear-gradient(170deg, #0a1628, #060e1a)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
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
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(42,82,152,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--lapis-bright)',
                marginBottom: '40px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Back
            </button>

            {/* Emoji */}
            <div
              style={{
                fontSize: '96px',
                filter: `drop-shadow(0 0 48px ${scene.emojiShadow})`,
                marginBottom: '32px',
                lineHeight: 1,
              }}
            >
              {scene.emoji}
            </div>

            {/* Location pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(9,15,24,0.7)',
                border: '1px solid rgba(91,143,214,0.2)',
                borderRadius: '20px',
                padding: '6px 16px',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'var(--lapis-bright)',
                }}
              >
                {scene.location}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--moon-bright)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '16px',
              }}
            >
              {scene.title}
            </h1>

            {/* Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[scene.duration, scene.level].map((chip) => (
                <span
                  key={chip}
                  style={{
                    background: 'rgba(232,238,245,0.06)',
                    border: '1px solid rgba(232,238,245,0.1)',
                    borderRadius: '20px',
                    padding: '5px 14px',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--moon-dim)',
                  }}
                >
                  {chip}
                </span>
              ))}
              <span
                style={{
                  background: 'rgba(42,82,152,0.2)',
                  border: '1px solid rgba(91,143,214,0.2)',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--lapis-bright)',
                }}
              >
                {scene.category}
              </span>
            </div>

            {/* Decorative lines */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: '1px',
                  background: 'rgba(91,143,214,0.08)',
                  marginTop: i === 0 ? '32px' : '10px',
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div
          style={{
            background: 'var(--basalt)',
            overflowY: 'auto',
            padding: '48px 52px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Cultural Brief */}
          <div>
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--lapis-bright)',
                opacity: 0.7,
                marginBottom: '16px',
              }}
            >
              Before you begin
            </div>
            <div
              style={{
                background: 'var(--basalt-mid)',
                border: '1px solid rgba(232,238,245,0.07)',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              {scene.brief.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    paddingBottom: i < scene.brief.length - 1 ? '16px' : 0,
                    marginBottom: i < scene.brief.length - 1 ? '16px' : 0,
                    borderBottom:
                      i < scene.brief.length - 1
                        ? '1px solid rgba(232,238,245,0.05)'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--lapis-mid)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: 'var(--moon-dim)',
                      lineHeight: '1.6',
                      margin: 0,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Picker */}
          <PersonaPicker
            selectedId={state.selectedPersona}
            onSelect={handleSelectPersona}
            currentSceneId={scene.id}
          />

          {/* CTA button */}
          <motion.button
            onClick={() => navigate(`/brief/${scene.id}`)}
            whileHover={{ backgroundColor: 'var(--lapis-mid)', boxShadow: '0 0 56px rgba(42,82,152,0.5)' }}
            transition={{ duration: 0.15 }}
            style={{
              width: '100%',
              height: '60px',
              background: 'var(--lapis)',
              border: '1px solid rgba(91,143,214,0.4)',
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(42,82,152,0.35)',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--moon-bright)',
              flexShrink: 0,
            }}
          >
            Begin Scene
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
