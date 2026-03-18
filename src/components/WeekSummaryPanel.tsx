import { motion } from 'framer-motion'
import type { WeeklyPlan, DayPlan } from '../types/plan'
import { computeVocabForecast } from '../utils/planGenerator'
import type { VocabWord } from '../data/vocabulary'

interface WeekSummaryPanelProps {
  plan: WeeklyPlan
  vocab: VocabWord[]
}

const PRIORITY_META = {
  critical:    { dot: '#e85050', label: 'Critical' },
  important:   { dot: '#c9a84c', label: 'Important' },
  maintenance: { dot: '#52d48a', label: 'Maintenance' },
}

function dayShortLabel(day: DayPlan): string {
  if (day.isToday) return 'TODAY'
  const d = day.date instanceof Date ? day.date : new Date(day.date)
  return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

export default function WeekSummaryPanel({ plan, vocab }: WeekSummaryPanelProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const forecast = computeVocabForecast(vocab, today)
  const maxForecast = Math.max(...forecast, 1)

  // Grammar focus occurrences this week
  const grammarMap = new Map<string, { count: number; priority: string; category: string }>()
  for (const day of plan.days) {
    if (day.isRest || !day.grammarFocus) continue
    const key = day.grammarFocus.category
    const existing = grammarMap.get(key)
    if (existing) {
      existing.count++
    } else {
      grammarMap.set(key, {
        count: 1,
        priority: day.grammarFocus.priority,
        category: day.grammarFocus.title,
      })
    }
  }
  const grammarEntries = Array.from(grammarMap.entries()).slice(0, 3)

  // Top insight
  const topCat = grammarEntries[0]
  const insightText = topCat
    ? `${topCat[1].category} appears ${topCat[1].count}× this week because it's your most frequent error pattern`
    : 'Your plan is balanced across all skill areas this week.'

  // Day-by-day labels for chart
  const dayLabels = plan.days.map((day) => dayShortLabel(day).slice(0, 3))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Week at a Glance ── */}
      <div
        style={{
          background: 'var(--basalt-mid)',
          border: '1px solid rgba(232,238,245,0.07)',
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--lapis-bright)',
            marginBottom: '16px',
          }}
        >
          Week at a Glance
        </div>

        {/* Stats */}
        {[
          { label: 'Total time',       value: `${plan.weekSummary.totalMinutes} min`           },
          { label: 'Sessions planned', value: String(plan.weekSummary.scenesPlanned)           },
          { label: 'Vocab targets',    value: `${plan.weekSummary.vocabTargets} words`         },
          { label: 'Rest days',        value: String(plan.weekSummary.restDays)                },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: '13px',
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--moon-bright)',
              }}
            >
              {row.value}
            </span>
          </div>
        ))}

        {/* Week progress bar */}
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--muted)',
              marginBottom: '6px',
            }}
          >
            Week Progress
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            {plan.days.map((day, i) => {
              const isCompleted = day.isCompleted
              const isToday = day.isToday
              const isRest = day.isRest

              let bg = 'var(--basalt-edge)'
              if (isCompleted) bg = 'var(--lapis-mid)'
              if (isRest) bg = 'var(--basalt-raised)'

              return (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: bg,
                    position: 'relative',
                    overflow: 'hidden',
                    ...(isRest ? {
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(232,238,245,0.05) 2px, rgba(232,238,245,0.05) 4px)',
                    } : {}),
                  }}
                >
                  {isToday && !isCompleted && (
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--moon-bright)',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '3px',
              marginTop: '4px',
            }}
          >
            {plan.days.map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  fontFamily: 'Cinzel, serif',
                  fontSize: '6px',
                  textTransform: 'uppercase',
                  color: day.isToday ? 'var(--lapis-bright)' : 'var(--muted)',
                  textAlign: 'center',
                  opacity: day.isRest ? 0.4 : 1,
                }}
              >
                {dayLabels[i]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grammar Focus Summary ── */}
      <div
        style={{
          background: 'var(--basalt-mid)',
          border: '1px solid rgba(232,238,245,0.07)',
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--lapis-bright)',
            marginBottom: '14px',
          }}
        >
          This Week's Focus
        </div>

        {grammarEntries.map(([, meta], i) => {
          const pm = PRIORITY_META[meta.priority as keyof typeof PRIORITY_META] ?? PRIORITY_META.maintenance
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom:
                  i < grammarEntries.length - 1
                    ? '1px solid rgba(232,238,245,0.05)'
                    : 'none',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: pm.dot,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--moon)',
                  flex: 1,
                }}
              >
                {meta.category}
              </span>
              <span
                style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '11px',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  flexShrink: 0,
                }}
              >
                ×{meta.count} this week
              </span>
            </div>
          )
        })}

        {/* Insight box */}
        <div
          style={{
            background: 'rgba(42,82,152,0.1)',
            border: '1px solid rgba(91,143,214,0.15)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginTop: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'var(--moon-dim)',
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            {insightText}
          </p>
        </div>
      </div>

      {/* ── Vocab Forecast ── */}
      <div
        style={{
          background: 'var(--basalt-mid)',
          border: '1px solid rgba(232,238,245,0.07)',
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--lapis-bright)',
            marginBottom: '14px',
          }}
        >
          Vocabulary Forecast
        </div>

        {/* Bar chart */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-end',
            height: '64px',
          }}
        >
          {forecast.map((count, i) => {
            const barH = count > 0 ? Math.max(4, Math.round((count / maxForecast) * 64)) : 0
            const isToday = i === 0
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: 'flex-end',
                  height: '64px',
                }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barH }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.05 }}
                  style={{
                    width: '100%',
                    background: isToday ? 'var(--lapis-bright)' : 'var(--lapis-deep)',
                    borderRadius: '3px 3px 0 0',
                    minHeight: barH > 0 ? '4px' : '0',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Day labels */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          {dayLabels.map((label, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'Cinzel, serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                color: i === 0 ? 'var(--lapis-bright)' : 'var(--muted)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--moon-bright)',
            }}
          >
            {forecast.reduce((a, b) => a + b, 0)} words
          </span>
          <span
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '11px',
              fontStyle: 'italic',
              color: 'var(--muted)',
            }}
          >
            across {plan.weekSummary.scenesPlanned} sessions
          </span>
        </div>
      </div>
    </div>
  )
}
