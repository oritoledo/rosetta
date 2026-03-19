import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SkillBar from '../components/SkillBar'
import StampGrid from '../components/StampGrid'
import ActivityRow from '../components/ActivityRow'
import BadgeShowcase from '../components/BadgeShowcase'
import { weeklyActivity, recentActivity, skills, stamps } from '../data/mockProgress'
import { useStore } from '../store/userStore'
import { ErrorCategory, ErrorPattern, categoryLabels } from '../data/errors'

// ─── Compute patterns from error log ─────────────────────────────────────────

function computePatterns(errors: ReturnType<typeof useStore>['state']['errors']): ErrorPattern[] {
  const counts: Partial<Record<ErrorCategory, number>> = {}
  const lastSeen: Partial<Record<ErrorCategory, number>> = {}
  const examples: Partial<Record<ErrorCategory, typeof errors[0]>> = {}

  for (const err of errors) {
    const cat = err.type
    counts[cat] = (counts[cat] ?? 0) + 1
    if (!lastSeen[cat] || err.sceneDate > lastSeen[cat]!) {
      lastSeen[cat] = err.sceneDate
      examples[cat] = err
    }
  }

  const patterns: ErrorPattern[] = []
  for (const [cat, count] of Object.entries(counts) as [ErrorCategory, number][]) {
    if (count < 2) continue

    // Determine trend based on recency of errors
    // If most errors are older (> 7 days ago) → improving; if recent spread → recurring; if all new → new
    const catErrors = errors.filter((e) => e.type === cat)
    const recentErrors = catErrors.filter((e) => e.sceneDate > Date.now() - 7 * 86_400_000)
    const oldErrors = catErrors.filter((e) => e.sceneDate <= Date.now() - 7 * 86_400_000)

    let trend: ErrorPattern['trend']
    if (oldErrors.length >= 2 && recentErrors.length <= 1) trend = 'improving'
    else if (recentErrors.length >= 2) trend = 'recurring'
    else trend = 'new'

    patterns.push({
      category: cat,
      count,
      lastSeen: lastSeen[cat]!,
      trend,
      exampleError: examples[cat]!,
    })
  }

  return patterns.sort((a, b) => b.count - a.count)
}

// ─── Accuracy data (mocked as 8 sessions) ────────────────────────────────────

const sessionAccuracy = [62, 68, 71, 65, 73, 78, 74, 80]
const sessionLabels   = ['Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15', 'Mar 16']

const MAX_BAR_H = 80

// ─── Trend badge ─────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: ErrorPattern['trend'] }) {
  const map = {
    improving: { label: '↑ Improving', color: '#52d48a', bg: 'rgba(82,212,138,0.1)',  border: 'rgba(82,212,138,0.25)' },
    recurring: { label: '↻ Recurring', color: '#c9a84c', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)' },
    new:       { label: '● New',       color: 'var(--lapis-bright)', bg: 'rgba(16,185,129,0.12)', border: 'rgba(52,211,153,0.25)' },
  }
  const t = map[trend]
  return (
    <span
      style={{
        fontFamily: 'Public Sans, sans-serif',
        fontSize: '9px',
        fontWeight: 700,
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: '20px',
        padding: '3px 10px',
      }}
    >
      {t.label}
    </span>
  )
}

// ─── Category badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ErrorCategory }) {
  const colorMap: Record<ErrorCategory, string> = {
    'verb-tense':       '#e8504c',
    'gender-agreement': '#c9a84c',
    'word-choice':      'var(--lapis-bright)',
    'word-order':       '#d47060',
    'pronunciation':    '#52d48a',
    'formality':        '#9b72d4',
    'idiom':            '#5bbfcc',
  }
  return (
    <span
      style={{
        fontFamily: 'Public Sans, sans-serif',
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: colorMap[category] ?? 'var(--lapis-bright)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: '20px',
        padding: '3px 10px',
      }}
    >
      {categoryLabels[category]}
    </span>
  )
}

