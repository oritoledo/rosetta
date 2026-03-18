import { scenes, sceneList } from '../data/scenes'
import { PERSONAS, getPersonaById } from '../data/personas'
import type { Persona } from '../data/personas'
import type { Scene } from '../data/scenes'
import type { VocabWord } from '../data/vocabulary'
import type { ErrorCategory, GrammarError } from '../data/errors'
import type { AppState } from '../store/userStore'
import type {
  DayPlan,
  GrammarFocus,
  PlanReason,
  WeeklyPlan,
  WeekSummary,
  StoredDayPlan,
  StoredPlan,
} from '../types/plan'

// ─── Seeded LCG RNG ───────────────────────────────────────────────────────────

function lcgNext(seed: number): number {
  // LCG: (seed * 1664525 + 1013904223) mod 2^32
  return ((seed * 1664525 + 1013904223) >>> 0)
}

function makeLcg(initialSeed: number) {
  let s = initialSeed >>> 0
  return function rand(): number {
    s = lcgNext(s)
    return s / 4294967296
  }
}

// ─── Grammar metadata ─────────────────────────────────────────────────────────

const GRAMMAR_TITLES: Record<ErrorCategory, string> = {
  'verb-tense':       'Verb Tense — Condizionale vs Passato',
  'gender-agreement': 'Gender Agreement — Articles & Adjectives',
  'word-choice':      'Word Choice — Register & Formality',
  'word-order':       'Word Order — Italian Sentence Structure',
  'pronunciation':    'Pronunciation — Stress Patterns',
  'formality':        'Formality — Lei vs Tu',
  'idiom':            'Idioms & Natural Expressions',
}

const GRAMMAR_DESCRIPTIONS: Record<ErrorCategory, string> = {
  'verb-tense':
    'Practice using condizionale for polite requests and imperfetto for ongoing past states.',
  'gender-agreement':
    'Match articles and adjectives to noun gender — both singular and plural forms.',
  'word-choice':
    'Select the right register and idiomatic word choices rather than direct translations.',
  'word-order':
    'Build natural Italian sentence structure without English word-order interference.',
  'pronunciation':
    'Drill Italian stress patterns: penultimate syllable default, final accent exceptions.',
  'formality':
    'Distinguish Lei (formal) from tu (informal) and maintain register consistently.',
  'idiom':
    'Replace literal translations with natural Italian idiomatic expressions.',
}

// Which grammar categories each scene naturally exercises
const SCENE_GRAMMAR_MAP: Record<string, ErrorCategory[]> = {
  cafe:    ['verb-tense', 'formality', 'gender-agreement'],
  doctor:  ['formality', 'verb-tense', 'word-choice'],
  train:   ['word-order', 'formality', 'verb-tense'],
  market:  ['gender-agreement', 'word-choice', 'idiom'],
}

// Friendly category labels for reason text
const CATEGORY_LABEL: Record<ErrorCategory, string> = {
  'verb-tense':       'verb tense',
  'gender-agreement': 'gender agreement',
  'word-choice':      'word choice',
  'word-order':       'word order',
  'pronunciation':    'pronunciation',
  'formality':        'formality',
  'idiom':            'idiom usage',
}

// ─── Error pattern helpers ────────────────────────────────────────────────────

function countErrors(errors: GrammarError[]): Map<ErrorCategory, number> {
  const m = new Map<ErrorCategory, number>()
  for (const e of errors) {
    m.set(e.type, (m.get(e.type) ?? 0) + 1)
  }
  return m
}

function sortedErrorCategories(errors: GrammarError[]): ErrorCategory[] {
  const counts = countErrors(errors)
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)
}

// ─── Grammar focus schedule ───────────────────────────────────────────────────

// Day schedule: which category index to pull (0 = top error, 1 = 2nd, …)
// Mirrors spaced repetition: top repeats on day 3
const DAY_CATEGORY_SLOT = [0, 1, 2, 0, 3, 1] // index into sortedCategories
const DAY_PRIORITY: Array<'critical' | 'important' | 'maintenance'> = [
  'critical', 'important', 'important', 'critical', 'important', 'maintenance',
]

