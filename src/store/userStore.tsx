import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'
import { VocabWord, seedVocabulary } from '../data/vocabulary'
import { GrammarError } from '../data/errors'
import { mockErrors } from '../data/mockErrors'
import { getDueWords } from '../hooks/useSM2'
import type { WeeklyPlan } from '../types/plan'
import type { SessionRecord, UnlockedBadge } from '../types/achievements'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string
  language: string
  level: string
  onboardingComplete: boolean
  startDate: number
}

export type CheatSheetItemType = 'vocab' | 'grammar' | 'pronunciation'

export interface CheatSheetItem {
  id: string
  type: CheatSheetItemType
  word: string
  translation: string
  sceneId: string
}

export interface AppState {
  user: UserProfile | null
  vocabulary: VocabWord[]
  errors: GrammarError[]
  reviewQueue: VocabWord[]          // computed: words due now
  cheatSheet: CheatSheetItem[]
  visitedTabs: Record<string, string[]>       // sceneId → tab ids visited
  briefCompleted: Record<string, boolean>     // sceneId → completed
  selectedPersona: string                     // persona id, default 'sofia'
  weeklyPlan: WeeklyPlan | null
  planGeneratedAt: number | null
  planRegenerating: boolean
  planSeed: number
  // ── Achievement system ────────────────────────────────────────────────────
  sessionHistory: SessionRecord[]
  reviewSessionsCompleted: number
  unlockedBadges: UnlockedBadge[]
  hydrated: boolean                           // true after localStorage hydration
}

type Action =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'ADD_VOCAB_WORD'; payload: VocabWord }
  | { type: 'UPDATE_VOCAB_WORD'; payload: VocabWord }
  | { type: 'ADD_ERROR'; payload: GrammarError }
  | { type: 'MARK_CORRECTED'; payload: string }
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'ADD_TO_CHEAT_SHEET'; payload: CheatSheetItem }
  | { type: 'REMOVE_FROM_CHEAT_SHEET'; payload: string }   // item id
  | { type: 'MARK_TAB_VISITED'; payload: { sceneId: string; tabId: string } }
  | { type: 'COMPLETE_BRIEF'; payload: string }             // sceneId
  | { type: 'SET_PERSONA'; payload: string }                // persona id
  | { type: 'SET_WEEKLY_PLAN'; payload: { plan: WeeklyPlan; seed: number } }
  | { type: 'SET_PLAN_REGENERATING'; payload: boolean }
  | { type: 'MARK_DAY_COMPLETED'; payload: string }         // date ISO string
  // ── Achievement actions ───────────────────────────────────────────────────
  | { type: 'COMPLETE_SESSION'; payload: SessionRecord }
  | { type: 'INCREMENT_REVIEW_SESSIONS' }
  | { type: 'UNLOCK_BADGE'; payload: UnlockedBadge }
  | { type: 'MARK_BADGE_SEEN'; payload: string }            // badgeId

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeReviewQueue(vocab: VocabWord[]): VocabWord[] {
  return getDueWords(vocab)
}

