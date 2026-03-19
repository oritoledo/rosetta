import { useLocation, useNavigate } from 'react-router-dom'

interface Tab {
  label: string
  icon: string
  path: string
  match: (pathname: string) => boolean
}

const tabs: Tab[] = [
  {
    label: 'Speak',
    icon: '🎙',
    path: '/',
    match: (p) => p === '/' || p.startsWith('/scene') || p.startsWith('/conversation') || p === '/debrief',
  },
  {
    label: 'Practice',
    icon: '✏️',
    path: '/practice',
    match: (p) => p === '/practice',
  },
  {
    label: 'Scroll',
    icon: '📜',
    path: '/scroll',
    match: (p) => p === '/scroll',
  },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isScroll = location.pathname === '/scroll'

  const navBg = isScroll
    ? 'rgba(240,236,228,0.97)'
    : 'rgba(16,16,16,0.97)'
  const navBorder = isScroll
    ? '1px solid rgba(100,80,60,0.15)'
    : '1px solid rgba(226,232,240,0.06)'
  const inactiveColor = isScroll ? '#64748b' : 'var(--muted)'
  const activeIconBg = isScroll ? 'var(--basalt)' : 'var(--lapis-deep)'
  const activeLabelColor = isScroll ? 'var(--basalt)' : 'var(--lapis-bright)'

  return (
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: navBg,
        borderTop: navBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const active = tab.match(location.pathname)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 18px',
              transition: 'opacity 150ms ease',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                fontSize: '18px',
                borderRadius: '10px',
                background: active ? activeIconBg : 'transparent',
                border: active
                  ? isScroll
                    ? '1px solid rgba(52,211,153,0.2)'
                    : '1px solid rgba(52,211,153,0.25)'
                  : '1px solid transparent',
                boxShadow: active
                  ? isScroll
                    ? 'none'
                    : '0 0 14px rgba(16,185,129,0.3)'
                  : 'none',
                transition: 'all 150ms ease',
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: active ? activeLabelColor : inactiveColor,
                transition: 'color 150ms ease',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