function buildGrammarFocus(
  dayIndex: number,
  sortedCats: ErrorCategory[],
): GrammarFocus {
  const defaults: ErrorCategory[] = [
    'verb-tense', 'gender-agreement', 'word-choice', 'word-order',
  ]
  const cats = sortedCats.length > 0 ? sortedCats : defaults
  const slot = DAY_CATEGORY_SLOT[dayIndex] ?? 0
  const cat = cats[slot % cats.length]
  return {
    category: cat,
    title: GRAMMAR_TITLES[cat],
    description: GRAMMAR_DESCRIPTIONS[cat],
    priority: DAY_PRIORITY[dayIndex] ?? 'maintenance',
  }
}

// ─── Scene scoring ────────────────────────────────────────────────────────────

interface ScoredScene {
  scene: Scene
  score: number
}

function scoreScenes(state: AppState, rand: () => number): ScoredScene[] {
  const now = Date.now()
  const sortedCats = sortedErrorCategories(state.errors)
  const topCat = sortedCats[0]

  return sceneList.map((scene) => {
    let score = 50

    // +20 if scene has overdue vocab
    const overdueForScene = state.vocabulary.filter(
      (w) => w.sceneId === scene.id && w.nextReview <= now,
    )
    if (overdueForScene.length > 0) score += 20

    // +15 if scene's grammar structures match top error category
    const sceneGrammars = SCENE_GRAMMAR_MAP[scene.id] ?? []
    if (topCat && sceneGrammars.includes(topCat)) score += 15

    // +10 if partially completed (scene.progress defined, 0 < progress < 100)
    if (scene.progress !== undefined && scene.progress > 0 && scene.progress < 100) {
      score += 10
    }

    // +8 if scene has never been visited (no visitedTabs entry)
    const visited = (state.visitedTabs[scene.id]?.length ?? 0) > 0
    if (!visited) score += 8

    // -10 if scene was played in the last 2 days (errors with recent sceneDate)
    const recentlyPlayed = state.errors.some(
      (e) => e.sceneId === scene.id && e.sceneDate > now - 2 * 86_400_000,
    )
    if (recentlyPlayed) score -= 10

    // Randomness: ±4 points for regeneration variety
    score += rand() * 8 - 4

    return { scene, score }
  })
}

// ─── Vocab distribution ───────────────────────────────────────────────────────

function distributeVocab(
  vocab: VocabWord[],
  activeDayIndices: number[],
  today: Date,
): Map<number, VocabWord[]> {
  const result = new Map<number, VocabWord[]>(activeDayIndices.map((i) => [i, []]))

  // Overdue words (oldest first)
  const overdue = vocab
    .filter((w) => w.nextReview < today.getTime())
    .sort((a, b) => a.nextReview - b.nextReview)

  // Upcoming words due within 7 days (soonest first)
  const upcoming = vocab
    .filter(
      (w) => w.nextReview >= today.getTime() &&
             w.nextReview < today.getTime() + 7 * 86_400_000,
    )
    .sort((a, b) => a.nextReview - b.nextReview)

  // First pass: distribute overdue words across days, max 8 each
  let idx = 0
  for (const dayIdx of activeDayIndices) {
    const slot = result.get(dayIdx)!
    while (slot.length < 8 && idx < overdue.length) {
      slot.push(overdue[idx++])
    }
  }

  // Second pass: fill remaining slots with upcoming words
  idx = 0
  for (const dayIdx of activeDayIndices) {
    const slot = result.get(dayIdx)!
    while (slot.length < 8 && idx < upcoming.length) {
      // Don't double-add
      if (!slot.find((w) => w.id === upcoming[idx].id)) {
        slot.push(upcoming[idx])
      }
      idx++
    }
  }

  return result
}

// ─── Persona assignment ───────────────────────────────────────────────────────

