import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { DayPlan } from '../types/plan'

interface DayCardProps {
  day: DayPlan
  index: number
  onComplete?: (dateIso: string) => void
}

const PRIORITY_COLORS = {
  critical:    { dot: '#e85050', label: 'Critical' },
  important:   { dot: '#c9a84c', label: 'Important' },
  maintenance: { dot: '#52d48a', label: 'Maintenance' },
}

const DIFFICULTY_STYLES = {
  light:    { color: '#52d48a', label: 'Light' },
  moderate: { color: '#c9a84c', label: 'Moderate' },
  intense:  { color: '#e87060', label: 'Intense' },
}

function formatDate(date: Date): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}

export default function DayCard({ day, index, onComplete }: DayCardProps) {
  const navigate = useNavigate()
  const [reasonsExpanded, setReasonsExpanded] = useState(day.isToday)

  const d = day.date instanceof Date ? day.date : new Date(day.date)
  const dateStr = formatDate(d)

  // ── Rest day ──────────────────────────────────────────────────────────────
  if (day.isRest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.06 }}
        style={{
          background: 'var(--basalt)',
          border: '1px dashed rgba(226,232,240,0.06)',
          borderRadius: '18px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--basalt)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderBottom: '1px solid rgba(226,232,240,0.04)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--moon)',
              }}
            >
              {day.dayLabel}
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              {dateStr}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--muted)',
              }}
            >
              REST DAY 😴
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '15px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            {day.restMessage}
          </p>
          <p
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              opacity: 0.7,
              marginTop: '8px',
              marginBottom: 0,
            }}
          >
            Try watching <em>La Grande Bellezza</em> tonight
          </p>
        </div>
      </motion.div>
    )
  }

  const diff = DIFFICULTY_STYLES[day.difficulty]
  const scene = day.scene!
  const persona = day.persona!
  const grammarFocus = day.grammarFocus!
  const priorityMeta = PRIORITY_COLORS[grammarFocus.priority]

  // ── Completed state ───────────────────────────────────────────────────────
  const cardBorder = day.isToday
    ? 'rgba(52,211,153,0.3)'
    : day.isCompleted
    ? 'rgba(82,212,138,0.2)'
    : 'rgba(226,232,240,0.07)'

  const cardShadow = day.isToday
    ? '0 4px 24px rgba(27,58,92,0.3)'
    : 'none'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: day.isCompleted ? 0.55 : 1,
        y: 0,
        scale: day.isToday ? [1, 1.015, 1] : 1,
      }}
      transition={
        day.isToday
          ? { duration: 0.35, delay: index * 0.06, scale: { delay: 0.4, duration: 0.6, type: 'spring' } }
          : { duration: 0.3, delay: index * 0.06 }
      }
      style={{
        background: 'var(--basalt-mid)',
        border: `1px solid ${cardBorder}`,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: cardShadow,
        position: 'relative',
      }}
    >
      {/* Completed badge */}
      {day.isCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(82,212,138,0.15)',
            border: '1px solid rgba(82,212,138,0.3)',
            borderRadius: '20px',
            padding: '3px 10px',
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#52d48a',
            zIndex: 1,
          }}
        >
          ✓ Completed
        </div>
      )}

      {/* ── Card Header ── */}
      <div
        style={{
          background: 'var(--basalt-raised)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderBottom: '1px solid rgba(226,232,240,0.05)',
        }}
      >
        {/* Day label + date */}
        <div style={{ minWidth: '80px' }}>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: day.isToday ? 'var(--lapis-bright)' : 'var(--moon)',
            }}
          >
            {day.dayLabel}
          </div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '11px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              marginTop: '1px',
            }}
          >
            {dateStr}
          </div>
        </div>

        {/* Scene emoji + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '28px' }}>{scene.emoji}</span>
          <div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--moon)',
              }}
            >
              {scene.title}
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              with {persona.name} · {persona.role}
            </div>
          </div>
        </div>

        {/* Right: difficulty + duration */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: diff.color,
              background: `${diff.color}18`,
              border: `1px solid ${diff.color}40`,
              borderRadius: '20px',
              padding: '3px 10px',
            }}
          >
            {diff.label}
          </span>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '11px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              marginTop: '4px',
            }}
          >
            ~{day.estimatedMinutes} min
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '16px 20px' }}>
        {/* Three info blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          {/* Grammar focus */}
          <div
            style={{
              background: 'var(--basalt)',
              border: '1px solid rgba(226,232,240,0.06)',
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              Grammar
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--moon)',
                lineHeight: 1.3,
              }}
            >
              {grammarFocus.title}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '6px',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.4, boxShadow: `0 0 8px 2px ${priorityMeta.dot}80` }}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: priorityMeta.dot,
                  flexShrink: 0,
                  cursor: 'default',
                }}
              />
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: priorityMeta.dot,
                }}
              >
                {priorityMeta.label}
              </span>
            </div>
          </div>

          {/* Vocab */}
          <div
            style={{
              background: 'var(--basalt)',
              border: '1px solid rgba(226,232,240,0.06)',
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              Vocabulary
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--moon-bright)',
                lineHeight: 1,
              }}
            >
              {day.vocabTargets.length}
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '10px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                marginTop: '4px',
              }}
            >
              {day.vocabTargets.length === 1 ? 'word' : 'words'} due for review
            </div>
          </div>

          {/* Persona */}
          <div
            style={{
              background: 'var(--basalt)',
              border: '1px solid rgba(226,232,240,0.06)',
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              Guide
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: persona.avatarBg,
                  border: `1.5px solid ${persona.avatarAccent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  flexShrink: 0,
                }}
              >
                {persona.emoji}
              </div>
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--moon)',
                }}
              >
                {persona.name}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '10px',
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              {persona.role}
            </div>
          </div>
        </div>

        {/* Why this session */}
        <div style={{ marginBottom: '14px' }}>
          <button
            onClick={() => setReasonsExpanded((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0 8px',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Why this session
            <span style={{ fontSize: '10px' }}>{reasonsExpanded ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {reasonsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                {day.reasoning.map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '6px 0',
                      borderBottom:
                        i < day.reasoning.length - 1
                          ? '1px solid rgba(226,232,240,0.04)'
                          : 'none',
                    }}
                  >
                    <span style={{ fontSize: '14px', lineHeight: 1.4, flexShrink: 0 }}>
                      {reason.icon}
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
                      {reason.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {day.isToday && !day.isCompleted && (
            <button
              onClick={() => navigate(`/scene/${scene.id}`)}
              style={{
                flex: 1,
                height: '44px',
                background: 'var(--lapis)',
                border: '1px solid rgba(52,211,153,0.4)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--moon-bright)',
                boxShadow: '0 0 24px rgba(16,185,129,0.3)',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--lapis-mid)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--lapis)'
              }}
            >
              Start Today →
            </button>
          )}

          {!day.isToday && !day.isCompleted && (
            <button
              onClick={() => navigate(`/scene/${scene.id}`)}
              style={{
                flex: 1,
                height: '44px',
                background: 'transparent',
                border: '1px solid rgba(226,232,240,0.12)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--moon-dim)',
                transition: 'border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(52,211,153,0.3)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(226,232,240,0.12)'
              }}
            >
              Preview Scene
            </button>
          )}

          {day.isCompleted && (
            <button
              onClick={() => navigate('/scroll')}
              style={{
                flex: 1,
                height: '44px',
                background: 'transparent',
                border: '1px solid rgba(82,212,138,0.25)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#52d48a',
              }}
            >
              Review Debrief
            </button>
          )}

          <button
            onClick={() => navigate(`/brief/${scene.id}`)}
            style={{
              height: '44px',
              padding: '0 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--muted)',
              flexShrink: 0,
            }}
          >
            Scene details →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
