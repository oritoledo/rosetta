// ─── Core Directive Types ──────────────────────────────────────────────────────

export interface EvaluatorCorrection {
  type: 'verb-tense' | 'gender-agreement' | 'word-choice' | 'word-order' | 'pronunciation' | 'formality' | 'idiom'
  severity: 'minor' | 'moderate' | 'major'
  userSaid: string
  nativeSaid: string
  rule: string
  sceneContext: string
}

export interface PlannerOutput {
  priorityVocabulary: string[]
  grammarFocus: {
    structureId: string
    title: string
    targetUsageCount: number
    introductionStrategy: 'natural' | 'prompted' | 'corrective'
  }
  actorInstructions: {
    paceModifier: 'slow' | 'normal' | 'fast'
    vocabularyComplexity: 'simplified' | 'standard' | 'enriched'
    correctionStyle: 'implicit' | 'gentle' | 'direct'
    warmthLevel: 'warm' | 'neutral' | 'formal'
    shouldProactivelyIntroduce: string[]
  }
  successCriteria: {
    minimumScore: number
    requiredVocabUsed: string[]
    grammarApplications: number
  }
  difficultyRationale: string
  plannerConfidence: number
}

export interface SessionDirective {
  // Identity
  directiveId: string
  generatedAt: number
  userId: string
  sceneId: string
  personaId: string
  userLevel: string

  // Scene context (populated from scenes.ts + briefs.ts, NOT from Claude)
  sceneContext: {
    sceneName: string
    setting: string
    character: string
    culturalRules: string[]
    availableVocabulary: string[]
    availableGrammarStructures: string[]
    expectedDuration: number
  }

  // Planner decisions (Claude's output — constrained to scene's available items)
  plannerOutput: PlannerOutput

  // Evaluator output (populated after session ends)
  evaluatorOutput?: {
    overallScore: number
    vocabularyScore: number
    grammarScore: number
    fluencyScore: number
    corrections: EvaluatorCorrection[]
    vocabularyUsed: { wordId: string; usedCorrectly: boolean; userForm: string }[]
    grammarApplications: { structureId: string; correct: boolean; userAttempt: string; correction?: string }[]
    newPatternsDetected: { category: string; example: string; severity: 'new' | 'recurring' }[]
    successCriteriaMet: boolean
    evaluatorNotes: string
  }

  // Self-evaluation (populated after Evaluator runs)
  selfEvaluation?: {
    directiveEffectiveness: number
    vocabularyHitRate: number
    grammarTargetMet: boolean
    adjustmentsForNext: {
      difficulty: 'increase' | 'maintain' | 'decrease'
      vocabularyFocus: string[]
      grammarNote: string
    }
  }

  // Execution metadata
  tokenUsage: {
    plannerTokens: number
    evaluatorTokens: number
    selfEvalTokens: number
    totalCost: number
  }

  status: 'planning' | 'briefing' | 'active' | 'evaluating' | 'complete' | 'error'
  error?: string
}

export interface DirectiveHistory {
  directiveId: string
  sceneId: string
  generatedAt: number
  overallScore?: number
  status: SessionDirective['status']
}

// ─── Actor types ──────────────────────────────────────────────────────────────

export interface MockActorResponse {
  text: string
  translation: string
  directiveCompliance: {
    usedPriorityVocab: string[]
    advancedGrammar: boolean
    paceAdherence: boolean
  }
}

export interface AnnotatedMessage {
  role: 'ai' | 'user'
  text: string
  translation?: string
  timestamp: number
  priorityVocabUsed?: string[]
  grammarStructureAttempted?: string
  errorFlags?: string[]
}

export interface TranscriptGrammarAttempt {
  structureId: string
  userAttempt: string
  correct: boolean
}

export interface AnnotatedTranscript {
  messages: AnnotatedMessage[]
  totalUserMessages: number
  directiveWordUsage: Record<string, number>
  grammarAttempts: TranscriptGrammarAttempt[]
}
