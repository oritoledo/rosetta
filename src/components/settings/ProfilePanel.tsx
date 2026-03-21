import { useState } from 'react'
import { useStore } from '../../store/userStore'
import SettingRow from './SettingRow'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatJoinDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Cinzel, serif',
  fontSize: 9,
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'var(--lapis-bright)',
}

const card: React.CSSProperties = {
  background: 'var(--basalt-mid)',
  border: '1px solid rgba(232,238,245,0.07)',
  borderRadius: 18,
  padding: '20px 24px',
}

const styledSelect: React.CSSProperties = {
  background: 'var(--basalt-raised)',
  border: '1px solid rgba(232,238,245,0.1)',
  borderRadius: 10,
  height: 38,
  padding: '0 12px',
  color: 'var(--moon)',
  fontFamily: 'Cinzel, serif',
  fontSize: 12,
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 32,
  minWidth: 160,
}

import React from 'react'

export default function ProfilePanel({ id }: { id: string }) {
  const { state, dispatch } = useStore()
  const user = state.user

  const [avatarHovered, setAvatarHovered] = useState(false)
  const [nameVal, setNameVal] = useState(user?.name ?? '')
  const [editingName, setEditingName] = useState(false)

  const initial = (user?.name ?? 'A')[0].toUpperCase()

  function commitName() {
    const trimmed = nameVal.trim()
    if (trimmed && user) {
      dispatch({ type: 'UPDATE_USER_NAME', payload: trimmed })
    } else {
      setNameVal(user?.name ?? '')
    }
    setEditingName(false)
  }

  const sessions = state.sessionHistory.length
  const streak = state.sessionHistory.length > 0 ? Math.min(state.sessionHistory.length, 7) : 0
  const wordsLearned = state.vocabulary.filter((w) => w.repetitions >= 1).length
  const badges = state.unlockedBadges.length

  const stats = [
    { value: sessions, label: 'Sessions' },
    { value: streak,   label: 'Day Streak' },
    { value: wordsLearned, label: 'Words' },
    { value: badges,   label: 'Badges' },
  ]

  return (
    <section id={id}>
      {/* Section label */}
      <div style={sectionLabel}>Profile</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,238,245,0.08)', margin: '10px 0 20px' }} />

      {/* Profile card */}
      <div
        style={{
          background: 'var(--lapis-deep)',
          border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: 18,
          padding: 24,
          marginBottom: 20,
          boxShadow: '0 4px 24px rgba(6,78,59,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Avatar */}
        <div
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
          onClick={() => {
            const newName = window.prompt('Enter your display name:', user?.name ?? '')
            if (newName?.trim()) {
              dispatch({ type: 'UPDATE_USER_NAME', payload: newName.trim() })
              setNameVal(newName.trim())
            }
          }}
          style={{
            position: 'relative',
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--basalt)',
            border: '2px solid rgba(52,211,153,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {avatarHovered ? (
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 18 }}>📷</div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--moon-dim)', marginTop: 2 }}>Change</div>
            </div>
          ) : (
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)' }}>
              {initial}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {editingName ? (
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName() }}
              style={{
                background: 'rgba(232,238,245,0.08)',
                border: '1px solid rgba(52,211,153,0.3)',
                borderRadius: 8,
                padding: '4px 10px',
                fontFamily: 'Cinzel, serif',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--moon-bright)',
                outline: 'none',
                marginBottom: 4,
              }}
            />
          ) : (
            <div
              onClick={() => setEditingName(true)}
              style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, color: 'var(--moon-bright)', cursor: 'text', marginBottom: 4 }}
            >
              {user?.name ?? 'Your Name'}
            </div>
          )}
          <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'var(--lapis-bright)', marginBottom: 4 }}>
            Learning {user?.language ?? '—'} · Level {user?.level ?? '—'}
          </div>
          <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>
            Joined {user?.startDate ? formatJoinDate(user.startDate) : 'recently'}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {stats.map(({ value, label }) => (
          <div
            key={label}
            style={{
              ...card,
              padding: 14,
              textAlign: 'center' as const,
            }}
          >
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: 'var(--moon-bright)', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: 'var(--muted)', marginTop: 6 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Settings card */}
      <div style={card}>
        <SettingRow
          label="Display Name"
          description="Shown in greetings and on your passport"
          control={
            <input
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => {
                const trimmed = nameVal.trim()
                if (trimmed && user) dispatch({ type: 'UPDATE_USER_NAME', payload: trimmed })
              }}
              style={{
                background: 'var(--basalt-raised)',
                border: '1px solid rgba(232,238,245,0.1)',
                borderRadius: 10,
                height: 38,
                padding: '0 12px',
                color: 'var(--moon)',
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: 13,
                outline: 'none',
                width: 180,
              }}
            />
          }
        />
        <SettingRow
          label="Learning Language"
          description="Your active target language"
          control={
            <select
              value={user?.language ?? 'Italian'}
              onChange={(e) => dispatch({ type: 'UPDATE_LANGUAGE', payload: e.target.value })}
              style={styledSelect}
            >
              <option value="Italian">🇮🇹 Italian</option>
              <option value="Spanish">🇪🇸 Spanish</option>
              <option value="French">🇫🇷 French</option>
              <option value="German">🇩🇪 German</option>
            </select>
          }
        />
        <SettingRow
          label="Current Level"
          description="Auto-detected from your sessions. Override if needed."
          last
          control={
            <select
              value={user?.level ?? 'B1'}
              onChange={(e) => dispatch({ type: 'UPDATE_LEVEL', payload: e.target.value })}
              style={styledSelect}
            >
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          }
        />
      </div>
    </section>
  )
}
