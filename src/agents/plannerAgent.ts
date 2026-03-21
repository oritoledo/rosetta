import { scenes } from '../data/scenes'
import { briefs } from '../data/briefs'
import { getPersonaById } from '../data/personas'
import type { GrammarError } from '../data/errors'
import type { AppState } from '../store/userStore'
import type { SessionDirective, PlannerOutput } from '../types/harness'

// ─── Cost calculation ─────────────────────────────────────────────────────────

function calculateCost(usage: { input_tokens: number; output_tokens: number }): number {
  // claude-sonnet-4-20250514: $3/M input, $15/M output
  return (usage.input_tokens * 3 + usage.output_tokens * 15) / 1_000_000
}

// ─── Error summary ────────────────────────────────────────────────────────────

interface ErrorSummaryItem {
  category: string
  count: number
  lastSeen: number
  trend: 'improving' | 'recurring' | 'new'
}

function summariseErrors(errors: GrammarError[]): ErrorSummaryItem[] {
  const byCategory = new Map<string, GrammarError[]>()
  for (const e of errors) {
    const arr = byCategory.get(e.type) ?? []
    arr.push(e)
    byCategory.set(e.type, arr)
  }

  return Array.from(byCategory.entries())
    .map(([category, errs]) => {
      const lastSeen = Math.max(...errs.map((e) => e.sceneDate))
      const corrected = errs.filter((e) => e.corrected).length
      const trend: 'improving' | 'recurring' | 'new' =
        corrected > errs.length / 2 ? 'improving' : errs.length >= 3 ? 'recurring' : 'new'
      return { category, count: errs.length, lastSeen, trend }
    })
    .sort((a, b) => b.count - a.count)
}

// ─── Duration parser ──────────────────────────────────────────────────────────

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/\d+/)
  return match ? parseInt(match[0], 10) : 8
}

// ─── Fallback directive ───────────────────────────────────────────────────────

