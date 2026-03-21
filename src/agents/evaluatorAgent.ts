import type { SessionDirective, AnnotatedTranscript, EvaluatorCorrection } from '../types/harness'

// ─── Cost calculation ─────────────────────────────────────────────────────────

function calculateCost(usage: { input_tokens: number; output_tokens: number }): number {
  return (usage.input_tokens * 3 + usage.output_tokens * 15) / 1_000_000
}

// ─── Transcript serialiser ────────────────────────────────────────────────────

function serialiseTranscript(transcript: AnnotatedTranscript): string {
  return transcript.messages
    .map((m) => {
      const speaker = m.role === 'ai' ? 'NATIVE' : 'USER'
      const flags = m.errorFlags?.length ? ` [FLAGS: ${m.errorFlags.join(', ')}]` : ''
      const vocab = m.priorityVocabUsed?.length ? ` [VOCAB: ${m.priorityVocabUsed.join(', ')}]` : ''
      const grammar = m.grammarStructureAttempted ? ` [GRAMMAR: ${m.grammarStructureAttempted}]` : ''
      return `${speaker}: ${m.text}${flags}${vocab}${grammar}`
    })
    .join('\n')
}

// ─── Fallback evaluator output ────────────────────────────────────────────────

function buildFallbackEvaluatorOutput(
  directive: SessionDirective,
  transcript: AnnotatedTranscript,
): NonNullable<SessionDirective['evaluatorOutput']> {
  const vocabHits = Object.values(transcript.directiveWordUsage).filter((n) => n > 0).length
  const vocabTotal = directive.plannerOutput.priorityVocabulary.length
  const vocabScore = vocabTotal > 0 ? Math.round((vocabHits / vocabTotal) * 100) : 50

  return {
    overallScore: 65,
    vocabularyScore: vocabScore,
    grammarScore: 60,
    fluencyScore: 65,
    corrections: [],
    vocabularyUsed: directive.plannerOutput.priorityVocabulary.map((id) => ({
      wordId: id,
      usedCorrectly: (transcript.directiveWordUsage[id] ?? 0) > 0,
      userForm: '',
    })),
    grammarApplications: transcript.grammarAttempts.map((a) => ({
      structureId: a.structureId,
      correct: a.correct,
      userAttempt: a.userAttempt,
    })),
    newPatternsDetected: [],
    successCriteriaMet: false,
    evaluatorNotes: 'Evaluation completed with fallback (API unavailable).',
  }
}

