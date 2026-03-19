import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/userStore'
import { generateWeeklyPlan } from '../utils/planGenerator'
import DayCard from '../components/DayCard'
import WeekSummaryPanel from '../components/WeekSummaryPanel'

export default function PlanScreen() {
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const [regenerating, setRegenerating] = useState(false)

  const plan = state.weeklyPlan
  const user = state.user

  const triggerRegenerate = useCallback(() => {
    setRegenerating(true)
    setTimeout(() => {
      const newSeed = (state.planSeed + 1) | 0
      const newPlan = generateWeeklyPlan(state, newSeed)
      dispatch({ type: 'SET_WEEKLY_PLAN', payload: { plan: newPlan, seed: newSeed } })
      setRegenerating(false)
    }, 1800)
  }, [state, dispatch])

  const handleMarkComplete = useCallback((dateIso: string) => {
    dispatch({ type: 'MARK_DAY_COMPLETED', payload: dateIso })
  }, [dispatch])

  if (!plan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--basalt)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--lapis-bright)',
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--lapis-bright)',
            }}
          >
            Building your plan…
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflowY: 'auto', background: 'var(--basalt)' }}
    >
      {/* Regenerating overlay */}
      {regenerating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9,15,24,0.85)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--lapis-bright)',
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--lapis-bright)',
              marginTop: '16px',
            }}
          >
            Planning your week…
          </div>
        </div>
      )}

      <div style={{ padding: '48px 48px 48px 48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Page header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '32px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    color: 'var(--lapis-bright)',
                  }}
                >
                  Your Weekly Plan
                </div>
                <h1
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                    margin: '6px 0 4px',
                  }}
                >
                  {plan.weekSummary.weekTheme}
                </h1>
                <p
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    margin: 0,
                  }}
                >
                  Generated for {user?.name ?? 'Alessandro'} · {user?.language ?? 'Italian'} · {user?.level ?? 'B1'}
                </p>
              </div>

              {/* Regenerate button */}
              <button
                onClick={triggerRegenerate}
                disabled={regenerating}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(226,232,240,0.1)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  cursor: regenerating ? 'not-allowed' : 'pointer',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--moon-dim)',
                  opacity: regenerating ? 0.5 : 1,
                  flexShrink: 0,
                  transition: 'border-color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!regenerating) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(52,211,153,0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(226,232,240,0.1)'
                }}
              >
                ↻ Regenerate Plan
              </button>
            </div>

            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                padding: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Back
            </button>

            {/* 7 day cards */}
            <motion.div
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {plan.days.map((day, i) => (
                <DayCard
                  key={i}
                  day={day}
                  index={i}
                  onComplete={handleMarkComplete}
                />
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ── */}
          <div style={{ position: 'sticky', top: '48px' }}>
            <WeekSummaryPanel plan={plan} vocab={state.vocabulary} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
