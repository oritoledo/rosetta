import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/userStore'
import { generateWeeklyPlan } from '../utils/planGenerator'
import type { WeeklyPlan } from '../types/plan'

interface WeeklyPlanWidgetProps {
  plan: WeeklyPlan
}

const DIFFICULTY_COLORS = {
  light:    { color: '#52d48a', label: 'Light'    },
  moderate: { color: '#c9a84c', label: 'Moderate' },
  intense:  { color: '#e87060', label: 'Intense'  },
}

export default function WeeklyPlanWidget({ plan }: WeeklyPlanWidgetProps) {
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const [regenerating, setRegenerating] = useState(false)

  const todayPlan = plan.days.find((d) => d.isToday && !d.isRest)
  // Days 2–5 (indices 1–4) for the mini calendar
  const upcomingDays = plan.days.slice(1, 5)

  const triggerRegenerate = useCallback(() => {
    setRegenerating(true)
    setTimeout(() => {
      const newSeed = (state.planSeed + 1) | 0
      const newPlan = generateWeeklyPlan(state, newSeed)
      dispatch({ type: 'SET_WEEKLY_PLAN', payload: { plan: newPlan, seed: newSeed } })
      setRegenerating(false)
    }, 1800)
  }, [state, dispatch])

  return (
    <div
      style={{
        background: 'var(--basalt-mid)',
        border: '1px solid rgba(226,232,240,0.07)',
        borderRadius: '18px',
        padding: '24px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Regenerating overlay */}
      <AnimatePresence>
        {regenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9,15,24,0.82)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--lapis-bright)',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--lapis-bright)',
                marginTop: '14px',
              }}
            >
              Planning your week…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget content — fades out while regenerating */}
      <motion.div
        animate={{ opacity: regenerating ? 0.25 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--lapis-bright)',
            }}
          >
            Your Week
          </span>

          {/* Week theme pill */}
          <div
            style={{
              background: 'var(--lapis-deep)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '20px',
              padding: '4px 14px',
            }}
          >
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--lapis-bright)',
              }}
            >
              {plan.weekSummary.weekTheme}
            </span>
          </div>

          <button
            onClick={() => navigate('/plan')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '10px',
              color: 'var(--lapis-bright)',
              padding: 0,
            }}
          >
            Full plan →
          </button>
        </div>

        {/* Today card */}
        {todayPlan && todayPlan.scene && todayPlan.grammarFocus && todayPlan.persona ? (
          <div
            style={{
              background: 'var(--lapis-deep)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '16px',
              boxShadow: '0 4px 24px rgba(27,58,92,0.4)',
            }}
          >
            {/* Today top row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--lapis-bright)',
                  opacity: 0.7,
                }}
              >
                Today
              </span>
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: DIFFICULTY_COLORS[todayPlan.difficulty].color,
                  background: `${DIFFICULTY_COLORS[todayPlan.difficulty].color}18`,
                  border: `1px solid ${DIFFICULTY_COLORS[todayPlan.difficulty].color}40`,
                  borderRadius: '20px',
                  padding: '2px 8px',
                }}
              >
                {DIFFICULTY_COLORS[todayPlan.difficulty].label}
              </span>
            </div>

            {/* Scene row */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(226,232,240,0.08)',
                  border: '1px solid rgba(226,232,240,0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                }}
              >
                {todayPlan.scene.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                  }}
                >
                  {todayPlan.scene.title}
                </div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: 'var(--moon-dim)',
                    marginTop: '1px',
                  }}
                >
                  with {todayPlan.persona.name} · {todayPlan.estimatedMinutes} min
                </div>
              </div>
            </div>

            {/* Grammar focus row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--muted)',
                }}
              >
                Focus
              </span>
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'var(--lapis-bright)',
                }}
              >
                {todayPlan.grammarFocus.title}
              </span>
            </div>

            {/* Top reason */}
            {todayPlan.reasoning[0] && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: '10px',
                }}
              >
                <span style={{ fontSize: '12px', lineHeight: '18px', flexShrink: 0 }}>
                  {todayPlan.reasoning[0].icon}
                </span>
                <p
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: 'var(--moon-dim)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {todayPlan.reasoning[0].text}
                </p>
              </div>
            )}

            {/* Start button */}
            <button
              onClick={() => navigate(`/scene/${todayPlan.scene!.id}`)}
              style={{
                width: '100%',
                height: '48px',
                marginTop: '16px',
                background: 'rgba(226,232,240,0.1)',
                border: '1px solid rgba(226,232,240,0.15)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--moon)',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(52,211,153,0.15)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(226,232,240,0.1)'
              }}
            >
              Start Today's Session →
            </button>
          </div>
        ) : (
          /* Rest day or no plan */
          <div
            style={{
              background: 'var(--basalt)',
              border: '1px dashed rgba(226,232,240,0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '14px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                margin: 0,
              }}
            >
              {plan.days[0]?.restMessage ?? 'Rest day — take it easy today 😴'}
            </p>
          </div>
        )}

        {/* Mini calendar: days 2–5 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {upcomingDays.map((day, i) => {
            const d = day.date instanceof Date ? day.date : new Date(day.date)
            const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: day.isCompleted ? 'var(--basalt-mid)' : 'var(--basalt-raised)',
                  border: '1px solid rgba(226,232,240,0.06)',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  position: 'relative',
                  opacity: day.isCompleted ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--muted)',
                    marginBottom: '4px',
                  }}
                >
                  {shortDay}
                </div>
                {day.isRest ? (
                  <>
                    <div style={{ fontSize: '18px', margin: '2px auto 4px' }}>😴</div>
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '9px',
                        fontStyle: 'italic',
                        color: 'var(--muted)',
                      }}
                    >
                      Rest
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '18px',
                        margin: '2px auto 4px',
                        filter: day.isCompleted ? 'grayscale(100%)' : 'none',
                      }}
                    >
                      {day.scene?.emoji ?? '📚'}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '10px',
                        fontStyle: 'italic',
                        color: 'var(--muted)',
                      }}
                    >
                      {day.estimatedMinutes} min
                    </div>
                  </>
                )}

                {/* Completed checkmark */}
                {day.isCompleted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#52d48a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      color: '#0a1628',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '11px',
              fontStyle: 'italic',
              color: 'var(--muted)',
            }}
          >
            {plan.weekSummary.totalMinutes} min planned this week · {plan.weekSummary.vocabTargets} words
          </span>
          <button
            onClick={triggerRegenerate}
            disabled={regenerating}
            style={{
              background: 'none',
              border: 'none',
              cursor: regenerating ? 'not-allowed' : 'pointer',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--muted)',
              opacity: regenerating ? 0.4 : 1,
              padding: 0,
            }}
          >
            ↻ Regenerate
          </button>
        </div>
      </motion.div>
    </div>
  )
}