function pickPersona(scene: Scene, dayIndex: number, lastPersonaId: string): Persona {
  // Prefer personas whose bestFor includes this scene, excluding yesterday's persona
  const matching = PERSONAS.filter(
    (p) => p.bestFor.includes(scene.id) && p.id !== lastPersonaId,
  )
  if (matching.length > 0) {
    return matching[dayIndex % matching.length]
  }
  // Fall back: rotate through all personas, avoiding yesterday's
  const available = PERSONAS.filter((p) => p.id !== lastPersonaId)
  return available.length > 0 ? available[dayIndex % available.length] : PERSONAS[dayIndex % PERSONAS.length]
}

// ─── Reasoning builder ────────────────────────────────────────────────────────

function buildReasoning(
  state: AppState,
  scene: Scene,
  persona: Persona,
  grammarFocus: GrammarFocus,
  vocabTargets: VocabWord[],
  dayIndex: number,
  dayLabel: string,
  errorCounts: Map<ErrorCategory, number>,
  streak: number,
): PlanReason[] {
  const reasons: PlanReason[] = []
  const now = Date.now()
  const cat = grammarFocus.category as ErrorCategory

  // 1. Grammar error reason — reference actual count
  const errCount = errorCounts.get(cat) ?? 0
  if (errCount > 0) {
    const last14DaysCount = state.errors.filter(
      (e) => e.type === cat && e.sceneDate > now - 14 * 86_400_000,
    ).length
    const sessionCount = Math.max(errCount + 2, 5)
    reasons.push({
      icon: '🎯',
      text: `You made ${CATEGORY_LABEL[cat]} errors in ${errCount} of your last ${sessionCount} scenes — today targets this directly`,
    })
  }

  // 2. Vocab due reason
  if (vocabTargets.length > 0) {
    const sceneVocab = vocabTargets.filter((w) => w.sceneId === scene.id)
    const sceneVocabCount = sceneVocab.length > 0 ? sceneVocab.length : Math.min(3, vocabTargets.length)
    reasons.push({
      icon: '📚',
      text: `${vocabTargets.length} vocabulary words are overdue for review — this scene uses ${sceneVocabCount} of them`,
    })
  }

  // 3. Streak reason (today only)
  if (dayIndex === 0) {
    reasons.push({
      icon: '🔥',
      text: `Day ${streak} of your streak — ${scene.title} will keep the momentum going`,
    })
  }

  // 4. Scene gap or new-scene reason
  const hasVisited = (state.visitedTabs[scene.id]?.length ?? 0) > 0
  if (!hasVisited) {
    reasons.push({
      icon: '✨',
      text: `${scene.title} is unlocked and untried — a fresh challenge for ${dayLabel.toLowerCase()}`,
    })
  } else {
    const sceneErrors = state.errors.filter((e) => e.sceneId === scene.id)
    if (sceneErrors.length > 0) {
      const mostRecent = Math.max(...sceneErrors.map((e) => e.sceneDate))
      const daysAgo = Math.floor((now - mostRecent) / 86_400_000)
      if (daysAgo >= 7) {
        reasons.push({
          icon: '⏰',
          text: `You haven't tried ${scene.title} in ${daysAgo} days — good time to revisit`,
        })
      }
    }
  }

  // 5. Spaced repetition repeat reason (day 3 echoes day 0)
  if (dayIndex === 3) {
    reasons.push({
      icon: '↩️',
      text: `Repeating ${grammarFocus.title} from Monday — spaced repetition locks it in`,
    })
  }

  // 6. Persona match reason
  if (persona.bestFor.includes(scene.id)) {
    const styleSnippet = persona.style.split('.')[0]
    reasons.push({
      icon: '🎭',
      text: `${persona.name} is your best match for ${scene.title} — ${styleSnippet}`,
    })
  }

  // 7. Light day reason
  if (vocabTargets.length <= 5 && grammarFocus.priority === 'maintenance') {
    reasons.push({
      icon: '😌',
      text: `Lighter session today — ${vocabTargets.length} words, maintenance grammar. Consolidation day.`,
    })
  }

  return reasons.slice(0, 3)
}

// ─── Difficulty & duration ────────────────────────────────────────────────────

