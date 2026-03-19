// ─── Rarity & Category ───────────────────────────────────────────────────────

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

export type BadgeCategory =
  | 'first-steps'
  | 'streak'
  | 'scenes'
  | 'vocabulary'
  | 'grammar'
  | 'hidden'

// ─── Session Record ───────────────────────────────────────────────────────────

export interface SessionRecord {
  id: string
  sceneId: string
  personaId: string
  completedAt: number   // Unix timestamp ms
  score: number         // 0–100
  errorsCount: number
}

// ─── Minimal store shape needed for badge evaluation ─────────────────────────

export interface BadgeStoreView {
  user: { onboardingComplete: boolean; startDate: number } | null
  vocabulary: Array<{ id: string; repetitions: number; sceneId: string }>
  errors: Array<{ id: string; type: string; corrected: boolean; sceneDate: number }>
  sessionHistory: SessionRecord[]
  reviewSessionsCompleted: number
  cheatSheet: Array<{ id: string }>
  visitedTabs: Record<string, string[]>
  briefCompleted: Record<string, boolean>
  unlockedBadges: UnlockedBadge[]
}

// ─── Badge Definition ─────────────────────────────────────────────────────────

export interface Badge {
  id: string
  name: string
  description: string
  flavorQuote: string
  icon: string
  category: BadgeCategory
  rarity: BadgeRarity
  hidden: boolean
  condition: (store: BadgeStoreView) => boolean
  progress?: (store: BadgeStoreView) => { current: number; total: number }
}

// ─── Unlocked Badge (persisted) ───────────────────────────────────────────────

export interface UnlockedBadge {
  badgeId: string
  unlockedAt: number  // Unix timestamp ms
  seen: boolean       // whether the toast has been shown
}
