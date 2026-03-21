import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: '$1', label: '$1' },
  { value: '$5', label: '$5' },
  { value: '$10', label: '$10' },
  { value: '$25', label: '$25' },
  { value: 'unlimited', label: '∞' },
]

export default function HarnessPanel({ id }: { id: string }) {
  const { settings, dispatchSettings } = useSettings()
  const navigate = useNavigate()

  const [showKey, setShowKey] = useState(false)
  const [pendingKey, setPendingKey] = useState(settings.harnessApiKey)

  const maskedKey = settings.harnessApiKey
    ? `sk-ant-••••••${settings.harnessApiKey.slice(-4)}`
    : ''

  function saveApiKey() {
    if (pendingKey.trim()) {
      dispatchSettings({ type: 'UPDATE_HARNESS_API_KEY', payload: pendingKey.trim() })
    }
  }

  return (
    <section id={id}>
      <div style={sectionLabel}>Harness</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,238,245,0.08)', margin: '10px 0 20px' }} />

      {/* Status card */}
      <div
        style={{
          background: 'var(--lapis-deep)',
          border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: 18,
          padding: 20,
          marginBottom: 16,
          boxShadow: '0 4px 24px rgba(6,78,59,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Pulse dot */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: settings.harnessEnabled ? 'var(--lapis-bright)' : 'var(--muted)',
              boxShadow: settings.harnessEnabled ? '0 0 0 0 rgba(52,211,153,0.4)' : 'none',
              animation: settings.harnessEnabled ? 'harnessPulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 15, fontWeight: 700, color: 'var(--moon)', marginBottom: 2 }}>
            Agentic Harness
          </div>
          <div
            style={{
              fontFamily: 'Crimson Pro, Georgia, serif',
              fontSize: 12,
              fontStyle: 'italic',
              color: settings.harnessEnabled ? 'var(--lapis-bright)' : 'var(--muted)',
            }}
          >
            {settings.harnessEnabled ? 'Active — Planner & Evaluator running' : 'Disabled'}
          </div>
        </div>

        <Toggle
          value={settings.harnessEnabled}
          onChange={(v) => dispatchSettings({ type: 'SET_HARNESS_ENABLED', payload: v })}
        />
      </div>

      {/* Settings card */}
      <div style={{ ...card, marginBottom: 16 }}>
        {/* API Key */}
        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(232,238,245,0.05)' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, color: 'var(--moon)', marginBottom: 3 }}>API Key</div>
          <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 10 }}>
            Claude API key for Planner and Evaluator agents
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={showKey ? pendingKey : maskedKey}
              onChange={(e) => setPendingKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                flex: 1,
                background: 'var(--basalt-raised)',
                border: '1px solid rgba(232,238,245,0.1)',
                borderRadius: 10,
                height: 38,
                padding: '0 12px',
                color: 'var(--moon)',
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                background: 'var(--basalt-raised)',
                border: '1px solid rgba(232,238,245,0.1)',
                borderRadius: 8,
                height: 38,
                width: 38,
                cursor: 'pointer',
                color: 'var(--moon-dim)',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {showKey ? '🙈' : '👁'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <button
              onClick={saveApiKey}
              style={{
                background: 'var(--lapis-deep)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 8,
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: 10,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                color: 'var(--lapis-bright)',
              }}
            >
              Update Key
            </button>
            <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)' }}>
              Stored in localStorage (client-side only)
            </span>
          </div>
        </div>

        <SettingRow
          label="Monthly Token Budget"
          description="Pause harness when estimated cost exceeds this amount"
          control={
            <SegmentedControl
              options={BUDGET_OPTIONS}
              value={settings.harnessTokenBudget}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_HARNESS_BUDGET', payload: v as typeof settings.harnessTokenBudget })}
            />
          }
        />

        <div>
          <SettingRow
            label="Actor API"
            description="Enable real Claude API for conversation responses (higher cost)"
            control={
              <Toggle
                value={settings.harnessActorApi}
                onChange={(v) => dispatchSettings({ type: 'UPDATE_HARNESS_ACTOR_API', payload: v })}
              />
            }
          />
          {settings.harnessActorApi && (
            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8, padding: '5px 10px', marginBottom: 8, display: 'inline-block' }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#c9a84c' }}>
                ~$0.14/session when enabled
              </span>
            </div>
          )}
        </div>

        <SettingRow
          label="Show Directive in Brief"
          description="Highlight Planner's priority vocabulary in the pre-session brief"
          control={
            <Toggle
              value={settings.harnessShowDirective}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_HARNESS_SHOW_DIRECTIVE', payload: v })}
            />
          }
        />

        <SettingRow
          label="Show Evaluating Overlay"
          description="Display 'Evaluating your session…' animation after each scene"
          last
          control={
            <Toggle
              value={settings.harnessShowEvaluating}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_HARNESS_SHOW_EVALUATING', payload: v })}
            />
          }
        />
      </div>

      {/* Usage stats card */}
      <div style={card}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 12 }}>
          This Month
        </div>
        {[
          { label: 'Sessions with harness', value: settings.harnessSessionsCount },
          { label: 'Total tokens used', value: settings.harnessTotalTokens.toLocaleString() },
          { label: 'Estimated cost', value: `$${settings.harnessTotalCostUSD.toFixed(4)}` },
        ].map(({ label, value }, i, arr) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--moon-dim)' }}>{label}</span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, color: 'var(--moon)' }}>{value}</span>
          </div>
        ))}
        <button
          onClick={() => navigate('/harness')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--lapis-bright)', marginTop: 12, padding: 0 }}
        >
          View full usage →
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes harnessPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
      `}</style>
    </section>
  )
}