// ─── Trend dots (7 sessions) ──────────────────────────────────────────────────

function TrendDots({ category, errors }: { category: ErrorCategory; errors: ReturnType<typeof useStore>['state']['errors'] }) {
  // Last 7 days — did an error occur?
  const dots = Array.from({ length: 7 }, (_, i) => {
    const dayStart = Date.now() - (6 - i) * 86_400_000
    const dayEnd = dayStart + 86_400_000
    return errors.some(
      (e) => e.type === category && e.sceneDate >= dayStart && e.sceneDate < dayEnd,
    )
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        {dots.map((hasError, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: hasError ? 'var(--lapis-bright)' : 'rgba(226,232,240,0.12)',
              border: '1px solid',
              borderColor: hasError ? 'rgba(52,211,153,0.5)' : 'rgba(226,232,240,0.06)',
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '10px',
          fontStyle: 'italic',
          color: '#64748b',
        }}
      >
        Last 7 sessions
      </div>
    </div>
  )
}

// ─── Pattern card ─────────────────────────────────────────────────────────────

function PatternCard({ pattern, errors }: { pattern: ErrorPattern; errors: ReturnType<typeof useStore>['state']['errors'] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        background: '#161b27',
        border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          flexWrap: 'wrap',
        }}
      >
        <CategoryBadge category={pattern.category} />
        <div style={{ flex: 1 }} />
        <TrendBadge trend={pattern.trend} />
        <span
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '10px',
            color: '#64748b',
          }}
        >
          {pattern.count} error{pattern.count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Category label */}
      <div
        style={{
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          color: '#e2e8f0',
          marginBottom: '12px',
        }}
      >
        {categoryLabels[pattern.category]}
      </div>

      {/* Trend dots */}
      <TrendDots category={pattern.category} errors={errors} />

      {/* Collapsible example */}
      <div style={{ marginTop: '14px' }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#64748b',
          }}
        >
          {expanded ? '▲ Hide example' : '▼ Show example'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(16,185,129,0.08)', paddingTop: '12px' }}>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: '#64748b',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>You said: </span>
                  {pattern.exampleError.youSaid}
                </div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: '#e2e8f0',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Native: </span>
                  {pattern.exampleError.nativeSaid}
                </div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#64748b',
                    lineHeight: 1.55,
                  }}
                >
                  {pattern.exampleError.rule}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function ScrollScreen() {
  const navigate = useNavigate()
  const { state } = useStore()
  const [rightTab, setRightTab] = useState<'passport' | 'patterns' | 'badges'>('passport')

  const patterns = computePatterns(state.errors)
  const topPattern = patterns[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflowY: 'auto', background: 'var(--papyrus)', position: 'relative' }}
    >
      {/* Crosshatch texture */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(16,185,129,0.05) 0px,
              rgba(16,185,129,0.05) 1px,
              transparent 1px,
              transparent 20px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(16,185,129,0.05) 0px,
              rgba(16,185,129,0.05) 1px,
              transparent 1px,
              transparent 20px
            )
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(180deg, #0d1117 0%, #1a1f2e 100%)',
            padding: '48px 64px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left */}
            <div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: '#64748b',
                  marginBottom: '8px',
                }}
              >
                Your Scroll
              </div>
              <h1
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  letterSpacing: '-0.01em',
                }}
              >
                Alessandro's Progress
              </h1>
              <p
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: '#64748b',
                  marginTop: '6px',
                }}
              >
                Fluency earned through real conversation
              </p>
            </div>

            {/* Right: language pill + add */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  background: '#0d1117',
                  border: '1px solid rgba(52,211,153,0.2)',
                  borderRadius: '14px',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>🇮🇹</span>
                <span
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '14px',
                    color: 'var(--moon)',
                  }}
                >
                  Italian
                </span>
                <span
                  style={{
                    background: 'var(--lapis)',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '10px',
                    color: 'var(--moon-bright)',
                    letterSpacing: '0.08em',
                  }}
                >
                  B1
                </span>
              </div>
              <button
                style={{
                  border: '1px dashed rgba(16,185,129,0.25)',
                  borderRadius: '14px',
                  padding: '12px 20px',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '11px',
                  color: '#64748b',
                  transition: 'border-color 150ms ease',
                }}
              >
                ＋ Add Language
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            padding: '48px 64px',
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            {/* COMPETENCIES */}
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#64748b',
                marginBottom: '14px',
              }}
            >
              Competencies
            </div>
            {skills.map((skill, i) => (
              <SkillBar key={skill.label} {...skill} index={i} />
            ))}

            {/* RECENT ACTIVITY */}
            <div
              style={{
                marginTop: '32px',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#64748b',
                marginBottom: '14px',
              }}
            >
              Recent Activity
            </div>
            {recentActivity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Tab switcher */}
            <div
              style={{
                display: 'flex',
                gap: '0',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(16,185,129,0.15)',
              }}
            >
              {(['passport', 'patterns', 'badges'] as const).map((tab) => {
                const active = rightTab === tab
                const label = tab === 'passport' ? 'Passport' : tab === 'patterns' ? 'Patterns' : 'Badges'
                return (
                  <button
                    key={tab}
                    onClick={() => setRightTab(tab)}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: active ? '2px solid var(--lapis)' : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: active ? '#0d1117' : '#64748b',
                      fontWeight: active ? 700 : 400,
                      transition: 'color 150ms ease',
                      marginBottom: '-1px',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">

              {/* ── PASSPORT TAB ── */}
              {rightTab === 'passport' && (
                <motion.div
                  key="passport"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* SCENES PASSPORT */}
                  <div
                    style={{
                      background: '#161b27',
                      border: '1px solid rgba(16,185,129,0.12)',
                      borderRadius: '18px',
                      padding: '24px',
                      marginBottom: '24px',
                    }}
                  >
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
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#e2e8f0',
                        }}
                      >
                        Scenes Completed
                      </span>
                      <span
                        style={{
                          fontFamily: 'Public Sans, sans-serif',
                          fontSize: '11px',
                          color: '#64748b',
                        }}
                      >
                        14 of 48
                      </span>
                    </div>
                    <StampGrid stamps={stamps} columns={4} />
                  </div>

                  {/* WEEKLY STREAK CHART */}
                  <div
                    style={{
                      background: '#161b27',
                      border: '1px solid rgba(16,185,129,0.12)',
                      borderRadius: '18px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#e2e8f0',
                        marginBottom: '20px',
                      }}
                    >
                      This Week
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-end',
                        height: '80px',
                      }}
                    >
                      {weeklyActivity.map((bar, i) => (
                        <div
                          key={bar.day}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            flex: 1,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: bar.height }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 + i * 0.05 }}
                            style={{
                              background: bar.isToday ? 'var(--lapis-mid)' : 'var(--lapis-deep)',
                              borderRadius: '4px 4px 0 0',
                              width: '100%',
                            }}
                          />
                          <span
                            style={{
                              fontFamily: 'Public Sans, sans-serif',
                              fontSize: '8px',
                              textTransform: 'uppercase',
                              color: bar.isToday ? '#0d1117' : '#64748b',
                              fontWeight: bar.isToday ? 700 : 400,
                            }}
                          >
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PATTERNS TAB ── */}
              {rightTab === 'patterns' && (
                <motion.div
                  key="patterns"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Section label */}
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: '#64748b',
                      marginBottom: '16px',
                    }}
                  >
                    Your Grammar Patterns
                  </div>

                  {patterns.length === 0 ? (
                    <div
                      style={{
                        background: '#161b27',
                        border: '1px solid rgba(16,185,129,0.12)',
                        borderRadius: '16px',
                        padding: '28px',
                        textAlign: 'center',
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '15px',
                        fontStyle: 'italic',
                        color: '#64748b',
                      }}
                    >
                      No recurring patterns yet — keep practising!
                    </div>
                  ) : (
                    patterns.map((p) => (
                      <PatternCard key={p.category} pattern={p} errors={state.errors} />
                    ))
                  )}

                  {/* Accuracy chart */}
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: '#64748b',
                      margin: '24px 0 16px',
                    }}
                  >
                    Accuracy over time
                  </div>

                  <div
                    style={{
                      background: '#161b27',
                      border: '1px solid rgba(16,185,129,0.12)',
                      borderRadius: '18px',
                      padding: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      {/* Bars */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: `${MAX_BAR_H}px` }}>
                        {sessionAccuracy.map((pct, i) => {
                          const h = Math.round((pct / 100) * MAX_BAR_H)
                          return (
                            <div
                              key={i}
                              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}
                            >
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: h }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 + i * 0.06 }}
                                style={{
                                  width: '100%',
                                  background: `linear-gradient(180deg, var(--lapis-bright) 0%, var(--lapis-deep) 100%)`,
                                  borderRadius: '4px 4px 0 0',
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>

                      {/* Trend line overlay */}
                      <svg
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${MAX_BAR_H}px`, pointerEvents: 'none' }}
                        viewBox={`0 0 ${sessionAccuracy.length * 32} ${MAX_BAR_H}`}
                        preserveAspectRatio="none"
                      >
                        <motion.polyline
                          points={sessionAccuracy
                            .map((pct, i) => {
                              const x = i * 32 + 16
                              const y = MAX_BAR_H - Math.round((pct / 100) * MAX_BAR_H) + 2
                              return `${x},${y}`
                            })
                            .join(' ')}
                          fill="none"
                          stroke="var(--lapis-bright)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={0.7}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
                        />
                      </svg>
                    </div>

                    {/* Labels */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      {sessionLabels.map((label, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '7px',
                            textTransform: 'uppercase',
                            color: '#64748b',
                          }}
                        >
                          {label.replace('Mar ', '')}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini-drill card */}
                  {topPattern && (
                    <>
                      <div
                        style={{
                          fontFamily: 'Public Sans, sans-serif',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.22em',
                          color: '#64748b',
                          marginBottom: '12px',
                        }}
                      >
                        Suggested Drill
                      </div>

                      <div
                        style={{
                          background: '#0d1117',
                          border: '1px solid rgba(52,211,153,0.2)',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            color: 'var(--lapis-bright)',
                            marginBottom: '8px',
                          }}
                        >
                          Based on your {categoryLabels[topPattern.category].toLowerCase()} pattern
                        </div>
                        <div
                          style={{
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: 'var(--moon)',
                            marginBottom: '6px',
                            lineHeight: 1.3,
                          }}
                        >
                          5-minute drill: {topPattern.category === 'verb-tense'
                            ? 'Condizionale vs Passato Prossimo'
                            : topPattern.category === 'gender-agreement'
                            ? 'Noun Gender & Agreement'
                            : categoryLabels[topPattern.category]
                          }
                        </div>
                        <div
                          style={{
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            color: 'var(--moon-dim)',
                            marginBottom: '16px',
                          }}
                        >
                          3 quick exercises built from your actual mistakes
                        </div>
                        <button
                          onClick={() => navigate(`/drill/${topPattern.category}`)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(226,232,240,0.25)',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--moon)',
                            transition: 'border-color 150ms ease',
                          }}
                          onMouseEnter={(e) => {
                            ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                              'rgba(52,211,153,0.4)'
                          }}
                          onMouseLeave={(e) => {
                            ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                              'rgba(226,232,240,0.25)'
                          }}
                        >
                          Start Drill →
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── BADGES TAB ── */}
              {rightTab === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: '#64748b',
                      marginBottom: '16px',
                    }}
                  >
                    Your Achievements
                  </div>
                  <BadgeShowcase />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
