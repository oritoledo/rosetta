import { ReactNode } from 'react'

interface SettingRowProps {
  label: string
  description?: string
  control: ReactNode
  last?: boolean
  danger?: boolean
}

export default function SettingRow({
  label,
  description,
  control,
  last = false,
  danger = false,
}: SettingRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        padding: '14px 0',
        borderBottom: last
          ? 'none'
          : danger
          ? '1px solid rgba(232,80,60,0.08)'
          : '1px solid rgba(232,238,245,0.05)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 13,
            fontWeight: 600,
            color: danger ? '#e8a090' : 'var(--moon)',
            marginBottom: description ? 3 : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontFamily: 'Crimson Pro, Georgia, serif',
              fontSize: 11,
              fontStyle: 'italic',
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  )
}
