import type { Scene } from '../data/scenes'
import type { Persona } from '../data/personas'
import type { VocabWord } from '../data/vocabulary'

// ─── Grammar Focus ────────────────────────────────────────────────────────────

export interface GrammarFocus {
  category: string
  title: string
  description: string
  priority: 'critical' | 'important' | 'maintenance'
}

// ─── Plan Reason ──────────────────────────────────────────────────────────────

export interface PlanReason {
  icon: string
  text: string
}

// ─── Day Plan ─────────────────────────────────────────────────────────────────

export interface DayPlan {
  date: Date
  dayLabel: string        // "Today", "Tomorrow", "Wednesday" etc.
  scene?: Scene           // undefined on rest days
  persona?: Persona       // undefined on rest days
  grammarFocus?: GrammarFocus  // undefined on rest days
  vocabTargets: VocabWord[]
  estimatedMinutes: number
  difficulty: 'light' | 'moderate' | 'intense'
  reasoning: PlanReason[]
  isToday: boolean
  isCompleted: boolean
  isRest: boolean
  restMessage?: string
}

// ─── Week Summary ─────────────────────────────────────────────────────────────

export interface WeekSummary {
  totalMinutes: number
  scenesPlanned: number
  grammarFocuses: string[]
  vocabTargets: number
  restDays: number
  weekTheme: string
}

// ─── Weekly Plan ─────────────────────────────────────────────────────────────

export interface WeeklyPlan {
  generatedAt: Date
  seed: number
  days: DayPlan[]           // always 7 days starting from today
  weekSummary: WeekSummary
}

// ─── Stored Plan (localStorage-safe, no complex objects) ─────────────────────

export interface StoredDayPlan {
  dateTs: number
  dayLabel: string
  sceneId?: string
  personaId?: string
  grammarFocus?: GrammarFocus
  vocabTargetIds: string[]
  estimatedMinutes: number
  difficulty: 'light' | 'moderate' | 'intense'
  reasoning: PlanReason[]
  isToday: boolean
  isCompleted: boolean
  isRest: boolean
  restMessage?: string
}

export interface StoredPlan {
  generatedAt: number      // timestamp
  seed: number
  days: StoredDayPlan[]
  weekSummary: WeekSummary
}
