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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeReviewQueue(vocab: VocabWord[]): VocabWord[] {
  return getDueWords(vocab)
}

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
      // Avoid duplicates
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
    const rawUser       = localStorage.getItem('rosetta_user')
    const rawVocab      = localStorage.getItem('rosetta_vocab')
    const rawErrors     = localStorage.getItem('rosetta_errors')
    const rawCheatSheet = localStorage.getItem('rosetta_cheatsheet')
    const rawVisited    = localStorage.getItem('rosetta_visited_tabs')
    const rawBriefs     = localStorage.getItem('rosetta_brief_completed')

    const partial: Partial<AppState> = {}

    if (rawUser)       { try { partial.user = JSON.parse(rawUser) }                   catch { /* ignore */ } }
    if (rawVocab)      { try { partial.vocabulary = JSON.parse(rawVocab) }            catch { /* ignore */ } }
    if (rawErrors)     { try { partial.errors = JSON.parse(rawErrors) }               catch { /* ignore */ } }
    if (rawCheatSheet) { try { partial.cheatSheet = JSON.parse(rawCheatSheet) }       catch { /* ignore */ } }
    if (rawVisited)    { try { partial.visitedTabs = JSON.parse(rawVisited) }         catch { /* ignore */ } }
    if (rawBriefs)     { try { partial.briefCompleted = JSON.parse(rawBriefs) }       catch { /* ignore */ } }

    if (Object.keys(partial).length > 0) {
      dispatch({ type: 'HYDRATE', payload: partial })
    }
  }, [])

  // Persist on every change
  useEffect(() => {
    if (state.user) localStorage.setItem('rosetta_user', JSON.stringify(state.user))
    localStorage.setItem('rosetta_vocab',           JSON.stringify(state.vocabulary))
    localStorage.setItem('rosetta_errors',          JSON.stringify(state.errors))
    localStorage.setItem('rosetta_cheatsheet',      JSON.stringify(state.cheatSheet))
    localStorage.setItem('rosetta_visited_tabs',    JSON.stringify(state.visitedTabs))
    localStorage.setItem('rosetta_brief_completed', JSON.stringify(state.briefCompleted))
  }, [state.user, state.vocabulary, state.errors, state.cheatSheet, state.visitedTabs, state.briefCompleted])

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
