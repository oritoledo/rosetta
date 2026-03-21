import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/userStore'

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Cinzel, serif',
  fontSize: 9,
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: '#e8504c',
}

const dangerBtn = (prominent = false): React.CSSProperties => ({
  background: prominent ? 'rgba(232,80,60,0.8)' : 'none',
  border: prominent ? 'none' : '1px solid rgba(232,80,60,0.3)',
  borderRadius: 10,
  padding: '7px 18px',
  cursor: 'pointer',
  fontFamily: 'Cinzel, serif',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: prominent ? 'var(--moon-bright)' : '#e8a090',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: 'opacity 150ms ease',
})

export default function DangerPanel({ id }: { id: string }) {
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetInput, setResetInput] = useState('')

  function exportData() {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('rosetta')) {
        try { data[key] = JSON.parse(localStorage.getItem(key)!) }
        catch { data[key] = localStorage.getItem(key) }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rosetta-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function resetPlan() {
    if (!window.confirm('Regenerate your weekly plan from scratch?')) return
    dispatch({ type: 'RESET_PLAN' })
  }

  function clearVocab() {
    if (!window.confirm('Reset all vocabulary progress? This returns all words to day 1.')) return
    dispatch({ type: 'CLEAR_VOCABULARY' })
  }

  function confirmResetAll() {
    // Clear all rosetta_ localStorage keys
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('rosetta')) keysToRemove.push(key)
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
    dispatch({ type: 'RESET_ALL' })
    navigate('/onboarding', { replace: true })
  }

  const dangerRows = [
    {
      label: 'Reset Weekly Plan',
      description: 'Regenerate your 7-day plan from scratch',
      button: <button onClick={resetPlan} style={dangerBtn()}>Reset Plan</button>,
    },
    {
      label: 'Clear Vocabulary Progress',
      description: 'Reset all SM-2 spaced repetition data. Words return to day 1.',
      button: <button onClick={clearVocab} style={dangerBtn()}>Clear Vocab</button>,
    },
    {
      label: 'Export My Data',
      description: 'Download all your progress as a JSON file',
      button: (
        <button
          onClick={exportData}
          style={{
            ...dangerBtn(),
            border: '1px solid rgba(52,211,153,0.25)',
            color: 'var(--lapis-bright)',
          }}
        >
          Export JSON
        </button>
      ),
    },
    {
      label: 'Reset All Progress',
      description: 'Wipe all sessions, errors, badges, and vocabulary. Cannot be undone.',
      button: <button onClick={() => setShowResetModal(true)} style={dangerBtn(true)}>Reset Everything</button>,
    },
  ]

  return (
    <section id={id}>
      <div style={sectionLabel}>Danger Zone</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,80,60,0.12)', margin: '10px 0 20px' }} />

      <div
        style={{
          border: '1px solid rgba(232,80,60,0.2)',
          borderRadius: 18,
          padding: '20px 24px',
          background: 'rgba(232,80,60,0.03)',
        }}
      >
        {dangerRows.map(({ label, description, button }, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              padding: '14px 0',
              borderBottom: i < dangerRows.length - 1 ? '1px solid rgba(232,80,60,0.08)' : 'none',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, color: '#e8a090', marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>{description}</div>
            </div>
            {button}
          </div>
        ))}
      </div>

      {/* Reset All modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowResetModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                background: 'var(--basalt-mid)',
                border: '1px solid rgba(232,80,60,0.3)',
                borderRadius: 20,
                padding: 36,
                width: 440,
                maxWidth: '90vw',
              }}
            >
              <div style={{ textAlign: 'center' as const, marginBottom: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: 'var(--moon-bright)', marginBottom: 12 }}>
                  Are you sure?
                </h2>
                <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.6 }}>
                  This will permanently delete all your progress, badges, and vocabulary. This cannot be undone.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontFamily: 'Cinzel, serif', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'var(--moon-dim)', marginBottom: 8 }}>
                  Type RESET to confirm
                </label>
                <input
                  autoFocus
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  placeholder="RESET"
                  style={{
                    width: '100%',
                    background: 'var(--basalt-raised)',
                    border: '1px solid rgba(232,80,60,0.3)',
                    borderRadius: 10,
                    height: 42,
                    padding: '0 14px',
                    color: 'var(--moon)',
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    fontSize: 14,
                    outline: 'none',
                    letterSpacing: '0.05em',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => { setShowResetModal(false); setResetInput('') }}
                  style={{
                    flex: 1,
                    height: 44,
                    background: 'none',
                    border: '1px solid rgba(232,238,245,0.15)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontFamily: 'Cinzel, serif',
                    fontSize: 12,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                    color: 'var(--moon-dim)',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  disabled={resetInput !== 'RESET'}
                  onClick={confirmResetAll}
                  animate={{ scale: resetInput === 'RESET' ? 1 : 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    flex: 1,
                    height: 44,
                    background: resetInput === 'RESET' ? 'rgba(232,80,60,0.85)' : 'rgba(232,80,60,0.2)',
                    border: 'none',
                    borderRadius: 12,
                    cursor: resetInput === 'RESET' ? 'pointer' : 'not-allowed',
                    fontFamily: 'Cinzel, serif',
                    fontSize: 12,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                    color: resetInput === 'RESET' ? 'var(--moon-bright)' : 'rgba(232,80,60,0.5)',
                    transition: 'background 200ms ease, color 200ms ease',
                  }}
                >
                  Reset Everything
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
