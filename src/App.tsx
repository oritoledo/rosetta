import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider, useStore } from './store/userStore'
import Sidebar from './components/Sidebar'
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
import { generateWeeklyPlan, serializePlan, deserializePlan } from './utils/planGenerator'
import type { StoredPlan } from './types/plan'

// ─── Boot guard: redirect to /onboarding if user not found ───────────────────

function BootGuard() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const raw = localStorage.getItem('rosetta_user')
    if (!raw && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
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
    <AnimatePresence mode="wait">
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

// ─── App shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const location = useLocation()
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isOnboarding ? '1fr' : '240px 1fr',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <BootGuard />
      <PlanBoot />
      {!isOnboarding && <Sidebar />}
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
    <StoreProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  )
}
