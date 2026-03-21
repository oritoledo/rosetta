import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { applyAccent } from '../utils/colourUtils'

// ─── State ────────────────────────────────────────────────────────────────────

export interface SettingsState {
  theme: 'dark' | 'light' | 'system'
  accentColour: string
  fontSize: number
  dailyGoalMinutes: number
  weeklyDays: string[]
  reminderEnabled: boolean
  reminderTime: string
  streakFreezeEnabled: boolean
  restDayMessage: boolean
  dialectPreferences: Record<string, string>
  translationVisibility: 'always' | 'on-tap' | 'never'
  pronunciationGuide: boolean
  scriptOrder: 'target-first' | 'translation-first'
  // Harness
  harnessEnabled: boolean
  harnessApiKey: string
  harnessTokenBudget: '$1' | '$5' | '$10' | '$25' | 'unlimited'
  harnessActorApi: boolean
  harnessShowDirective: boolean
  harnessShowEvaluating: boolean
  harnessTotalTokens: number
  harnessTotalCostUSD: number
  harnessSessionsCount: number
}

export type SettingsAction =
  | { type: 'UPDATE_THEME'; payload: SettingsState['theme'] }
  | { type: 'UPDATE_ACCENT'; payload: string }
  | { type: 'UPDATE_FONT_SIZE'; payload: number }
  | { type: 'UPDATE_DAILY_GOAL'; payload: number }
  | { type: 'UPDATE_WEEKLY_DAYS'; payload: string[] }
  | { type: 'UPDATE_REMINDER'; payload: { enabled: boolean; time: string } }
  | { type: 'SET_STREAK_FREEZE'; payload: boolean }
  | { type: 'SET_REST_DAY_MESSAGE'; payload: boolean }
  | { type: 'UPDATE_DIALECT'; payload: { language: string; dialect: string } }
  | { type: 'UPDATE_TRANSLATION_VISIBILITY'; payload: SettingsState['translationVisibility'] }
  | { type: 'UPDATE_PRONUNCIATION_GUIDE'; payload: boolean }
  | { type: 'UPDATE_SCRIPT_ORDER'; payload: SettingsState['scriptOrder'] }
  | { type: 'SET_HARNESS_ENABLED'; payload: boolean }
  | { type: 'UPDATE_HARNESS_API_KEY'; payload: string }
  | { type: 'UPDATE_HARNESS_BUDGET'; payload: SettingsState['harnessTokenBudget'] }
  | { type: 'UPDATE_HARNESS_ACTOR_API'; payload: boolean }
  | { type: 'UPDATE_HARNESS_SHOW_DIRECTIVE'; payload: boolean }
  | { type: 'UPDATE_HARNESS_SHOW_EVALUATING'; payload: boolean }

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SettingsState = {
  theme: 'dark',
  accentColour: '#059669',
  fontSize: 14,
  dailyGoalMinutes: 15,
  weeklyDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  reminderEnabled: false,
  reminderTime: '09:00',
  streakFreezeEnabled: false,
  restDayMessage: true,
  dialectPreferences: { italian: 'standard', spanish: 'castilian', french: 'parisian', german: 'hochdeutsch' },
  translationVisibility: 'always',
  pronunciationGuide: true,
  scriptOrder: 'target-first',
  harnessEnabled: false,
  harnessApiKey: '',
  harnessTokenBudget: '$5',
  harnessActorApi: false,
  harnessShowDirective: true,
  harnessShowEvaluating: true,
  harnessTotalTokens: 0,
  harnessTotalCostUSD: 0,
  harnessSessionsCount: 0,
}

// ─── DOM application (sync-safe, called before first render) ──────────────────

export function applySettingsToDOM(s: SettingsState): void {
  // Theme
  const prefersDark =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true

  const useDark = s.theme === 'dark' || (s.theme === 'system' && prefersDark)
  document.body.classList.toggle('theme-light', !useDark)

  // Accent
  applyAccent(s.accentColour)

  // Font size
  document.documentElement.style.setProperty('--body-font-size', `${s.fontSize}px`)
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_THEME':            return { ...state, theme: action.payload }
    case 'UPDATE_ACCENT':           return { ...state, accentColour: action.payload }
    case 'UPDATE_FONT_SIZE':        return { ...state, fontSize: action.payload }
    case 'UPDATE_DAILY_GOAL':       return { ...state, dailyGoalMinutes: action.payload }
    case 'UPDATE_WEEKLY_DAYS':      return { ...state, weeklyDays: action.payload }
    case 'UPDATE_REMINDER':         return { ...state, reminderEnabled: action.payload.enabled, reminderTime: action.payload.time }
    case 'SET_STREAK_FREEZE':       return { ...state, streakFreezeEnabled: action.payload }
    case 'SET_REST_DAY_MESSAGE':    return { ...state, restDayMessage: action.payload }
    case 'UPDATE_DIALECT':          return { ...state, dialectPreferences: { ...state.dialectPreferences, [action.payload.language]: action.payload.dialect } }
    case 'UPDATE_TRANSLATION_VISIBILITY': return { ...state, translationVisibility: action.payload }
    case 'UPDATE_PRONUNCIATION_GUIDE':    return { ...state, pronunciationGuide: action.payload }
    case 'UPDATE_SCRIPT_ORDER':     return { ...state, scriptOrder: action.payload }
    case 'SET_HARNESS_ENABLED':     return { ...state, harnessEnabled: action.payload }
    case 'UPDATE_HARNESS_API_KEY':  return { ...state, harnessApiKey: action.payload }
    case 'UPDATE_HARNESS_BUDGET':   return { ...state, harnessTokenBudget: action.payload }
    case 'UPDATE_HARNESS_ACTOR_API':        return { ...state, harnessActorApi: action.payload }
    case 'UPDATE_HARNESS_SHOW_DIRECTIVE':   return { ...state, harnessShowDirective: action.payload }
    case 'UPDATE_HARNESS_SHOW_EVALUATING':  return { ...state, harnessShowEvaluating: action.payload }
    default:                        return state
  }
}

// ─── Lazy initialiser (runs synchronously before first render) ────────────────

function getInitialSettings(): SettingsState {
  try {
    const raw = localStorage.getItem('rosetta_settings')
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SettingsState>
      const merged: SettingsState = { ...DEFAULT_SETTINGS, ...parsed }
      applySettingsToDOM(merged)
      return merged
    }
  } catch {
    // fall through to defaults
  }
  applySettingsToDOM(DEFAULT_SETTINGS)
  return DEFAULT_SETTINGS
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SettingsContextValue {
  settings: SettingsState
  dispatchSettings: React.Dispatch<SettingsAction>
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatchSettings] = useReducer(reducer, undefined, getInitialSettings)

  // Apply to DOM on every change and persist
  useEffect(() => {
    applySettingsToDOM(settings)
    try {
      localStorage.setItem('rosetta_settings', JSON.stringify(settings))
    } catch { /* ignore */ }
  }, [settings])

  return (
    React.createElement(SettingsContext.Provider, { value: { settings, dispatchSettings } }, children)
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
