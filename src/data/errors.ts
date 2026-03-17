export type ErrorCategory =
  | 'verb-tense'
  | 'gender-agreement'
  | 'word-choice'
  | 'word-order'
  | 'pronunciation'
  | 'formality'
  | 'idiom'

export interface GrammarError {
  id: string
  sceneId: string
  sceneDate: number
  type: ErrorCategory
  category: string // human-readable label
  youSaid: string
  nativeSaid: string
  rule: string
  corrected: boolean
}

export interface ErrorPattern {
  category: ErrorCategory
  count: number
  lastSeen: number
  trend: 'improving' | 'recurring' | 'new'
  exampleError: GrammarError
}

export const categoryLabels: Record<ErrorCategory, string> = {
  'verb-tense': 'Verb Tense',
  'gender-agreement': 'Gender Agreement',
  'word-choice': 'Word Choice',
  'word-order': 'Word Order',
  'pronunciation': 'Pronunciation',
  'formality': 'Formality',
  'idiom': 'Idiom',
}
