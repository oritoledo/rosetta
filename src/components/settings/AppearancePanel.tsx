import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../../store/settingsStore'
import { applyAccent } from '../../utils/colourUtils'
import SettingRow from './SettingRow'

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

interface ThemeOption {
  id: 'dark' | 'light' | 'system'
  label: string
  bg: string
  previewBg: string
  labelColor: string
}

const THEMES: ThemeOption[] = [
  { id: 'dark',   label: 'Dark',   bg: '#181818',     previewBg: '#1a1f2e',  labelColor: 'rgba(148,163,184,0.8)' },
  { id: 'light',  label: 'Light',  bg: '#f0ece4',     previewBg: '#ffffff',  labelColor: 'rgba(26,22,18,0.6)' },
  { id: 'system', label: 'System', bg: 'linear-gradient(135deg, #181818 50%, #f0ece4 50%)', previewBg: 'linear-gradient(135deg, #1a1f2e 50%, #ffffff 50%)', labelColor: 'rgba(148,163,184,0.8)' },
]

interface AccentSwatch {
  hex: string
  name: string
}

const ACCENTS: AccentSwatch[] = [
  { hex: '#059669', name: 'Emerald' },
  { hex: '#0f6e56', name: 'Teal' },
  { hex: '#6941c6', name: 'Amethyst' },
  { hex: '#c0540a', name: 'Copper' },
  { hex: '#9c1e2e', name: 'Crimson' },
]

export default function AppearancePanel({ id }: { id: string }) {
  const { settings, dispatchSettings } = useSettings()
  const [fontSize, setFontSize] = useState(settings.fontSize)

  const activeAccentName = ACCENTS.find((a) => a.hex === settings.accentColour)?.name ?? 'Custom'

  function selectTheme(t: ThemeOption['id']) {
    dispatchSettings({ type: 'UPDATE_THEME', payload: t })
  }

  function selectAccent(hex: string) {
    dispatchSettings({ type: 'UPDATE_ACCENT', payload: hex })
    applyAccent(hex)
  }

  function commitFontSize(v: number) {
    setFontSize(v)
    dispatchSettings({ type: 'UPDATE_FONT_SIZE', payload: v })
    document.documentElement.style.setProperty('--body-font-size', `${v}px`)
  }

  return (
    <section id={id}>
      <div style={sectionLabel}>Appearance</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,238,245,0.08)', margin: '10px 0 20px' }} />

      {/* Theme picker */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 16 }}>
          Theme
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {THEMES.map((t) => {
            const active = settings.theme === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  aspectRatio: '4/3',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  justifyContent: 'space-between',
                  background: t.bg,
                  border: active ? '1.5px solid var(--lapis-bright)' : '1px solid rgba(232,238,245,0.08)',
                  boxShadow: active ? '0 0 16px rgba(52,211,153,0.2)' : 'none',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  overflow: 'hidden',
                }}
              >
                {/* Mini preview */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: t.previewBg,
                        width: i === 3 ? '60%' : '100%',
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: t.labelColor }}>
                  {t.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Accent colour */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 8 }}>
          Accent Colour
        </div>
        <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 16 }}>
          Changes the primary interactive colour throughout the app
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
          {ACCENTS.map(({ hex, name }) => {
            const active = settings.accentColour === hex
            return (
              <motion.button
                key={hex}
                onClick={() => selectAccent(hex)}
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: hex,
                  border: active ? '3px solid var(--moon-bright)' : '3px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 150ms ease',
                }}
                title={name}
              />
            )
          })}
        </div>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: 'var(--lapis-bright)', textAlign: 'center' as const }}>
          {activeAccentName}
        </p>
      </div>

      {/* Font size */}
      <div style={card}>
        <SettingRow
          label="Text Size"
          description="Adjusts body text throughout the app"
          last
          control={
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, width: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)' }}>Aa</span>
                <input
                  type="range"
                  min={12}
                  max={18}
                  step={1}
                  value={fontSize}
                  onChange={(e) => commitFontSize(Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: 4,
                    appearance: 'none' as const,
                    WebkitAppearance: 'none' as const,
                    background: `linear-gradient(to right, var(--lapis-mid) 0%, var(--lapis-mid) ${((fontSize - 12) / 6) * 100}%, var(--basalt-edge) ${((fontSize - 12) / 6) * 100}%, var(--basalt-edge) 100%)`,
                    borderRadius: 4,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 18, fontStyle: 'italic', color: 'var(--muted)' }}>Aa</span>
              </div>
              <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize, fontStyle: 'italic', color: 'var(--moon-dim)', lineHeight: 1.5 }}>
                The quick brown fox — preview your font size here
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
