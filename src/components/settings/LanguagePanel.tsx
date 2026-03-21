import React from 'react'
import { useSettings } from '../../store/settingsStore'
import Toggle from './Toggle'
import SegmentedControl from './SegmentedControl'
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

const ACTIVE_LANGUAGES = [
  { flag: '🇮🇹', name: 'Italian', level: 'B1', scenes: 12, words: 48, key: 'Italian' },
]

interface DialectOption {
  label: string
  options: { value: string; label: string }[]
  langKey: string
}

const DIALECT_OPTIONS: DialectOption[] = [
  { label: 'Italian Dialect', langKey: 'italian', options: [{ value: 'standard', label: 'Standard (Rome)' }, { value: 'northern', label: 'Northern (Milan)' }] },
  { label: 'Spanish Variant', langKey: 'spanish', options: [{ value: 'castilian', label: 'Castilian (Spain)' }, { value: 'latin-american', label: 'Latin American' }] },
  { label: 'French Accent', langKey: 'french', options: [{ value: 'parisian', label: 'Parisian' }, { value: 'quebecois', label: 'Québécois' }] },
  { label: 'German Accent', langKey: 'german', options: [{ value: 'hochdeutsch', label: 'Hochdeutsch' }, { value: 'austrian', label: 'Austrian' }] },
]

export default function LanguagePanel({ id }: { id: string }) {
  const { settings, dispatchSettings } = useSettings()

  return (
    <section id={id}>
      <div style={sectionLabel}>Language</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,238,245,0.08)', margin: '10px 0 20px' }} />

      {/* Active languages card */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 14 }}>
          Your Languages
        </div>

        {ACTIVE_LANGUAGES.map(({ flag, name, level, scenes, words }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(232,238,245,0.05)' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{flag}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 600, color: 'var(--moon)' }}>{name}</span>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.1em', background: 'var(--lapis)', color: 'var(--moon-bright)', borderRadius: 4, padding: '2px 6px' }}>{level}</span>
              </div>
              <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>
                {scenes} scenes · {words} words learned
              </span>
            </div>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--lapis-bright)', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 6, padding: '3px 8px' }}>Active</span>
          </div>
        ))}

        {/* Add language row */}
        <button
          onClick={() => alert('Language picker coming soon!')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '14px 0',
            marginTop: 8,
            border: '1px dashed rgba(52,211,153,0.25)',
            borderRadius: 10,
            background: 'rgba(52,211,153,0.04)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--lapis-bright)' }}>＋ Add Language</span>
        </button>
      </div>

      {/* Dialect / accent settings */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 14 }}>
          Accent Preferences
        </div>
        {DIALECT_OPTIONS.map(({ label, langKey, options }, i) => (
          <SettingRow
            key={langKey}
            label={label}
            description="Affects pronunciation guide and cultural briefings"
            last={i === DIALECT_OPTIONS.length - 1}
            control={
              <SegmentedControl
                options={options}
                value={settings.dialectPreferences[langKey] ?? options[0].value}
                onChange={(v) => dispatchSettings({ type: 'UPDATE_DIALECT', payload: { language: langKey, dialect: v } })}
              />
            }
          />
        ))}
      </div>

      {/* Other settings */}
      <div style={card}>
        <SettingRow
          label="Script Display"
          description="Show target language first or translation first in chat"
          control={
            <SegmentedControl
              options={[
                { value: 'target-first', label: 'Target first' },
                { value: 'translation-first', label: 'Translation first' },
              ]}
              value={settings.scriptOrder}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_SCRIPT_ORDER', payload: v })}
            />
          }
        />
        <SettingRow
          label="Translation Visibility"
          description="Show translations in conversations"
          control={
            <SegmentedControl
              options={[
                { value: 'always', label: 'Always' },
                { value: 'on-tap', label: 'On tap' },
                { value: 'never', label: 'Never' },
              ]}
              value={settings.translationVisibility}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_TRANSLATION_VISIBILITY', payload: v })}
            />
          }
        />
        <SettingRow
          label="Pronunciation Guide"
          description="Show phonetic spelling under vocabulary words"
          last
          control={
            <Toggle
              value={settings.pronunciationGuide}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_PRONUNCIATION_GUIDE', payload: v })}
            />
          }
        />
      </div>
    </section>
  )
}
