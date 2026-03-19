import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionLabel from '../components/SectionLabel'
import SceneCard from '../components/SceneCard'
import StatCard from '../components/StatCard'
import WeeklyPlanWidget from '../components/WeeklyPlanWidget'
import { sceneList } from '../data/scenes'
import { useStore } from '../store/userStore'
import { getPersonaById } from '../data/personas'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { state } = useStore()
  const persona = getPersonaById(state.selectedPersona)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflow: 'hidden', position: 'relative' }}
    >
      {/* Scrollable inner */}
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '40px 48px',
          background: 'var(--basalt)',
          position: 'relative',
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: 'fixed',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Horizontal line texture */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(226,232,240,0.018) 39px, rgba(226,232,240,0.018) 40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* TOP ROW */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            {/* Greeting */}
            <div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: 'var(--lapis-bright)',
                  opacity: 0.8,
                  marginBottom: '6px',
                }}
              >
                Buongiorno, Alessandro
              </div>
              <h1
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'var(--moon-bright)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                What will you <em style={{ fontStyle: 'italic' }}>speak</em> today?
              </h1>
            </div>

            {/* Streak card */}
            <div
              style={{
                background: 'var(--basalt-mid)',
                border: '1px solid rgba(226,232,240,0.07)',
                borderRadius: '16px',
                padding: '16px 20px',
                minWidth: '220px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>🔥</span>
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '14px',
                      color: 'var(--moon)',
                    }}
                  >
                    XII Day Streak
                  </div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '11px',
                      fontStyle: 'italic',
                      color: 'var(--muted)',
                      marginTop: '2px',
                    }}
                  >
                    3 more to your record
                  </div>
                </div>
              </div>
              {/* Pip dots */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginTop: '12px',
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: i < 3 ? 'var(--lapis-mid)' : 'var(--basalt-edge)',
                      boxShadow:
                        i < 3 ? '0 0 6px rgba(58,106,191,0.5)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CONTINUE BANNER */}
          <div
            style={{
              background: 'var(--lapis-deep)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '18px',
              padding: '20px 28px',
              boxShadow:
                '0 4px 32px rgba(27,58,92,0.5), inset 0 1px 0 rgba(52,211,153,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {/* Persona avatar */}
            <div
              title={`Currently practicing with ${persona.name} — change in scene settings`}
              style={{
                width: '56px',
                height: '56px',
                background: persona.avatarBg,
                border: `2px solid ${persona.avatarAccent}`,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0,
                boxShadow: `0 0 16px ${persona.avatarAccent}40`,
              }}
            >
              {persona.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--lapis-bright)',
                  opacity: 0.7,
                }}
              >
                Continue where you left off
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--moon-bright)',
                  marginTop: '4px',
                }}
              >
                Ordering at a Café
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--moon-dim)',
                  marginTop: '4px',
                }}
              >
                Italian · Scene II of IV · ~4 min remaining
              </div>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: '10px',
                  height: '4px',
                  background: 'rgba(226,232,240,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  maxWidth: '360px',
                }}
              >
                <div
                  style={{
                    width: '45%',
                    height: '100%',
                    background: 'var(--lapis-mid)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>

            {/* Resume button */}
            <button
              onClick={() => navigate('/scene/cafe')}
              style={{
                background: 'rgba(226,232,240,0.1)',
                border: '1px solid rgba(226,232,240,0.2)',
                borderRadius: '12px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--moon)',
                flexShrink: 0,
                transition: 'background 150ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(226,232,240,0.18)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(226,232,240,0.1)'
              }}
            >
              Resume Scene →
            </button>
          </div>

          {/* WEEKLY PLAN WIDGET */}
          {state.weeklyPlan && (
            <WeeklyPlanWidget plan={state.weeklyPlan} />
          )}

          {/* SCENES SECTION */}
          <SectionLabel>Scenes for you today</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginTop: '14px',
              marginBottom: '40px',
            }}
          >
            {sceneList.map((scene) => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>

          {/* PROGRESS SECTION */}
          <SectionLabel>Your progress this week</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginTop: '14px',
              paddingBottom: '40px',
            }}
          >
            <StatCard value="14"  label="Scenes Completed" trend="↑ 3 this week"         />
            <StatCard value="847" label="Words Learned"    trend="↑ 24 new this week"     />
            <StatCard value="XII" label="Day Streak"       trend="3 more to your record"  />
            <StatCard value="68%" label="Avg Score"        trend="↑ 5% from last week"    />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
