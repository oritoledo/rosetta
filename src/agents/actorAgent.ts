import { briefs } from '../data/briefs'
import { getPersonaById } from '../data/personas'
import type { Scene } from '../data/scenes'
import type { Persona } from '../data/personas'
import type { ChatMessage } from '../data/mockConversation'
import type {
  SessionDirective,
  MockActorResponse,
  AnnotatedTranscript,
  AnnotatedMessage,
  TranscriptGrammarAttempt,
} from '../types/harness'

// ─── Actor system prompt ──────────────────────────────────────────────────────

export function buildActorSystemPrompt(
  directive: SessionDirective,
  scene: Scene,
  persona: Persona,
): string {
  const { plannerOutput, sceneContext } = directive

  return `You are ${persona.name}, ${persona.role} at ${scene.location}.
${persona.personality}

SCENE: ${scene.title}
SETTING: ${sceneContext.setting}
CULTURAL RULES: ${sceneContext.culturalRules.join('; ')}

SESSION DIRECTIVE (follow these instructions):
- Speaking pace: ${plannerOutput.actorInstructions.paceModifier}
- Vocabulary level: ${plannerOutput.actorInstructions.vocabularyComplexity}
- Correction style: ${plannerOutput.actorInstructions.correctionStyle}
- Warmth: ${plannerOutput.actorInstructions.warmthLevel}
- Proactively introduce these vocabulary IDs naturally: ${plannerOutput.actorInstructions.shouldProactivelyIntroduce.join(', ')}
- Grammar focus to weave in: ${plannerOutput.grammarFocus.title}
- Introduction strategy: ${plannerOutput.grammarFocus.introductionStrategy}

CONSTRAINTS:
- Stay in character at all times. Never break the scene.
- Only discuss topics relevant to ${scene.title}.
- Speak primarily in ${scene.language}. Provide translations naturally.
- If user makes an error, respond with ${plannerOutput.actorInstructions.correctionStyle} correction style.`
}

// ─── Directive compliance scanner ─────────────────────────────────────────────

function scanForPriorityVocab(text: string, priorityVocabIds: string[], sceneId: string): string[] {
  const brief = briefs[sceneId]
  if (!brief) return []

  const found: string[] = []
  for (const id of priorityVocabIds) {
    const item = brief.vocabulary.find((v) => v.id === id)
    if (!item) continue
    if (text.toLowerCase().includes(item.word.toLowerCase())) {
      found.push(id)
    }
  }
  return found
}

function scanForGrammarStructure(text: string, structureId: string, sceneId: string): boolean {
  const brief = briefs[sceneId]
  if (!brief) return false

  const item = brief.grammar.find((g) => g.id === structureId)
  if (!item) return false

  // Check if any of the grammar's example Italian phrases appear in the text
  const lowerText = text.toLowerCase()
  return item.examples.some((ex) =>
    ex.it.toLowerCase().split(' ').slice(0, 3).join(' ').length > 3 &&
    lowerText.includes(ex.it.toLowerCase().split(' ')[0])
  )
}

// ─── Actor response ───────────────────────────────────────────────────────────

export function getActorResponse(
  directive: SessionDirective,
  messageIndex: number,
  _userInput: string,
): MockActorResponse {
  const { sceneId, personaId } = directive
  const { plannerOutput } = directive

  const persona = getPersonaById(personaId)
  const sceneKey = sceneId as keyof typeof persona.conversation
  const messages = persona.conversation[sceneKey] ?? persona.conversation.cafe

  // Find the next AI message at or after messageIndex
  const aiMessages = messages.filter((m) => m.role === 'ai')
  const idx = messageIndex % Math.max(aiMessages.length, 1)
  const source = aiMessages[idx] ?? aiMessages[aiMessages.length - 1]

  const text = source?.text ?? ''
  const translation = source?.translation ?? ''

  // Annotate with directive compliance
  const usedPriorityVocab = scanForPriorityVocab(text, plannerOutput.priorityVocabulary, sceneId)
  const advancedGrammar = scanForGrammarStructure(
    text,
    plannerOutput.grammarFocus.structureId,
    sceneId,
  )

  return {
    text,
    translation,
    directiveCompliance: {
      usedPriorityVocab,
      advancedGrammar,
      paceAdherence: true, // mocked — always adheres
    },
  }
}

// ─── Annotated transcript builder ─────────────────────────────────────────────

export function buildAnnotatedTranscript(
  messages: ChatMessage[],
  directive: SessionDirective,
): AnnotatedTranscript {
  const { sceneId, plannerOutput } = directive
  const brief = briefs[sceneId]
  const now = Date.now()

  const wordUsage: Record<string, number> = {}
  for (const id of plannerOutput.priorityVocabulary) {
    wordUsage[id] = 0
  }

  const grammarAttempts: TranscriptGrammarAttempt[] = []

  const annotated: AnnotatedMessage[] = messages
    .filter((m) => m.role !== 'hint')
    .map((m, i) => {
      const base: AnnotatedMessage = {
        role: m.role === 'ai' ? 'ai' : 'user',
        text: m.text,
        translation: m.translation,
        timestamp: now - (messages.length - i) * 30_000, // synthetic 30s intervals
      }

      if (m.role === 'user') {
        // Scan for priority vocabulary
        const vocabUsed = scanForPriorityVocab(m.text, plannerOutput.priorityVocabulary, sceneId)
        for (const id of vocabUsed) {
          wordUsage[id] = (wordUsage[id] ?? 0) + 1
        }
        base.priorityVocabUsed = vocabUsed

        // Detect grammar focus attempts
        const grammarId = plannerOutput.grammarFocus.structureId
        const grammarItem = brief?.grammar.find((g) => g.id === grammarId)
        if (grammarItem) {
          // Check for the grammar focus keyword in user text
          const hasAttempt = grammarItem.examples.some((ex) => {
            const keyword = ex.it.toLowerCase().split(' ')[0]
            return keyword.length > 2 && m.text.toLowerCase().includes(keyword)
          })
          if (hasAttempt) {
            base.grammarStructureAttempted = grammarId
            grammarAttempts.push({
              structureId: grammarId,
              userAttempt: m.text,
              correct: !m.errorWords?.length,
            })
          }
        }

        // Simple error flags
        const flags: string[] = []
        // Flag "voglio" when "vorrei" is the grammar focus (common formality error)
        if (
          m.text.toLowerCase().includes('voglio') &&
          plannerOutput.grammarFocus.title.toLowerCase().includes('condizionale')
        ) {
          flags.push('used-voglio-instead-of-vorrei')
        }
        if (m.errorWords?.length) {
          flags.push(...(m.errorWords ?? []))
        }
        if (flags.length) base.errorFlags = flags
      }

      return base
    })

  const userMessages = annotated.filter((m) => m.role === 'user')

  return {
    messages: annotated,
    totalUserMessages: userMessages.length,
    directiveWordUsage: wordUsage,
    grammarAttempts,
  }
}