// Pre-seeded sessions to match the existing mock UI state
const DAY = 86_400_000
const _now = Date.now()
const seedSessions: SessionRecord[] = [
  { id: 'seed_1', sceneId: 'cafe',   personaId: 'sofia',  completedAt: _now - 2 * DAY, score: 74, errorsCount: 3 },
  { id: 'seed_2', sceneId: 'market', personaId: 'yusuf',  completedAt: _now - 3 * DAY, score: 81, errorsCount: 2 },
  { id: 'seed_3', sceneId: 'train',  personaId: 'marco',  completedAt: _now - 4 * DAY, score: 66, errorsCount: 5 },
  { id: 'seed_4', sceneId: 'doctor', personaId: 'elena',  completedAt: _now - 5 * DAY, score: 88, errorsCount: 1 },
]

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE': {
      const vocab = action.payload.vocabulary ?? state.vocabulary
      return {
        ...state,
        ...action.payload,
        vocabulary: vocab,
        reviewQueue: computeReviewQueue(vocab),
        hydrated: true,
      }
    }

    case 'SET_USER':
      return { ...state, user: action.payload }

    case 'ADD_VOCAB_WORD': {
      const vocab = [...state.vocabulary, action.payload]
      return { ...state, vocabulary: vocab, reviewQueue: computeReviewQueue(vocab) }
    }

    case 'UPDATE_VOCAB_WORD': {
      const vocab = state.vocabulary.map((w) =>
        w.id === action.payload.id ? action.payload : w,
      )
      return { ...state, vocabulary: vocab, reviewQueue: computeReviewQueue(vocab) }
    }

    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] }

    case 'MARK_CORRECTED':
      return {
        ...state,
        errors: state.errors.map((e) =>
          e.id === action.payload ? { ...e, corrected: true } : e,
        ),
      }

    case 'ADD_TO_CHEAT_SHEET': {
      const alreadyIn = state.cheatSheet.some((i) => i.id === action.payload.id)
      if (alreadyIn) return state
      return { ...state, cheatSheet: [...state.cheatSheet, action.payload] }
    }

    case 'REMOVE_FROM_CHEAT_SHEET':
      return {
        ...state,
        cheatSheet: state.cheatSheet.filter((i) => i.id !== action.payload),
      }

    case 'MARK_TAB_VISITED': {
      const { sceneId, tabId } = action.payload
      const existing = state.visitedTabs[sceneId] ?? []
      if (existing.includes(tabId)) return state
      return {
        ...state,
        visitedTabs: {
          ...state.visitedTabs,
          [sceneId]: [...existing, tabId],
        },
      }
    }

    case 'COMPLETE_BRIEF':
      return {
        ...state,
        briefCompleted: { ...state.briefCompleted, [action.payload]: true },
      }

    case 'SET_PERSONA':
      return { ...state, selectedPersona: action.payload }

    case 'SET_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlan: action.payload.plan,
        planGeneratedAt: Date.now(),
        planSeed: action.payload.seed,
        planRegenerating: false,
      }

    case 'SET_PLAN_REGENERATING':
      return { ...state, planRegenerating: action.payload }

    case 'MARK_DAY_COMPLETED': {
      if (!state.weeklyPlan) return state
      const targetDate = action.payload
      const updatedDays = state.weeklyPlan.days.map((day) => {
        const dayDate = day.date instanceof Date ? day.date : new Date(day.date)
        const dayIso = dayDate.toISOString().slice(0, 10)
        return dayIso === targetDate ? { ...day, isCompleted: true } : day
      })
      return {
        ...state,
        weeklyPlan: { ...state.weeklyPlan, days: updatedDays },
      }
    }

    case 'COMPLETE_SESSION':
      return {
        ...state,
        sessionHistory: [...state.sessionHistory, action.payload],
      }

    case 'INCREMENT_REVIEW_SESSIONS':
      return { ...state, reviewSessionsCompleted: state.reviewSessionsCompleted + 1 }

    case 'UNLOCK_BADGE': {
      const alreadyUnlocked = state.unlockedBadges.some(
        (u) => u.badgeId === action.payload.badgeId,
      )
      if (alreadyUnlocked) return state
      return {
        ...state,
        unlockedBadges: [...state.unlockedBadges, action.payload],
      }
    }

    case 'MARK_BADGE_SEEN':
      return {
        ...state,
        unlockedBadges: state.unlockedBadges.map((u) =>
          u.badgeId === action.payload ? { ...u, seen: true } : u,
        ),
      }

    default:
      return state
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: AppState = {
  user: null,
  vocabulary: seedVocabulary,
  errors: mockErrors,
  reviewQueue: computeReviewQueue(seedVocabulary),
  cheatSheet: [],
  visitedTabs: {},
  briefCompleted: {},
  selectedPersona: 'sofia',
  weeklyPlan: null,
  planGeneratedAt: null,
  planRegenerating: false,
  planSeed: Date.now(),
  sessionHistory: seedSessions,
  reviewSessionsCompleted: 0,
  unlockedBadges: [],
  hydrated: false,
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const rawUser              = localStorage.getItem('rosetta_user')
    const rawVocab             = localStorage.getItem('rosetta_vocab')
    const rawErrors            = localStorage.getItem('rosetta_errors')
    const rawCheatSheet        = localStorage.getItem('rosetta_cheatsheet')
    const rawVisited           = localStorage.getItem('rosetta_visited_tabs')
    const rawBriefs            = localStorage.getItem('rosetta_brief_completed')
    const rawPersona           = localStorage.getItem('rosetta_persona')
    const rawPlanSeed          = localStorage.getItem('rosetta_plan_seed')
    const rawSessions          = localStorage.getItem('rosetta_sessions')
    const rawReviewCount       = localStorage.getItem('rosetta_review_count')
    const rawUnlockedBadges    = localStorage.getItem('rosetta_badges')

    const partial: Partial<AppState> = {}

    if (rawUser)           { try { partial.user = JSON.parse(rawUser) }                      catch { /* ignore */ } }
    if (rawVocab)          { try { partial.vocabulary = JSON.parse(rawVocab) }               catch { /* ignore */ } }
    if (rawErrors)         { try { partial.errors = JSON.parse(rawErrors) }                  catch { /* ignore */ } }
    if (rawCheatSheet)     { try { partial.cheatSheet = JSON.parse(rawCheatSheet) }          catch { /* ignore */ } }
    if (rawVisited)        { try { partial.visitedTabs = JSON.parse(rawVisited) }            catch { /* ignore */ } }
    if (rawBriefs)         { try { partial.briefCompleted = JSON.parse(rawBriefs) }          catch { /* ignore */ } }
    if (rawPersona)        { try { partial.selectedPersona = JSON.parse(rawPersona) }        catch { /* ignore */ } }
    if (rawPlanSeed)       { try { partial.planSeed = JSON.parse(rawPlanSeed) }              catch { /* ignore */ } }
    if (rawSessions)       { try { partial.sessionHistory = JSON.parse(rawSessions) }        catch { /* ignore */ } }
    if (rawReviewCount)    { try { partial.reviewSessionsCompleted = JSON.parse(rawReviewCount) } catch { /* ignore */ } }
    if (rawUnlockedBadges) { try { partial.unlockedBadges = JSON.parse(rawUnlockedBadges) }  catch { /* ignore */ } }

    // Always dispatch HYDRATE (sets hydrated: true) — even with empty partial
    dispatch({ type: 'HYDRATE', payload: partial })
  }, [])

  // Persist on every relevant change
  useEffect(() => {
    if (state.user) localStorage.setItem('rosetta_user', JSON.stringify(state.user))
    localStorage.setItem('rosetta_vocab',           JSON.stringify(state.vocabulary))
    localStorage.setItem('rosetta_errors',          JSON.stringify(state.errors))
    localStorage.setItem('rosetta_cheatsheet',      JSON.stringify(state.cheatSheet))
    localStorage.setItem('rosetta_visited_tabs',    JSON.stringify(state.visitedTabs))
    localStorage.setItem('rosetta_brief_completed', JSON.stringify(state.briefCompleted))
    localStorage.setItem('rosetta_persona',         JSON.stringify(state.selectedPersona))
    localStorage.setItem('rosetta_plan_seed',       JSON.stringify(state.planSeed))
    localStorage.setItem('rosetta_sessions',        JSON.stringify(state.sessionHistory))
    localStorage.setItem('rosetta_review_count',    JSON.stringify(state.reviewSessionsCompleted))
    localStorage.setItem('rosetta_badges',          JSON.stringify(state.unlockedBadges))
  }, [
    state.user,
    state.vocabulary,
    state.errors,
    state.cheatSheet,
    state.visitedTabs,
    state.briefCompleted,
    state.selectedPersona,
    state.planSeed,
    state.sessionHistory,
    state.reviewSessionsCompleted,
    state.unlockedBadges,
  ])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
