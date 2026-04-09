import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider, useStore } from './store/userStore'
import { SettingsProvider } from './store/settingsStore'
import AchievementManager from './components/AchievementManager'
import HomeScreen from './screens/HomeScreen'
import SceneIntroScreen from './screens/SceneIntroScreen'
import ConversationScreen from './screens/ConversationScreen'
import DebriefScreen from './screens/DebriefScreen'
import ScrollScreen from './screens/ScrollScreen'
import PracticeScreen from './screens/PracticeScreen'
import SettingsScreen from './screens/SettingsScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import ReviewScreen from './screens/ReviewScreen'
import DrillScreen from './screens/DrillScreen'
import BriefScreen from './screens/BriefScreen'
import PlanScreen from './screens/PlanScreen'
import LandingScreen from './screens/LandingScreen'
import PassportScreen from './screens/PassportScreen'
import { generateWeeklyPlan, serializePlan, deserializePlan } from './utils/planGenerator'
import type { StoredPlan } from './types/plan'

// ─── Global error boundary ────────────────────────────────────────────────────

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'system-ui', color: '#1A1A1A', background: '#FAF9F6', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#888', marginBottom: 20 }}>Try clearing your data and reloading.</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload() }}
            style={{ background: '#1A1A1A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
          >
            Clear data and reload
          </button>
          <pre style={{ marginTop: 24, fontSize: 12, color: '#C8694A', background: '#FDF0EC', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {(this.state.error as Error).message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Boot guard: redirect to /onboarding if user not found ───────────────────

function BootGuard() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const raw = localStorage.getItem('rosetta_user')
    const exempt = ['/onboarding', '/landing']
    if (!raw && !exempt.includes(location.pathname)) {
      navigate('/landing', { replace: true })
    }
  }, [location.pathname])

  return null
}

// ─── Plan boot: generate or hydrate weekly plan ───────────────────────────────

const PLAN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function PlanBoot() {
  const { state, dispatch } = useStore()
  const generated = useRef(false)

  useEffect(() => {
    // Wait until user has been hydrated from localStorage
    if (!state.user) return
    // Only run once per mount
    if (generated.current) return

    // Try to load persisted plan from localStorage
    const raw = localStorage.getItem('rosetta_plan')
    if (raw) {
      try {
        const stored: StoredPlan = JSON.parse(raw)
        const age = Date.now() - stored.generatedAt
        if (age < PLAN_TTL_MS) {
          // Hydrate the stored plan
          const plan = deserializePlan(stored, state.vocabulary)
          // Re-mark today's isToday flag (date comparison)
          const todayStart = new Date()
          todayStart.setHours(0, 0, 0, 0)
          const updatedDays = plan.days.map((d) => {
            const dd = d.date instanceof Date ? d.date : new Date(d.date)
            return { ...d, isToday: dd.getTime() === todayStart.getTime() }
          })
          dispatch({
            type: 'SET_WEEKLY_PLAN',
            payload: { plan: { ...plan, days: updatedDays }, seed: stored.seed },
          })
          generated.current = true
          return
        }
      } catch {
        // Ignore malformed data, fall through to generate fresh
      }
    }

    // Generate a fresh plan
    const seed = state.planSeed || Date.now()
    const plan = generateWeeklyPlan(state, seed)
    dispatch({ type: 'SET_WEEKLY_PLAN', payload: { plan, seed } })
    generated.current = true
  }, [state.user])  // re-run only when user becomes available

  // Persist plan to localStorage whenever it changes
  useEffect(() => {
    if (!state.weeklyPlan) return
    try {
      const stored = serializePlan(state.weeklyPlan)
      localStorage.setItem('rosetta_plan', JSON.stringify(stored))
    } catch {
      // Ignore serialization errors
    }
  }, [state.weeklyPlan])

  return null
}

// ─── Animated route wrapper ───────────────────────────────────────────────────

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/onboarding"        element={<OnboardingScreen />}   />
        <Route path="/"                  element={<HomeScreen />}         />
        <Route path="/scene/:id"         element={<SceneIntroScreen />}   />
        <Route path="/conversation/:id"  element={<ConversationScreen />} />
        <Route path="/debrief"           element={<DebriefScreen />}      />
        <Route path="/scroll"            element={<ScrollScreen />}       />
        <Route path="/practice"          element={<PracticeScreen />}     />
        <Route path="/settings"          element={<SettingsScreen />}     />
        <Route path="/review"            element={<ReviewScreen />}       />
        <Route path="/drill/:category"   element={<DrillScreen />}        />
        <Route path="/brief/:id"         element={<BriefScreen />}        />
        <Route path="/plan"              element={<PlanScreen />}         />
      </Routes>
    </AnimatePresence>
  )
}

// ─── Icon rail nav items ───────────────────────────────────────────────────────

const NAV_ITEMS = [
  { path: '/',         icon: '🏠', label: 'Home'     },
  { path: '/plan',     icon: '📅', label: 'Plan'     },
  { path: '/practice', icon: '✏️', label: 'Practice' },
  { path: '/review',   icon: '🔄', label: 'Review'   },
  { path: '/scroll',   icon: '📜', label: 'Scroll'   },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
]

// ─── App shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useStore()
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const isOnboarding = location.pathname === '/onboarding'

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const userInitial = state.user?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isOnboarding ? '1fr' : '56px 1fr',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <BootGuard />
      <PlanBoot />
      <AchievementManager />

      {!isOnboarding && (
        <nav
          style={{
            width: '56px',
            height: '100dvh',
            background: 'var(--basalt-mid)',
            borderRight: '1px solid rgba(226,232,240,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '16px',
            paddingBottom: '16px',
            gap: '4px',
            position: 'relative',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          {/* Logo R */}
          <div
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--lapis-bright)',
                letterSpacing: '0.05em',
                userSelect: 'none',
              }}
            >
              R
            </span>
          </div>

          {/* Nav items */}
          {NAV_ITEMS.map((item) => (
            <div
              key={item.path}
              style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={() => setHoveredNav(item.path)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <button
                onClick={() => navigate(item.path)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive(item.path)
                    ? '#1A1A1A'
                    : hoveredNav === item.path
                      ? 'rgba(226,232,240,0.06)'
                      : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'background 150ms ease',
                  outline: 'none',
                }}
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              {hoveredNav === item.path && (
                <div
                  style={{
                    position: 'absolute',
                    left: '44px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1A1A1A',
                    border: '1px solid rgba(226,232,240,0.1)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 200,
                    fontFamily: 'Cinzel, serif',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--moon)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* User avatar */}
          <div
            onClick={() => navigate('/settings')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--lapis-deep)',
              border: '1px solid rgba(91,143,214,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--moon-bright)',
              cursor: 'pointer',
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {userInitial}
          </div>
        </nav>
      )}

      <main
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: '100dvh',
        }}
      >
        <AnimatedRoutes />
      </main>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppErrorBoundary>
      <SettingsProvider>
        <StoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/landing" element={<LandingScreen />} />
              <Route path="/passport/:username" element={<PassportScreen />} />
              <Route path="*" element={<AppShell />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </SettingsProvider>
    </AppErrorBoundary>
  )
}
