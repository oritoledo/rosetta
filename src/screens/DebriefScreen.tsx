import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import CorrectionCard from '../components/CorrectionCard'
import { CorrectionCardProps } from '../components/CorrectionCard'
import { useStore } from '../store/userStore'
import { ErrorCategory, categoryLabels } from '../data/errors'

const corrections: CorrectionCardProps[] = [
  {
    type: 'error',
    category: 'Tense Error',
    youSaid: 'Ho voluto ordinare…',
    nativeForm: 'Vorrei ordinare…',
    rule: 'Use condizionale (vorrei) not passato prossimo for polite requests in shops and restaurants.',
  },
  {
    type: 'good',
    category: 'Excellent Usage',
    text: "'per favore' placed naturally after the order — very idiomatic and native-sounding.",
  },
  {
    type: 'error',
    category: 'Word Choice',
    youSaid: 'caffè nero',
    nativeForm: 'caffè amaro',
    rule: "Locals say 'amaro' (bitter) not 'nero' (black) for black coffee without sugar.",
  },
  {
    type: 'good',
    category: 'Natural Phrasing',
    text: "'quanto costa?' — perfect! Very natural way to ask the price at a shop or café.",
  },
  {
    type: 'error',
    category: 'Pronunciation Note',
    youSaid: 'COR-netto',
    nativeForm: 'cor-NET-to',
    rule: 'Italian stress falls on the second-to-last syllable (penultimate) in most words — cor-NET-to, not COR-netto.',
  },
]

// ─── Detect recurring error patterns from the store ──────────────────────────

function useRecurringPattern(): { category: ErrorCategory; label: string; count: number } | null {
  const { state } = useStore()
  const counts: Partial<Record<ErrorCategory, number>> = {}

  for (const err of state.errors) {
    counts[err.type] = (counts[err.type] ?? 0) + 1
  }

  let topCategory: ErrorCategory | null = null
  let topCount = 0

  for (const [cat, count] of Object.entries(counts) as [ErrorCategory, number][]) {
    if (count >= 2 && count > topCount) {
      topCount = count
      topCategory = cat
    }
  }

  if (!topCategory) return null
  return { category: topCategory, label: categoryLabels[topCategory], count: topCount }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DebriefScreen() {
  const navigate = useNavigate()
  const pattern = useRecurringPattern()

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
          minHeight: '100dvh',
          overflowY: 'auto',
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: 'var(--basalt)',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100dvh',
          }}
        >
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--lapis-bright)',
              opacity: 0.7,
              marginBottom: '24px',
            }}
          >
            Scene Complete
          </div>

          {/* Score ring */}
          <ScoreRing score={74} size={120} />

          <h1
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--moon-bright)',
              marginTop: '24px',
              lineHeight: 1.2,
            }}
          >
            Well Spoken, Alessandro
          </h1>
          <p
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '16px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              marginTop: '6px',
            }}
          >
            Your finest café scene yet
          </p>

          {/* Stat cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {[
              { value: '12', label: 'Exchanges', trend: '+4 from last' },
              { value: '4',  label: 'Errors',    trend: '−2 from last' },
              { value: '+18',label: 'New Words',  trend: 'personal best' },
            ].map(({ value, label, trend }) => (
              <div
                key={label}
                style={{
                  background: 'var(--basalt-mid)',
                  border: '1px solid rgba(226,232,240,0.07)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--muted)',
                    marginTop: '6px',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: 'var(--lapis-bright)',
                    marginTop: '4px',
                  }}
                >
                  {trend}
                </div>
              </div>
            ))}
          </div>

          {/* Done button */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ backgroundColor: 'var(--lapis-mid)', boxShadow: '0 0 56px rgba(16,185,129,0.5)' }}
            transition={{ duration: 0.15 }}
            style={{
              marginTop: '40px',
              width: '100%',
              height: '60px',
              background: 'var(--lapis)',
              border: '1px solid rgba(52,211,153,0.4)',
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(16,185,129,0.35)',
              cursor: 'pointer',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--moon-bright)',
            }}
          >
            Done →
          </motion.button>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            background: 'var(--basalt-mid)',
            borderLeft: '1px solid rgba(226,232,240,0.06)',
            padding: '60px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--lapis-bright)',
              opacity: 0.7,
              marginBottom: '20px',
            }}
          >
            Corrections &amp; Highlights
          </div>

          {corrections.map((c, i) => (
            <CorrectionCard key={i} {...c} />
          ))}

          {/* ── PATTERN DETECTED ─────────────────────────────────────────────── */}
          {pattern && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              style={{
                marginTop: '28px',
                background: 'rgba(232,73,15,0.08)',
                borderLeft: '3px solid #e8490f',
                border: '1px solid rgba(232,73,15,0.2)',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#e8490f',
                  marginBottom: '8px',
                }}
              >
                ⚠ Recurring pattern
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--moon-dim)',
                  lineHeight: 1.55,
                  marginBottom: '4px',
                }}
              >
                You've made {pattern.label.toLowerCase()} errors in {pattern.count} of your recent scenes.
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  marginBottom: '10px',
                }}
              >
                We'll weave more {pattern.label.toLowerCase()} practice into your next scenes automatically.
              </div>
              <button
                onClick={() => navigate('/scroll')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '10px',
                  color: 'var(--lapis-bright)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.textDecoration = 'none'
                }}
              >
                See all patterns →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
