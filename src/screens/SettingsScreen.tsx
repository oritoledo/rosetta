import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import SettingsNav from '../components/settings/SettingsNav'
import ProfilePanel from '../components/settings/ProfilePanel'
import LearningPanel from '../components/settings/LearningPanel'
import LanguagePanel from '../components/settings/LanguagePanel'
import AppearancePanel from '../components/settings/AppearancePanel'
import HarnessPanel from '../components/settings/HarnessPanel'
import DangerPanel from '../components/settings/DangerPanel'

const SECTIONS = ['profile', 'learning', 'language', 'appearance', 'harness', 'danger']

export default function SettingsScreen() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState('profile')

  // IntersectionObserver to track active section while scrolling
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting (topmost visible)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root,
        threshold: 0.2,
        rootMargin: '-60px 0px -40% 0px',
      },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        overflow: 'hidden',
        background: 'var(--basalt)',
      }}
    >
      {/* Left nav */}
      <SettingsNav activeSection={activeSection} onSelect={scrollToSection} />

      {/* Right scrollable content */}
      <div
        ref={scrollRef}
        style={{
          overflowY: 'auto',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        <ProfilePanel    id="profile" />
        <LearningPanel   id="learning" />
        <LanguagePanel   id="language" />
        <AppearancePanel id="appearance" />
        <HarnessPanel    id="harness" />
        <DangerPanel     id="danger" />

        {/* Bottom padding so last section scrolls into view fully */}
        <div style={{ height: 120 }} />
      </div>
    </motion.div>
  )
}
