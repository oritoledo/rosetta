import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider } from './store/userStore'
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
