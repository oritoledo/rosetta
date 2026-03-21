interface NavItem {
  id: string
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile',    icon: '👤', label: 'Profile' },
  { id: 'learning',   icon: '🎯', label: 'Learning' },
  { id: 'language',   icon: '🌍', label: 'Language' },
  { id: 'appearance', icon: '🎨', label: 'Appearance' },
  { id: 'harness',    icon: '🤖', label: 'Harness' },
  { id: 'danger',     icon: '⚠️', label: 'Danger Zone' },
]

interface SettingsNavProps {
  activeSection: string
  onSelect: (id: string) => void
}

export default function SettingsNav({ activeSection, onSelect }: SettingsNavProps) {
  return (
    <aside
      style={{
        width: 240,
        height: '100%',
        background: 'var(--basalt)',
        borderRight: '1px solid rgba(232,238,245,0.06)',
        padding: '48px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 9,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.22em',
          color: 'var(--lapis-bright)',
          marginBottom: 16,
          paddingLeft: 12,
        }}
      >
        Settings
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ id, icon, label }) => {
          const active = activeSection === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                cursor: 'pointer',
                background: active ? 'var(--lapis-deep)' : 'transparent',
                border: active
                  ? '1px solid rgba(52,211,153,0.2)'
                  : '1px solid transparent',
                boxShadow: active ? '0 0 12px rgba(5,150,105,0.2)' : 'none',
                width: '100%',
                textAlign: 'left' as const,
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--basalt-mid)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Icon box */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: active ? 'var(--lapis)' : 'var(--basalt-raised)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                  transition: 'background 150ms ease',
                }}
              >
                {icon}
              </div>
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: active ? 'var(--moon-bright)' : 'var(--moon-dim)',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Version info */}
      <div
        style={{
          borderTop: '1px solid rgba(232,238,245,0.06)',
          paddingTop: 16,
          paddingLeft: 12,
        }}
      >
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 8,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.2em',
            color: 'var(--muted)',
            marginBottom: 4,
          }}
        >
          Rosetta · v1.0.0
        </div>
        <div
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: 10,
            fontStyle: 'italic',
            color: 'var(--muted)',
          }}
        >
          Built with React + Claude API
        </div>
      </div>
    </aside>
  )
}
