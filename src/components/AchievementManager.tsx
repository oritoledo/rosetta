import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store/userStore'
import { BADGES } from '../data/achievements'
import type { Badge, BadgeStoreView } from '../types/achievements'
import BadgeToast from './BadgeToast'

export default function AchievementManager() {
  const { state, dispatch } = useStore()
  const processedRef = useRef(new Set<string>())
  const isInitRef = useRef(true)
  const [toastQueue, setToastQueue] = useState<Badge[]>([])
  const [currentToast, setCurrentToast] = useState<Badge | null>(null)

  // Wait for hydration before checking badges
  const storeView = state as unknown as BadgeStoreView

  useEffect(() => {
    if (!state.hydrated) return

    const newlyEarned = BADGES.filter((badge) => {
      const conditionMet = badge.condition(storeView)
      const alreadyUnlocked = state.unlockedBadges.some((u) => u.badgeId === badge.id)
      const alreadyQueued = processedRef.current.has(badge.id)
      return conditionMet && !alreadyUnlocked && !alreadyQueued
    })

    if (newlyEarned.length === 0) {
      isInitRef.current = false
      return
    }

    const silent = isInitRef.current
    isInitRef.current = false

    for (const badge of newlyEarned) {
      processedRef.current.add(badge.id)
      dispatch({
        type: 'UNLOCK_BADGE',
        payload: { badgeId: badge.id, unlockedAt: Date.now(), seen: silent },
      })
    }

    if (!silent) {
      setToastQueue((prev) => [...prev, ...newlyEarned])
    }
  }, [
    state.hydrated,
    state.user,
    state.sessionHistory.length,
    state.reviewSessionsCompleted,
    state.vocabulary.length,
    state.errors.length,
    state.cheatSheet.length,
    state.visitedTabs,
    state.briefCompleted,
    state.unlockedBadges.length,
  ])

  // Show pending toasts for unseen badges on load (e.g. after a crash)
  useEffect(() => {
    if (!state.hydrated) return
    const unseenIds = state.unlockedBadges
      .filter((u) => !u.seen)
      .map((u) => u.badgeId)
    if (unseenIds.length === 0) return

    const unseenBadges = BADGES.filter((b) => unseenIds.includes(b.id))
    for (const b of unseenBadges) processedRef.current.add(b.id)
    setToastQueue((prev) => {
      const existingIds = new Set(prev.map((b) => b.id))
      return [...prev, ...unseenBadges.filter((b) => !existingIds.has(b.id))]
    })
  }, [state.hydrated]) // only run once after hydration

  // Dequeue toasts sequentially
  useEffect(() => {
    if (currentToast || toastQueue.length === 0) return
    const [next, ...rest] = toastQueue
    setCurrentToast(next)
    setToastQueue(rest)
  }, [toastQueue, currentToast])

  const handleDismiss = useCallback(() => {
    if (currentToast) {
      dispatch({ type: 'MARK_BADGE_SEEN', payload: currentToast.id })
    }
    setCurrentToast(null)
  }, [currentToast, dispatch])

  return <BadgeToast badge={currentToast} onDismiss={handleDismiss} />
}
