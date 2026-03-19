import type { Badge, BadgeStoreView, SessionRecord } from '../types/achievements'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeStreak(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0
  const daySet = new Set<string>()
  for (const s of sessions) {
    const d = new Date(s.completedAt)
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  let cur = daySet.has(todayKey) ? today : new Date(today.getTime() - 86_400_000)
  let streak = 0
  while (true) {
    const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`
    if (!daySet.has(key)) break
    streak++
    cur = new Date(cur.getTime() - 86_400_000)
  }
  return streak
}

function uniqueSceneIds(sessions: SessionRecord[]): Set<string> {
  return new Set(sessions.map((s) => s.sceneId))
}

function uniquePersonaIds(sessions: SessionRecord[]): Set<string> {
  return new Set(sessions.map((s) => s.personaId))
}

function hasComeback(sessions: SessionRecord[]): boolean {
  if (sessions.length < 2) return false
  const sorted = [...sessions].sort((a, b) => a.completedAt - b.completedAt)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].completedAt - sorted[i - 1].completedAt >= 3 * 86_400_000) return true
  }
  return false
}

function masteredWordCount(vocab: BadgeStoreView['vocabulary']): number {
  return vocab.filter((w) => w.repetitions >= 4).length
}

// ─── Badge Definitions (32 total) ────────────────────────────────────────────

export const BADGES: Badge[] = [

  // ── FIRST STEPS (6 × Common) ───────────────────────────────────────────────

  {
    id: 'first_words',
    name: 'First Words',
    description: 'Completed your very first scene',
    flavorQuote: '𓂀 Every inscription begins with a single mark',
    icon: '🗣️',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.sessionHistory.length >= 1,
    progress: (s) => ({ current: Math.min(s.sessionHistory.length, 1), total: 1 }),
  },

  {
    id: 'placed',
    name: 'Placed',
    description: 'Completed the AI placement test',
    flavorQuote: '𓆣 The stone knows where you stand',
    icon: '🎯',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.user?.onboardingComplete === true,
  },

  {
    id: 'first_review',
    name: 'Memory Palace',
    description: 'Completed your first vocabulary review session',
    flavorQuote: '𓃭 Words carved in stone are never forgotten',
    icon: '🏛️',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.reviewSessionsCompleted >= 1,
    progress: (s) => ({ current: Math.min(s.reviewSessionsCompleted, 1), total: 1 }),
  },

  {
    id: 'brief_scholar',
    name: 'The Scholar',
    description: 'Read every tab of a pre-session brief before starting',
    flavorQuote: '𓋹 Prepare before you speak',
    icon: '📜',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => Object.values(s.visitedTabs).some((tabs) => tabs.length >= 4),
  },

  {
    id: 'well_prepared',
    name: 'Well Prepared',
    description: 'Added 5 or more items to your cheat sheet before a scene',
    flavorQuote: '𓊽 The wise carry their knowledge with them',
    icon: '📋',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.cheatSheet.length >= 5,
    progress: (s) => ({ current: Math.min(s.cheatSheet.length, 5), total: 5 }),
  },

  {
    id: 'persona_picker',
    name: 'Shapeshifter',
    description: 'Practiced with 2 different conversation partners',
    flavorQuote: '𓅓 Every voice carries a different truth',
    icon: '🎭',
    category: 'first-steps',
    rarity: 'common',
    hidden: false,
    condition: (s) => uniquePersonaIds(s.sessionHistory).size >= 2,
    progress: (s) => ({ current: Math.min(uniquePersonaIds(s.sessionHistory).size, 2), total: 2 }),
  },

  // ── STREAK (5 badges) ──────────────────────────────────────────────────────

  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Practiced 3 days in a row',
    flavorQuote: '𓆏 Flame sustained becomes forge',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    hidden: false,
    condition: (s) => computeStreak(s.sessionHistory) >= 3,
    progress: (s) => ({ current: Math.min(computeStreak(s.sessionHistory), 3), total: 3 }),
  },

  {
    id: 'streak_7',
    name: 'Charged',
    description: 'Practiced 7 days in a row',
    flavorQuote: '𓂋 Seven suns — the cycle complete',
    icon: '⚡',
    category: 'streak',
    rarity: 'epic',
    hidden: false,
    condition: (s) => computeStreak(s.sessionHistory) >= 7,
    progress: (s) => ({ current: Math.min(computeStreak(s.sessionHistory), 7), total: 7 }),
  },

  {
    id: 'streak_14',
    name: 'Moonlit',
    description: 'Practiced 14 days in a row',
    flavorQuote: '𓇯 The moon has witnessed your devotion',
    icon: '🌙',
    category: 'streak',
    rarity: 'epic',
    hidden: false,
    condition: (s) => computeStreak(s.sessionHistory) >= 14,
    progress: (s) => ({ current: Math.min(computeStreak(s.sessionHistory), 14), total: 14 }),
  },

  {
    id: 'streak_30',
    name: 'The Devoted',
    description: 'Practiced 30 days in a row',
    flavorQuote: '𓆙 A month of mornings — language made flesh',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    hidden: false,
    condition: (s) => computeStreak(s.sessionHistory) >= 30,
    progress: (s) => ({ current: Math.min(computeStreak(s.sessionHistory), 30), total: 30 }),
  },

  {
    id: 'comeback',
    name: 'The Return',
    description: 'Came back after a 3-day absence',
    flavorQuote: '𓀀 The wanderer who returns is wiser than the one who never left',
    icon: '🦅',
    category: 'streak',
    rarity: 'rare',
    hidden: true,
    condition: (s) => hasComeback(s.sessionHistory),
  },

  // ── SCENES (6 badges) ─────────────────────────────────────────────────────

  {
    id: 'cafe_debut',
    name: 'Café Initiate',
    description: 'Completed the café ordering scene',
    flavorQuote: '𓆑 Un caffè, per favore — the simplest sacred act',
    icon: '☕',
    category: 'scenes',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.sessionHistory.some((sess) => sess.sceneId === 'cafe'),
  },

  {
    id: 'house_call',
    name: 'At Ease',
    description: 'Navigated a doctor visit in Italian',
    flavorQuote: '𓃀 The body speaks its own language — you translated both',
    icon: '🏥',
    category: 'scenes',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.sessionHistory.some((sess) => sess.sceneId === 'doctor'),
  },

  {
    id: 'all_aboard',
    name: 'Ticket in Hand',
    description: 'Completed the train station scene',
    flavorQuote: '𓂧 The rails carry you where the tongue permits',
    icon: '🚆',
    category: 'scenes',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.sessionHistory.some((sess) => sess.sceneId === 'train'),
  },

  {
    id: 'market_day',
    name: 'Market-Ready',
    description: 'Held your own in the market',
    flavorQuote: '𓊵 To haggle is to speak the oldest language',
    icon: '🛒',
    category: 'scenes',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.sessionHistory.some((sess) => sess.sceneId === 'market'),
  },

  {
    id: 'scene_collector',
    name: 'The Wanderer',
    description: 'Completed all four available scenes',
    flavorQuote: '𓇳 Four corners of the city — all yours now',
    icon: '🗺️',
    category: 'scenes',
    rarity: 'epic',
    hidden: false,
    condition: (s) => uniqueSceneIds(s.sessionHistory).size >= 4,
    progress: (s) => ({ current: Math.min(uniqueSceneIds(s.sessionHistory).size, 4), total: 4 }),
  },

  {
    id: 'frequent_flyer',
    name: 'A Regular',
    description: 'Completed 10 conversation sessions',
    flavorQuote: '𓆎 The stone is worn smooth by returning feet',
    icon: '✈️',
    category: 'scenes',
    rarity: 'rare',
    hidden: false,
    condition: (s) => s.sessionHistory.length >= 10,
    progress: (s) => ({ current: Math.min(s.sessionHistory.length, 10), total: 10 }),
  },

  // ── VOCABULARY (5 badges) ─────────────────────────────────────────────────

  {
    id: 'wordsmith',
    name: 'The Wordsmith',
    description: 'Added 25 words to your vocabulary',
    flavorQuote: '𓐍 Twenty-five stones placed — the wall begins to rise',
    icon: '📖',
    category: 'vocabulary',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.vocabulary.length >= 25,
    progress: (s) => ({ current: Math.min(s.vocabulary.length, 25), total: 25 }),
  },

  {
    id: 'lexicon',
    name: 'Living Lexicon',
    description: 'Collected 50 vocabulary words',
    flavorQuote: '𓏛 Fifty words — enough to live, to dream, to be understood',
    icon: '📚',
    category: 'vocabulary',
    rarity: 'rare',
    hidden: false,
    condition: (s) => s.vocabulary.length >= 50,
    progress: (s) => ({ current: Math.min(s.vocabulary.length, 50), total: 50 }),
  },

  {
    id: 'review_devotee',
    name: 'Devoted Reviewer',
    description: 'Completed 5 vocabulary review sessions',
    flavorQuote: '𓃑 Repetition is the chisel; memory is the stone',
    icon: '🔁',
    category: 'vocabulary',
    rarity: 'rare',
    hidden: false,
    condition: (s) => s.reviewSessionsCompleted >= 5,
    progress: (s) => ({ current: Math.min(s.reviewSessionsCompleted, 5), total: 5 }),
  },

  {
    id: 'memory_athlete',
    name: 'Memory Athlete',
    description: 'Completed 15 vocabulary review sessions',
    flavorQuote: '𓅱 The mind is a palace — you have furnished fifteen rooms',
    icon: '🧠',
    category: 'vocabulary',
    rarity: 'epic',
    hidden: false,
    condition: (s) => s.reviewSessionsCompleted >= 15,
    progress: (s) => ({ current: Math.min(s.reviewSessionsCompleted, 15), total: 15 }),
  },

  {
    id: 'vocab_master',
    name: 'Master of Words',
    description: 'Fully mastered 10 vocabulary words',
    flavorQuote: '𓋴 Mastery is not held — it is inhabited',
    icon: '💎',
    category: 'vocabulary',
    rarity: 'rare',
    hidden: false,
    condition: (s) => masteredWordCount(s.vocabulary) >= 10,
    progress: (s) => ({ current: Math.min(masteredWordCount(s.vocabulary), 10), total: 10 }),
  },

  // ── GRAMMAR (5 badges) ────────────────────────────────────────────────────

  {
    id: 'error_hunter',
    name: 'Error Hunter',
    description: 'Actively corrected 5 grammar mistakes',
    flavorQuote: '𓂸 The eye that finds the flaw perfects the craft',
    icon: '🔍',
    category: 'grammar',
    rarity: 'common',
    hidden: false,
    condition: (s) => s.errors.filter((e) => e.corrected).length >= 5,
    progress: (s) => ({
      current: Math.min(s.errors.filter((e) => e.corrected).length, 5),
      total: 5,
    }),
  },

  {
    id: 'grammar_guardian',
    name: 'Grammar Guardian',
    description: 'Corrected 10 grammar errors',
    flavorQuote: '𓅆 Ten wrongs made right — the language thanks you',
    icon: '🛡️',
    category: 'grammar',
    rarity: 'rare',
    hidden: false,
    condition: (s) => s.errors.filter((e) => e.corrected).length >= 10,
    progress: (s) => ({
      current: Math.min(s.errors.filter((e) => e.corrected).length, 10),
      total: 10,
    }),
  },

  {
    id: 'clean_sweep',
    name: 'Clean Sweep',
    description: 'Completed a conversation scene with zero errors',
    flavorQuote: '𓅨 Silence can be perfect — and so can speech',
    icon: '✨',
    category: 'grammar',
    rarity: 'rare',
    hidden: false,
    condition: (s) => s.sessionHistory.some((sess) => sess.errorsCount === 0),
  },

  {
    id: 'perfectionist',
    name: 'The Perfectionist',
    description: 'Scored 80% or higher in 3 different sessions',
    flavorQuote: '𓆀 Excellence is not accidental — it is practised',
    icon: '⭐',
    category: 'grammar',
    rarity: 'epic',
    hidden: false,
    condition: (s) => s.sessionHistory.filter((sess) => sess.score >= 80).length >= 3,
    progress: (s) => ({
      current: Math.min(s.sessionHistory.filter((sess) => sess.score >= 80).length, 3),
      total: 3,
    }),
  },

  {
    id: 'pattern_breaker',
    name: 'Pattern Breaker',
    description: 'Reduced all grammar error categories below the recurring threshold',
    flavorQuote: '𓅂 The chain is only broken by the one who names it',
    icon: '🏆',
    category: 'grammar',
    rarity: 'epic',
    hidden: false,
    condition: (s) => {
      if (s.errors.length < 3) return false
      const uncorrected = s.errors.filter((e) => !e.corrected)
      const cats: Record<string, number> = {}
      for (const e of uncorrected) cats[e.type] = (cats[e.type] ?? 0) + 1
      return Object.values(cats).every((count) => count < 2)
    },
  },

  // ── HIDDEN (5 badges) ─────────────────────────────────────────────────────

  {
    id: 'midnight_scholar',
    name: 'Midnight Scholar',
    description: 'Completed a session between 10 PM and 4 AM',
    flavorQuote: '𓇋 When the city sleeps, the stone speaks',
    icon: '🌙',
    category: 'hidden',
    rarity: 'rare',
    hidden: true,
    condition: (s) =>
      s.sessionHistory.some((sess) => {
        const h = new Date(sess.completedAt).getHours()
        return h >= 22 || h < 4
      }),
  },

  {
    id: 'the_stone_endures',
    name: 'The Stone Endures',
    description: 'Studied Italian for over 30 days',
    flavorQuote: '𓊪 Some monuments are measured in years — yours begins now',
    icon: '🗿',
    category: 'hidden',
    rarity: 'legendary',
    hidden: true,
    condition: (s) =>
      s.user !== null &&
      Date.now() - s.user.startDate >= 30 * 86_400_000,
  },

  {
    id: 'polyglot_soul',
    name: 'Polyglot Soul',
    description: 'Completed 25 conversation sessions',
    flavorQuote: '𓆄 Twenty-five lives lived through language',
    icon: '🌍',
    category: 'hidden',
    rarity: 'legendary',
    hidden: true,
    condition: (s) => s.sessionHistory.length >= 25,
    progress: (s) => ({ current: Math.min(s.sessionHistory.length, 25), total: 25 }),
  },

  {
    id: 'trilinguist',
    name: 'Trilinguist',
    description: 'Completed all four scenes using four different partners',
    flavorQuote: '𓁐 Four faces — one soul, fully translated',
    icon: '🔮',
    category: 'hidden',
    rarity: 'epic',
    hidden: true,
    condition: (s) =>
      uniqueSceneIds(s.sessionHistory).size >= 4 &&
      uniquePersonaIds(s.sessionHistory).size >= 4,
  },

  {
    id: 'rosetta_stone',
    name: 'Rosetta Stone',
    description: 'Unlocked 20 or more badges',
    flavorQuote: '𓂀 The inscription complete — you have become the text',
    icon: '🔱',
    category: 'hidden',
    rarity: 'legendary',
    hidden: true,
    condition: (s) => s.unlockedBadges.length >= 20,
    progress: (s) => ({ current: Math.min(s.unlockedBadges.length, 20), total: 20 }),
  },
]

// ─── Lookup map ───────────────────────────────────────────────────────────────

export const BADGE_MAP: Record<string, Badge> = Object.fromEntries(
  BADGES.map((b) => [b.id, b]),
)

// ─── Rarity config ────────────────────────────────────────────────────────────

export const RARITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  common: {
    label: 'Common',
    color: '#9ba8b5',
    bg: 'rgba(155,168,181,0.1)',
    border: 'rgba(155,168,181,0.25)',
    glow: 'rgba(155,168,181,0.15)',
  },
  rare: {
    label: 'Rare',
    color: '#5b8fd6',
    bg: 'rgba(91,143,214,0.12)',
    border: 'rgba(91,143,214,0.3)',
    glow: 'rgba(91,143,214,0.2)',
  },
  epic: {
    label: 'Epic',
    color: '#9b72d4',
    bg: 'rgba(155,114,212,0.12)',
    border: 'rgba(155,114,212,0.35)',
    glow: 'rgba(155,114,212,0.25)',
  },
  legendary: {
    label: 'Legendary',
    color: '#c9a84c',
    bg: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.35)',
    glow: 'rgba(201,168,76,0.3)',
  },
}

// ─── Category display config ─────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = {
  'first-steps': { label: 'First Steps', icon: '🌱' },
  streak:        { label: 'Streak',       icon: '🔥' },
  scenes:        { label: 'Scenes',       icon: '🎬' },
  vocabulary:    { label: 'Vocabulary',   icon: '📚' },
  grammar:       { label: 'Grammar',      icon: '🛡️' },
  hidden:        { label: 'Hidden',       icon: '🔮' },
}