function buildFallbackSelfEvaluation(
  directive: SessionDirective,
  transcript: AnnotatedTranscript,
  overallScore: number,
): NonNullable<SessionDirective['selfEvaluation']> {
  const vocabHits = Object.values(transcript.directiveWordUsage).filter((n) => n > 0).length
  const vocabTotal = directive.plannerOutput.priorityVocabulary.length
  const hitRate = vocabTotal > 0 ? vocabHits / vocabTotal : 0

  const grammarMet = transcript.grammarAttempts.some((a) => a.correct)

  const missed = directive.plannerOutput.priorityVocabulary.filter(
    (id) => (transcript.directiveWordUsage[id] ?? 0) === 0,
  )

  return {
    directiveEffectiveness: Math.min(overallScore / 100, 1),
    vocabularyHitRate: hitRate,
    grammarTargetMet: grammarMet,
    adjustmentsForNext: {
      difficulty:
        overallScore >= directive.plannerOutput.successCriteria.minimumScore + 10
          ? 'increase'
          : overallScore < directive.plannerOutput.successCriteria.minimumScore - 10
            ? 'decrease'
            : 'maintain',
      vocabularyFocus: missed,
      grammarNote: grammarMet
        ? 'Grammar target met — maintain or advance.'
        : `Re-focus on ${directive.plannerOutput.grammarFocus.title} next session.`,
    },
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function runEvaluator(
  directive: SessionDirective,
  transcript: AnnotatedTranscript,
): Promise<SessionDirective> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const serialised = serialiseTranscript(transcript)
  const successCriteria = directive.plannerOutput.successCriteria
  const grammarFocus = directive.plannerOutput.grammarFocus

  const evaluatorPrompt = `You are the Evaluator agent for Rosetta, a language learning app.
Analyse the conversation transcript below and return a structured JSON evaluation.

SCENE: ${directive.sceneContext.sceneName}
SETTING: ${directive.sceneContext.setting}
USER LEVEL: ${directive.userLevel}
GRAMMAR FOCUS: ${grammarFocus.title} (target: ${grammarFocus.targetUsageCount} correct uses)
PRIORITY VOCABULARY: ${directive.plannerOutput.priorityVocabulary.join(', ')}
SUCCESS CRITERIA: score >= ${successCriteria.minimumScore}, vocab used: ${successCriteria.requiredVocabUsed.join(', ')}, grammar applications: ${successCriteria.grammarApplications}

TRANSCRIPT:
${serialised}

OUTPUT SCHEMA — respond with ONLY this JSON, no preamble:
{
  "overallScore": 0-100,
  "vocabularyScore": 0-100,
  "grammarScore": 0-100,
  "fluencyScore": 0-100,
  "corrections": [
    {
      "type": "verb-tense|gender-agreement|word-choice|word-order|pronunciation|formality|idiom",
      "severity": "minor|moderate|major",
      "userSaid": "...",
      "nativeSaid": "...",
      "rule": "plain English explanation",
      "sceneContext": "where in the conversation this occurred"
    }
  ],
  "vocabularyUsed": [
    { "wordId": "v1", "usedCorrectly": true, "userForm": "actual word user wrote" }
  ],
  "grammarApplications": [
    { "structureId": "g1", "correct": true, "userAttempt": "...", "correction": "..." }
  ],
  "newPatternsDetected": [
    { "category": "...", "example": "...", "severity": "new|recurring" }
  ],
  "successCriteriaMet": true,
  "evaluatorNotes": "1-2 sentence overall assessment"
}`

  const selfEvalPrompt = `You are the Planner agent performing self-evaluation.
The session you planned is now complete. Assess your own directive effectiveness.

ORIGINAL DIRECTIVE:
- Priority vocabulary: ${directive.plannerOutput.priorityVocabulary.join(', ')}
- Grammar focus: ${grammarFocus.title}
- Minimum score target: ${successCriteria.minimumScore}

OUTCOME:
- Vocabulary word usage counts: ${JSON.stringify(transcript.directiveWordUsage)}
- Grammar attempts: ${transcript.grammarAttempts.length}
- Total user messages: ${transcript.totalUserMessages}

OUTPUT SCHEMA — respond with ONLY this JSON, no preamble:
{
  "directiveEffectiveness": 0.0-1.0,
  "vocabularyHitRate": 0.0-1.0,
  "grammarTargetMet": true,
  "adjustmentsForNext": {
    "difficulty": "increase|maintain|decrease",
    "vocabularyFocus": ["v1", "v2"],
    "grammarNote": "..."
  }
}`

  // Run Evaluator
  let evaluatorOutput: NonNullable<SessionDirective['evaluatorOutput']>
  let evaluatorTokens = 0
  let evaluatorCost = 0

  try {
    if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

    const evalResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        system: evaluatorPrompt,
        messages: [{ role: 'user', content: 'Evaluate the session transcript now.' }],
      }),
    })

    if (!evalResponse.ok) {
      const errText = await evalResponse.text()
      throw new Error(`Evaluator API error ${evalResponse.status}: ${errText}`)
    }

    const evalData = await evalResponse.json()
    const rawText: string = evalData.content[0].text
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    evaluatorOutput = JSON.parse(jsonText) as NonNullable<SessionDirective['evaluatorOutput']>

    evaluatorTokens = evalData.usage.input_tokens + evalData.usage.output_tokens
    evaluatorCost = calculateCost(evalData.usage)
  } catch (err: unknown) {
    console.error('[Evaluator] Error:', err instanceof Error ? err.message : String(err))
    evaluatorOutput = buildFallbackEvaluatorOutput(directive, transcript)
  }

  // Run self-evaluation
  let selfEvaluation: NonNullable<SessionDirective['selfEvaluation']>
  let selfEvalTokens = 0
  let selfEvalCost = 0

  try {
    if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

    const selfResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: selfEvalPrompt,
        messages: [{ role: 'user', content: 'Perform self-evaluation now.' }],
      }),
    })

    if (!selfResponse.ok) {
      const errText = await selfResponse.text()
      throw new Error(`Self-eval API error ${selfResponse.status}: ${errText}`)
    }

    const selfData = await selfResponse.json()
    const rawText: string = selfData.content[0].text
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    selfEvaluation = JSON.parse(jsonText) as NonNullable<SessionDirective['selfEvaluation']>

    selfEvalTokens = selfData.usage.input_tokens + selfData.usage.output_tokens
    selfEvalCost = calculateCost(selfData.usage)
  } catch (err: unknown) {
    console.error('[Self-eval] Error:', err instanceof Error ? err.message : String(err))
    selfEvaluation = buildFallbackSelfEvaluation(directive, transcript, evaluatorOutput.overallScore)
  }

  const totalCost = directive.tokenUsage.totalCost + evaluatorCost + selfEvalCost

  return {
    ...directive,
    evaluatorOutput,
    selfEvaluation,
    tokenUsage: {
      plannerTokens: directive.tokenUsage.plannerTokens,
      evaluatorTokens,
      selfEvalTokens,
      totalCost,
    },
    status: 'complete',
  }
}
