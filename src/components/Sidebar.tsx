import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/userStore'

interface NavItem {
  icon: string
  label: string
  path: string
  match: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    icon: '🗣️',
    label: 'Speak',
    path: '/',
    match: (p) =>
      p === '/' ||
      p.startsWith('/scene') ||
      p.startsWith('/conversation') ||
      p === '/debrief',
  },
  {
    icon: '⚡',
    label: 'Practice',
    path: '/practice',
    match: (p) => p === '/practice' || p.startsWith('/review') || p.startsWith('/drill'),
  },
  {
    icon: '📅',
    label: 'Plan',
    path: '/plan',
    match: (p) => p === '/plan',
  },
  {
    icon: '📜',
    label: 'Scroll',
    path: '/scroll',
    match: (p) => p === '/scroll',
  },
  {
    icon: '⚙️',
    label: 'Settings',
    path: '/settings',
    match: (p) => p === '/settings',
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useStore()

  const dueCount = state.reviewQueue.length
  const user = state.user
  const plan = state.weeklyPlan
  const todayPlan = plan?.days.find((d) => d.isToday && !d.isRest)

  return (
    <aside
      style={{
        width: '240px',
        height: '100dvh',
        background: 'var(--basalt)',
        borderRight: '1px solid rgba(232,238,245,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo section */}
      <div
        style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid rgba(232,238,245,0.06)',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            color: 'var(--lapis-bright)',
            opacity: 0.7,
            marginBottom: '6px',
          }}
        >
          𓂀
        </div>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '20px',
            fontWeight: 900,
            color: 'var(--moon-bright)',
            letterSpacing: '0.18em',
          }}
        >
          ROSETTA
        </div>
        <div
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '11px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginTop: '3px',
          }}
        >
          speak every tongue
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const active = item.match(location.pathname)
          // Badge: amber dot + count on Practice when review words are due
          const showBadge = item.label === 'Practice' && dueCount > 0

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: active ? 'var(--lapis-deep)' : 'transparent',
                border: active
                  ? '1px solid rgba(91,143,214,0.2)'
                  : '1px solid transparent',
                boxShadow: active
                  ? '0 0 16px rgba(42,82,152,0.25)'
                  : 'none',
                width: '100%',
                textAlign: 'left',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    'var(--basalt-mid)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    'transparent'
                }
              }}
            >
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--lapis-bright)' : 'var(--muted)',
                  transition: 'color 150ms ease',
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {showBadge && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#c9a84c',
                      boxShadow: '0 0 6px rgba(201,168,76,0.5)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#c9a84c',
                    }}
                  >
                    {dueCount}
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Review due section */}
      {dueCount > 0 && (
        <div style={{ padding: '0 12px', marginBottom: '8px' }}>
          {dueCount < 4 ? (
            <button
              onClick={() => navigate('/review')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#c9a84c',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '10px',
                  color: 'var(--moon)',
                  flex: 1,
                }}
              >
                {dueCount} word{dueCount !== 1 ? 's' : ''} due
              </span>
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '9px',
                  color: 'var(--lapis-bright)',
                }}
              >
                Review →
              </span>
            </button>
          ) : (
            <div
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#c9a84c',
                  marginBottom: '6px',
                }}
              >
                Review Due
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                    lineHeight: 1,
                  }}
                >
                  {dueCount}
                </span>
                <span
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '10px',
                    color: 'var(--muted)',
                  }}
                >
                  words to review
                </span>
              </div>
              <button
                onClick={() => navigate('/review')}
                style={{
                  width: '100%',
                  padding: '7px 0',
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.35)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#c9a84c',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(201,168,76,0.1)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                Start Review →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Today's plan preview (shown above user profile when plan exists) */}
      {todayPlan && todayPlan.scene && todayPlan.grammarFocus && (
        <div style={{ padding: '0 12px 12px' }}>
          <button
            onClick={() => navigate('/plan')}
            style={{
              width: '100%',
              background: 'var(--lapis-deep)',
              border: '1px solid rgba(91,143,214,0.2)',
              borderRadius: '12px',
              padding: '10px 12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--lapis-bright)',
                opacity: 0.7,
                marginBottom: '6px',
              }}
            >
              Today's Plan
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{todayPlan.scene.emoji}</span>
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--moon)',
                }}
              >
                {todayPlan.scene.title}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: '10px',
                fontStyle: 'italic',
                color: 'var(--moon-dim)',
              }}
            >
              {todayPlan.estimatedMinutes} min · {todayPlan.grammarFocus.category}
            </div>
          </button>
        </div>
      )}

      {/* User section */}
      <div
        style={{
          marginTop: 'auto',
          padding: '16px 12px',
          borderTop: '1px solid rgba(232,238,245,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--lapis-deep)',
            border: '1px solid rgba(91,143,214,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--moon-bright)',
            }}
          >
            {(user?.name ?? 'A')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              color: 'var(--moon)',
            }}
          >
            {user?.name ?? 'Alessandro'}
          </div>
          <div
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '10px',
              fontStyle: 'italic',
              color: 'var(--lapis-bright)',
              marginTop: '1px',
            }}
          >
            {user ? `${user.language} — ${user.level}` : 'Italian — B1'}
          </div>
        </div>
      </div>
    </aside>
  )
}