function computeDifficulty(
  vocabCount: number,
  priority: 'critical' | 'important' | 'maintenance',
  rand: () => number,
): { difficulty: 'light' | 'moderate' | 'intense'; estimatedMinutes: number } {
  if (vocabCount <= 5 && priority === 'maintenance') {
    return { difficulty: 'light', estimatedMinutes: 15 + Math.floor(rand() * 6) }
  }
  if (vocabCount <= 12 && priority !== 'critical') {
    return { difficulty: 'moderate', estimatedMinutes: 25 + Math.floor(rand() * 11) }
  }
  return { difficulty: 'intense', estimatedMinutes: 40 + Math.floor(rand() * 11) }
}

// ─── Rest day messages ────────────────────────────────────────────────────────

const REST_MESSAGES = [
  'Rest day — your brain consolidates language while you sleep',
  'Active rest — try watching an Italian film or listening to a podcast',
  "Recovery day — review your cheat sheet from this week's scenes",
]

// ─── Week theme ───────────────────────────────────────────────────────────────

function computeWeekTheme(
  sortedCats: ErrorCategory[],
  errorCounts: Map<ErrorCategory, number>,
  totalOverdue: number,
  streak: number,
  totalErrors: number,
): string {
  const topCount = sortedCats.length > 0 ? (errorCounts.get(sortedCats[0]) ?? 0) : 0
  if (topCount > 3) {
    const topCat = sortedCats[0]
    const label =
      topCat === 'verb-tense'       ? 'Verb Tense' :
      topCat === 'gender-agreement' ? 'Gender Agreement' :
      topCat === 'word-choice'      ? 'Word Choice' :
      topCat === 'word-order'       ? 'Word Order' :
      topCat === 'pronunciation'    ? 'Pronunciation' :
      topCat === 'formality'        ? 'Formality' :
      'Idiom'
    return `${label} Repair Week`
  }
  if (totalOverdue > 20) return 'Vocabulary Catch-Up Week'
  if (streak > 10 && totalErrors < 5) return 'Consolidation Week'
  return 'Balanced Progress Week'
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateWeeklyPlan(state: AppState, seed: number = Date.now()): WeeklyPlan {
  const rand = makeLcg(seed)

  // Today at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Error analysis
  const sortedCats = sortedErrorCategories(state.errors)
  const errorCounts = countErrors(state.errors)

  // Streak estimation
  const streak = state.user?.startDate
    ? Math.min(Math.ceil((Date.now() - state.user.startDate) / 86_400_000), 30)
    : 12

  // Rest day: day 6 if streak ≥ 6, day 5 if streak ≥ 3, else none
  const restDayIndex = streak >= 6 ? 6 : streak >= 3 ? 5 : -1

  // Active day indices (non-rest)
  const activeDayIndices = Array.from({ length: 7 }, (_, i) => i).filter(
    (i) => i !== restDayIndex,
  )

  // Score and sort scenes (one randomised set for the whole week)
  const scoredScenes = scoreScenes(state, rand).sort((a, b) => b.score - a.score)

  // Vocab distribution
  const totalOverdue = state.vocabulary.filter((w) => w.nextReview < today.getTime()).length
  const vocabMap = distributeVocab(state.vocabulary, activeDayIndices, today)

  // Build 7 day plans
  const days: DayPlan[] = []
  let lastPersonaId = state.selectedPersona  // seed with current persona

  for (let d = 0; d < 7; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() + d)

    const dayLabel =
      d === 0 ? 'Today' :
      d === 1 ? 'Tomorrow' :
      date.toLocaleDateString('en-US', { weekday: 'long' })

    // ── Rest day ──
    if (d === restDayIndex) {
      days.push({
        date,
        dayLabel,
        vocabTargets: [],
        estimatedMinutes: 0,
        difficulty: 'light',
        reasoning: [],
        isToday: false,
        isCompleted: false,
        isRest: true,
        restMessage: REST_MESSAGES[d % REST_MESSAGES.length],
      })
      continue
    }

    // ── Active day ──
    // Scene: assign top scenes to highest-priority days (today first, then descending)
    // Active day rank: 0→today, 1→tomorrow, …
    const activeRank = activeDayIndices.indexOf(d)
    const scene = scoredScenes[activeRank % scoredScenes.length].scene

    const grammarFocus = buildGrammarFocus(activeRank, sortedCats)
    const vocabTargets = vocabMap.get(d) ?? []
    const persona = pickPersona(scene, d, lastPersonaId)
    lastPersonaId = persona.id

    const { difficulty, estimatedMinutes } = computeDifficulty(
      vocabTargets.length,
      grammarFocus.priority,
      rand,
    )

    const reasoning = buildReasoning(
      state,
      scene,
      persona,
      grammarFocus,
      vocabTargets,
      activeRank,
      dayLabel,
      errorCounts,
      streak,
    )

    days.push({
      date,
      dayLabel,
      scene,
      persona,
      grammarFocus,
      vocabTargets,
      estimatedMinutes,
      difficulty,
      reasoning,
      isToday: d === 0,
      isCompleted: false,
      isRest: false,
    })
  }

  // Week summary
  const activeDays = days.filter((d) => !d.isRest)
  const grammarFocuses = [...new Set(
    activeDays.map((d) => d.grammarFocus?.title).filter((t): t is string => !!t),
  )]

  const weekSummary: WeekSummary = {
    totalMinutes: activeDays.reduce((sum, d) => sum + d.estimatedMinutes, 0),
    scenesPlanned: activeDays.length,
    grammarFocuses,
    vocabTargets: activeDays.reduce((sum, d) => sum + d.vocabTargets.length, 0),
    restDays: days.filter((d) => d.isRest).length,
    weekTheme: computeWeekTheme(
      sortedCats,
      errorCounts,
      totalOverdue,
      streak,
      state.errors.length,
    ),
  }

  return {
    generatedAt: new Date(),
    seed,
    days,
    weekSummary,
  }
}