function buildFallbackDirective(
  store: AppState,
  sceneId: string,
  personaId: string,
  sceneContext: SessionDirective['sceneContext'],
  error: string,
): SessionDirective {
  const vocabSample = sceneContext.availableVocabulary.slice(0, 4)
  const grammarId = sceneContext.availableGrammarStructures[0] ?? 'g1'

  const plannerOutput: PlannerOutput = {
    priorityVocabulary: vocabSample,
    grammarFocus: {
      structureId: grammarId,
      title: 'Core Grammar Structure',
      targetUsageCount: 2,
      introductionStrategy: 'natural',
    },
    actorInstructions: {
      paceModifier: store.user?.level === 'A1' || store.user?.level === 'A2' ? 'slow' : 'normal',
      vocabularyComplexity: 'standard',
      correctionStyle: 'gentle',
      warmthLevel: 'warm',
      shouldProactivelyIntroduce: vocabSample.slice(0, 2),
    },
    successCriteria: {
      minimumScore: 60,
      requiredVocabUsed: vocabSample.slice(0, 1),
      grammarApplications: 1,
    },
    difficultyRationale: 'Default plan — using scene vocabulary for practice.',
    plannerConfidence: 0.3,
  }

  return {
    directiveId: crypto.randomUUID(),
    generatedAt: Date.now(),
    userId: store.user?.name ?? 'unknown',
    sceneId,
    personaId,
    userLevel: store.user?.level ?? 'B1',
    sceneContext,
    plannerOutput,
    tokenUsage: { plannerTokens: 0, evaluatorTokens: 0, selfEvalTokens: 0, totalCost: 0 },
    status: 'error',
    error,
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function runPlanner(
  store: AppState,
  sceneId: string,
  personaId: string,
): Promise<SessionDirective> {
  // STEP 1 — Build scene context (pure JS, no API)
  const scene = scenes[sceneId] ?? scenes.cafe
  const brief = briefs[sceneId] ?? briefs.cafe
  const persona = getPersonaById(personaId)

  const sceneContext: SessionDirective['sceneContext'] = {
    sceneName: scene.title,
    setting: `${scene.location} — ${scene.category}`,
    character: `${persona.name}, ${persona.role}`,
    culturalRules: [
      ...brief.culture.dos.map((d) => `Do: ${d}`),
      ...brief.culture.donts.map((d) => `Don't: ${d}`),
    ].slice(0, 6),
    availableVocabulary: brief.vocabulary.map((v) => v.id),
    availableGrammarStructures: brief.grammar.map((g) => g.id),
    expectedDuration: parseDurationMinutes(scene.duration),
  }

  // STEP 2 — Build user context summary (pure JS)
  const errorSummary = summariseErrors(store.errors)
  const vocabGaps = store.vocabulary
    .filter((w) => w.easeFactor < 2.0 || w.repetitions < 2)
    .map((w) => w.word)
    .slice(0, 10)
  const recentScores = store.sessionHistory
    .filter((s) => s.sceneId === sceneId)
    .map((s) => s.score)
  const avgScore =
    recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : null

  // STEP 3 — Build Planner system prompt
  const vocabDetails = brief.vocabulary.map((v) => `${v.id}:${v.word}(${v.translation})`).join(', ')
  const grammarDetails = brief.grammar.map((g) => `${g.id}:${g.title}`).join(', ')

  const systemPrompt = `You are the Planner agent for Rosetta, a language learning app.
Your role is to create a SessionDirective — a structured teaching plan for a single conversation scene.

CRITICAL CONSTRAINTS:
- You may ONLY select vocabulary from the scene's available vocabulary list (use the IDs provided)
- You may ONLY select grammar structures from the scene's available grammar list (use the IDs provided)
- You do NOT write conversation content — the Actor handles that
- You do NOT evaluate the user — the Evaluator handles that
- Your output must be valid JSON matching the PlannerOutput schema exactly

SCENE: ${scene.title} — ${sceneContext.setting}
CHARACTER: ${sceneContext.character}
AVAILABLE VOCABULARY (id:word(translation)): ${vocabDetails}
AVAILABLE GRAMMAR STRUCTURES (id:title): ${grammarDetails}

USER PROFILE:
- Level: ${store.user?.level ?? 'B1'}
- Current streak: ${store.sessionHistory.length > 0 ? store.sessionHistory.length : 0} sessions total
- Error patterns (top errors): ${JSON.stringify(errorSummary.slice(0, 3))}
- Vocabulary gaps (low ease factor): ${vocabGaps.join(', ') || 'none detected'}
- Previous scores on this scene: ${avgScore !== null ? avgScore.toFixed(0) + '%' : 'First attempt'}

OUTPUT SCHEMA — respond with ONLY this JSON, no preamble:
{
  "priorityVocabulary": ["v1", "v2", "v3"],
  "grammarFocus": {
    "structureId": "g1",
    "title": "...",
    "targetUsageCount": 2,
    "introductionStrategy": "natural"
  },
  "actorInstructions": {
    "paceModifier": "normal",
    "vocabularyComplexity": "standard",
    "correctionStyle": "gentle",
    "warmthLevel": "warm",
    "shouldProactivelyIntroduce": ["v1", "v2"]
  },
  "successCriteria": {
    "minimumScore": 70,
    "requiredVocabUsed": ["v1"],
    "grammarApplications": 1
  },
  "difficultyRationale": "...",
  "plannerConfidence": 0.8
}`

  try {
    // STEP 4 — Call Claude API
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate the SessionDirective now.' }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`API error ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const rawText: string = data.content[0].text

    // Strip any markdown code fences if present
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const plannerOutput = JSON.parse(jsonText) as PlannerOutput

    // STEP 5 — Assemble and return full SessionDirective
    return {
      directiveId: crypto.randomUUID(),
      generatedAt: Date.now(),
      userId: store.user?.name ?? 'unknown',
      sceneId,
      personaId,
      userLevel: store.user?.level ?? 'B1',
      sceneContext,
      plannerOutput,
      tokenUsage: {
        plannerTokens: data.usage.input_tokens + data.usage.output_tokens,
        evaluatorTokens: 0,
        selfEvalTokens: 0,
        totalCost: calculateCost(data.usage),
      },
      status: 'briefing',
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Planner] Error:', message)
    return buildFallbackDirective(store, sceneId, personaId, sceneContext, message)
  }
}
