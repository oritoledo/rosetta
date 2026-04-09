import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

// ─── Local types (reads from localStorage, no store dependency) ───────────────

interface StoredUser {
  name: string
  language: string
  level: string
  startDate?: number
  streak?: number
}

interface StoredSession {
  id: string
  sceneId: string
  completedAt: number
  score?: number
}

interface StoredVocab {
  id: string
  repetitions?: number
}

// Badges persisted shape — access fields defensively
type StoredBadge = Record<string, unknown>

// ─── Static data ──────────────────────────────────────────────────────────────

const SCENES = [
  { id: 'cafe',       emoji: '☕', label: 'Café'       },
  { id: 'taxi',       emoji: '🚕', label: 'Taxi'       },
  { id: 'market',     emoji: '🛒', label: 'Market'     },
  { id: 'doctor',     emoji: '🏥', label: 'Doctor'     },
  { id: 'train',      emoji: '🚆', label: 'Train'      },
  { id: 'hotel',      emoji: '🏨', label: 'Hotel'      },
  { id: 'airport',    emoji: '✈️', label: 'Airport'    },
  { id: 'pharmacy',   emoji: '💊', label: 'Pharmacy'   },
  { id: 'restaurant', emoji: '🍽️', label: 'Restaurant' },
  { id: 'bank',       emoji: '🏦', label: 'Bank'       },
  { id: 'apartment',  emoji: '🏠', label: 'Apartment'  },
  { id: 'interview',  emoji: '💼', label: 'Interview'  },
]