// ─── Serialization helpers ────────────────────────────────────────────────────

export function serializePlan(plan: WeeklyPlan): StoredPlan {
  return {
    generatedAt: plan.generatedAt.getTime(),
    seed: plan.seed,
    weekSummary: plan.weekSummary,
    days: plan.days.map((d) => ({
      dateTs: d.date.getTime(),
      dayLabel: d.dayLabel,
      sceneId: d.scene?.id,
      personaId: d.persona?.id,
      grammarFocus: d.grammarFocus,
      vocabTargetIds: d.vocabTargets.map((w) => w.id),
      estimatedMinutes: d.estimatedMinutes,
      difficulty: d.difficulty,
      reasoning: d.reasoning,
      isToday: d.isToday,
      isCompleted: d.isCompleted,
      isRest: d.isRest,
      restMessage: d.restMessage,
    })),
  }
}

export function deserializePlan(
  stored: StoredPlan,
  vocab: VocabWord[],
): WeeklyPlan {
  const vocabById = new Map(vocab.map((w) => [w.id, w]))

  const days: DayPlan[] = stored.days.map((d) => ({
    date: new Date(d.dateTs),
    dayLabel: d.dayLabel,
    scene: d.sceneId ? scenes[d.sceneId] : undefined,
    persona: d.personaId ? getPersonaById(d.personaId) : undefined,
    grammarFocus: d.grammarFocus,
    vocabTargets: d.vocabTargetIds.map((id) => vocabById.get(id)).filter((w): w is VocabWord => !!w),
    estimatedMinutes: d.estimatedMinutes,
    difficulty: d.difficulty,
    reasoning: d.reasoning,
    isToday: d.isToday,
    isCompleted: d.isCompleted,
    isRest: d.isRest,
    restMessage: d.restMessage,
  }))

  return {
    generatedAt: new Date(stored.generatedAt),
    seed: stored.seed,
    days,
    weekSummary: stored.weekSummary,
  }
}

// ─── Vocab forecast (words due per day for chart) ────────────────────────────

export function computeVocabForecast(
  vocab: VocabWord[],
  today: Date,
): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(today)
    dayStart.setDate(today.getDate() + i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayStart.getDate() + 1)
    return vocab.filter(
      (w) => w.nextReview >= dayStart.getTime() && w.nextReview < dayEnd.getTime(),
    ).length
  })
}