const COMPETENCIES = [
  { name: 'Ordering & Requests',  value: 82 },
  { name: 'Small Talk',           value: 68 },
  { name: 'Emergency Situations', value: 51 },
  { name: 'Formal & Business',    value: 34 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function formatMonth(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } catch {
    return 'recently'
  }
}

function badgeName(b: StoredBadge): string {
  return (
    (b['badgeName'] as string) ??
    (b['name'] as string) ??
    (b['badgeId'] as string) ??
    'Badge'
  )
}

function badgeEmoji(b: StoredBadge): string {
  return (b['emoji'] as string) ?? '🏅'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PassportScreen() {
  const { username } = useParams<{ username: string }>()
  const [copied, setCopied] = useState(false)

  const user    = safeLoad<StoredUser | null>('rosetta_user', null)
  const sessions = safeLoad<StoredSession[]>('rosetta_sessions', [])
  const vocab    = safeLoad<StoredVocab[]>('rosetta_vocab', [])
  const badges   = safeLoad<StoredBadge[]>('rosetta_badges', [])

  const isOwn = !!user && user.name?.toLowerCase() === username?.toLowerCase()

  const completedSceneIds = new Set(sessions.map((s) => s.sceneId))
  const wordsLearned = vocab.filter((w) => (w.repetitions ?? 0) >= 1).length
  const streak = user?.streak ?? 0
  const sessionCount = sessions.length

  const earliest = sessions.length > 0
    ? sessions.reduce((a, b) => (a.completedAt < b.completedAt ? a : b), sessions[0])
    : null
  const sinceTs = earliest?.completedAt ?? user?.startDate ?? Date.now()
  const sinceLabel = formatMonth(sinceTs)

  const topSkill = COMPETENCIES[0]

  const displayBadges = [...badges].reverse().slice(0, 12)
  const extraBadges   = badges.length > 12 ? badges.length - 12 : 0

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => { /* silent */ })
  }

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh', fontFamily: 'Crimson Pro, Georgia, serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>

        {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.15em' }}>
            ROSETTA
          </span>
          {isOwn && (
            <button
              onClick={handleShare}
              style={{
                background: '#1A1A1A',
                color: 'white',
                fontFamily: 'Cinzel, serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Share Passport'}
            </button>
          )}
        </div>

        {/* ── PROFILE BLOCK ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--basalt-mid)',
            border: '2px solid rgba(232,238,245,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '32px', fontWeight: 700, color: 'var(--moon-bright)' }}>
              {(user?.name?.[0] ?? username?.[0] ?? '?').toUpperCase()}
            </span>
          </div>

          {/* Name */}
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.04em' }}>
            {user?.name ?? username ?? '—'}
          </div>

          {/* Language · level */}
          <div style={{ fontSize: '16px', fontStyle: 'italic', color: '#888', marginTop: '4px' }}>
            {user ? `Learning ${user.language} · ${user.level}` : '—'}
          </div>

          {/* Since */}
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#BBB', marginTop: '4px' }}>
            {user ? `Practising since ${sinceLabel}` : '—'}
          </div>
        </motion.div>

        {/* ── READINESS CARD ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: 'white',
            border: '1px solid #E5E0D8',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '40px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#C8694A',
            marginBottom: '12px',
          }}>
            Real-World Readiness
          </div>

          {user ? (
            <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#444', lineHeight: 1.7, margin: 0 }}>
              {user.name} can handle {topSkill.name.toLowerCase()} in {user.language} at {user.level} level,
              {' '}with {sessionCount} real conversation{sessionCount !== 1 ? 's' : ''} completed.
            </p>
          ) : (
            <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#AAA', lineHeight: 1.7, margin: 0 }}>
              No profile data found — this passport is empty.
            </p>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F0EBE3' }}>
            {([
              { value: sessionCount, label: 'Sessions'   },
              { value: streak,       label: 'Day Streak' },
              { value: wordsLearned, label: 'Words'      },
            ] as const).map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '8px', textTransform: 'uppercase', color: '#BBB', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── COMPETENCIES ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#888',
            marginBottom: '16px',
          }}>
            Competencies
          </div>

          {COMPETENCIES.map((comp, i) => (
            <div key={comp.name} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontStyle: 'italic', color: '#1A1A1A' }}>
                  {comp.name}
                </span>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                  {comp.value}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#F0EBE3', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--lapis-bright) 0%, var(--lapis-deep) 100%)',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── SCENE STAMPS ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>
              Scenes Completed
            </span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', color: '#BBB' }}>
              {completedSceneIds.size} of {SCENES.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {SCENES.map((scene, i) => {
              const done = completedSceneIds.has(scene.id)
              return (
                <motion.div
                  key={scene.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: done ? '#1A1A1A' : 'white',
                    border: done ? '1px solid rgba(91,143,214,0.2)' : '1px dashed #E5E0D8',
                  }}
                >
                  <div style={{
                    fontSize: '22px',
                    filter: done ? 'none' : 'grayscale(1)',
                    opacity: done ? 1 : 0.2,
                    marginBottom: '4px',
                  }}>
                    {scene.emoji}
                  </div>
                  <div style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: done ? 'rgba(232,238,245,0.5)' : '#BBB',
                  }}>
                    {scene.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── BADGES (skip if none) ────────────────────────────────────────── */}
        {badges.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#888',
              marginBottom: '16px',
            }}>
              Achievements
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {displayBadges.map((badge, i) => (
                <motion.div
                  key={String(badge['badgeId'] ?? i)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
                  style={{
                    background: 'white',
                    border: '1px solid #E5E0D8',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{badgeEmoji(badge)}</span>
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', fontWeight: 600, color: '#1A1A1A' }}>
                    {badgeName(badge)}
                  </span>
                </motion.div>
              ))}
              {extraBadges > 0 && (
                <div style={{
                  background: 'white',
                  border: '1px solid #E5E0D8',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '10px',
                  color: '#BBB',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  +{extraBadges} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid #E5E0D8', margin: '40px 0 24px' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#BBB' }}>
            Built with Rosetta · speak every tongue
          </div>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#C8694A',
            marginTop: '6px',
          }}>
            rosetta.app
          </div>
        </div>

      </div>
    </div>
  )
}
