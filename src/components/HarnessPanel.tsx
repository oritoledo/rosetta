import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SessionDirective } from '../types/harness'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<SessionDirective['status'], { label: string; color: string }> = {
  planning:   { label: 'Planning…',   color: '#c9a84c' },
  briefing:   { label: 'Ready',       color: '#52d48a' },
  active:     { label: 'Active',      color: '#5b8fd6' },
  evaluating: { label: 'Evaluating…', color: '#c9a84c' },
  complete:   { label: 'Complete',    color: '#52d48a' },
  error:      { label: 'Error',       color: '#e87060' },
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{ background: color + '22', color, border: `1px solid ${color}44` }}
      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
    >
      {label}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-[#8fa3b1] shrink-0">{label}</span>
      <span className="text-[#d4dde6] text-right">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#52d48a]">{title}</p>
      {children}
    </div>
  )
}

// ─── Sub-panels ───────────────────────────────────────────────────────────────

function PlannerPanel({ directive }: { directive: SessionDirective }) {
  const { plannerOutput: p, sceneContext: s } = directive

  return (
    <div className="space-y-4">
      <Section title="Scene Context">
        <Row label="Setting" value={s.setting} />
        <Row label="Character" value={s.character} />
        <Row label="Duration" value={`${s.expectedDuration} min`} />
      </Section>

      <Section title="Grammar Focus">
        <Row label="Structure" value={`${p.grammarFocus.structureId} — ${p.grammarFocus.title}`} />
        <Row label="Target uses" value={p.grammarFocus.targetUsageCount} />
        <Row label="Strategy" value={p.grammarFocus.introductionStrategy} />
      </Section>

      <Section title="Actor Instructions">
        <Row label="Pace" value={p.actorInstructions.paceModifier} />
        <Row label="Vocab level" value={p.actorInstructions.vocabularyComplexity} />
        <Row label="Correction" value={p.actorInstructions.correctionStyle} />
        <Row label="Warmth" value={p.actorInstructions.warmthLevel} />
        {p.actorInstructions.shouldProactivelyIntroduce.length > 0 && (
          <Row
            label="Introduce first"
            value={p.actorInstructions.shouldProactivelyIntroduce.join(', ')}
          />
        )}
      </Section>

      <Section title="Priority Vocabulary">
        <div className="flex flex-wrap gap-1">
          {p.priorityVocabulary.map((id) => (
            <span
              key={id}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2d3a] text-[#5b8fd6] border border-[#2a3f52]"
            >
              {id}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Success Criteria">
        <Row label="Min score" value={`${p.successCriteria.minimumScore}%`} />
        <Row label="Required vocab" value={p.successCriteria.requiredVocabUsed.join(', ')} />
        <Row label="Grammar applies" value={p.successCriteria.grammarApplications} />
      </Section>

      <Section title="Planner Meta">
        <Row
          label="Confidence"
          value={`${Math.round(p.plannerConfidence * 100)}%`}
        />
        <p className="text-xs text-[#8fa3b1] italic">{p.difficultyRationale}</p>
      </Section>
    </div>
  )
}

function EvaluatorPanel({ directive }: { directive: SessionDirective }) {
  const ev = directive.evaluatorOutput
  if (!ev) {
    return <p className="text-xs text-[#8fa3b1] italic">No evaluation data yet.</p>
  }

  return (
    <div className="space-y-4">
      <Section title="Scores">
        <Row label="Overall" value={`${ev.overallScore}%`} />
        <Row label="Vocabulary" value={`${ev.vocabularyScore}%`} />
        <Row label="Grammar" value={`${ev.grammarScore}%`} />
        <Row label="Fluency" value={`${ev.fluencyScore}%`} />
      </Section>

      {ev.corrections.length > 0 && (
        <Section title={`Corrections (${ev.corrections.length})`}>
          {ev.corrections.map((c, i) => (
            <div
              key={i}
              className="rounded p-2 bg-[#1a2530] border border-[#2a3f52] space-y-0.5"
            >
              <div className="flex items-center gap-1.5">
                <Badge
                  label={c.severity}
                  color={
                    c.severity === 'major'
                      ? '#e87060'
                      : c.severity === 'moderate'
                        ? '#c9a84c'
                        : '#52d48a'
                  }
                />
                <span className="text-[10px] text-[#8fa3b1]">{c.type}</span>
              </div>
              <p className="text-xs text-[#e87060]">
                You: <span className="italic">{c.userSaid}</span>
              </p>
              <p className="text-xs text-[#52d48a]">
                Native: <span className="italic">{c.nativeSaid}</span>
              </p>
              <p className="text-xs text-[#8fa3b1]">{c.rule}</p>
            </div>
          ))}
        </Section>
      )}

      {ev.newPatternsDetected.length > 0 && (
        <Section title="Patterns Detected">
          {ev.newPatternsDetected.map((p, i) => (
            <div key={i} className="text-xs text-[#8fa3b1]">
              <Badge label={p.severity} color={p.severity === 'recurring' ? '#e87060' : '#c9a84c'} />{' '}
              {p.category}: <span className="italic">{p.example}</span>
            </div>
          ))}
        </Section>
      )}

      <Section title="Evaluator Notes">
        <p className="text-xs text-[#d4dde6] italic">{ev.evaluatorNotes}</p>
        <Row
          label="Criteria met"
          value={ev.successCriteriaMet ? '✓ Yes' : '✗ No'}
        />
      </Section>
    </div>
  )
}

function SelfEvalPanel({ directive }: { directive: SessionDirective }) {
  const se = directive.selfEvaluation
  if (!se) {
    return <p className="text-xs text-[#8fa3b1] italic">No self-evaluation data yet.</p>
  }

  return (
    <div className="space-y-4">
      <Section title="Directive Effectiveness">
        <Row label="Effectiveness" value={`${Math.round(se.directiveEffectiveness * 100)}%`} />
        <Row label="Vocab hit rate" value={`${Math.round(se.vocabularyHitRate * 100)}%`} />
        <Row label="Grammar met" value={se.grammarTargetMet ? '✓ Yes' : '✗ No'} />
      </Section>

      <Section title="Adjustments for Next Session">
        <Row label="Difficulty" value={se.adjustmentsForNext.difficulty} />
        {se.adjustmentsForNext.vocabularyFocus.length > 0 && (
          <Row label="Re-focus vocab" value={se.adjustmentsForNext.vocabularyFocus.join(', ')} />
        )}
        <p className="text-xs text-[#8fa3b1] italic">{se.adjustmentsForNext.grammarNote}</p>
      </Section>
    </div>
  )
}

function TokenPanel({ directive }: { directive: SessionDirective }) {
  const { tokenUsage: t } = directive
  return (
    <div className="space-y-4">
      <Section title="Token Usage">
        <Row label="Planner" value={`${t.plannerTokens.toLocaleString()} tokens`} />
        <Row label="Evaluator" value={`${t.evaluatorTokens.toLocaleString()} tokens`} />
        <Row label="Self-eval" value={`${t.selfEvalTokens.toLocaleString()} tokens`} />
        <Row
          label="Total"
          value={`${(t.plannerTokens + t.evaluatorTokens + t.selfEvalTokens).toLocaleString()} tokens`}
        />
        <Row label="Est. cost" value={`$${t.totalCost.toFixed(5)}`} />
      </Section>

      <Section title="Directive ID">
        <p className="text-[10px] text-[#8fa3b1] font-mono break-all">{directive.directiveId}</p>
      </Section>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'planner' | 'evaluator' | 'self-eval' | 'tokens'

const TABS: { id: Tab; label: string }[] = [
  { id: 'planner',   label: 'Planner' },
  { id: 'evaluator', label: 'Evaluator' },
  { id: 'self-eval', label: 'Self-Eval' },
  { id: 'tokens',    label: 'Tokens' },
]

interface HarnessPanelProps {
  directive: SessionDirective | null
  isLoading?: boolean
}

export default function HarnessPanel({ directive, isLoading = false }: HarnessPanelProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('planner')

  const statusStyle = directive
    ? STATUS_STYLES[directive.status]
    : { label: 'Idle', color: '#8fa3b1' }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 font-sans">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
          bg-[#111c24] border border-[#2a3f52] text-[#d4dde6] hover:border-[#52d48a]
          transition-colors shadow-lg"
      >
        <span className="text-[10px] text-[#8fa3b1] font-normal">HARNESS</span>
        <span
          style={{
            background: statusStyle.color + '22',
            color: statusStyle.color,
            border: `1px solid ${statusStyle.color}44`,
          }}
          className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
        >
          {isLoading ? '…' : statusStyle.label}
        </span>
        <span className="text-[#8fa3b1]">{open ? '▼' : '▲'}</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="mt-2 rounded-xl bg-[#0d1820] border border-[#2a3f52] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#2a3f52] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#d4dde6]">Agent Harness</p>
                {directive && (
                  <p className="text-[10px] text-[#8fa3b1]">
                    {directive.sceneContext.sceneName} · {directive.personaId}
                  </p>
                )}
              </div>
              {directive && (
                <Badge label={statusStyle.label} color={statusStyle.color} />
              )}
            </div>

            {!directive ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-[#8fa3b1]">
                  {isLoading
                    ? 'Planner is thinking…'
                    : 'No active directive. Start a scene to run the Planner.'}
                </p>
              </div>
            ) : (
              <>
                {/* Error banner */}
                {directive.error && (
                  <div className="px-3 py-2 bg-[#e87060]/10 border-b border-[#e87060]/20">
                    <p className="text-[10px] text-[#e87060]">
                      ⚠ {directive.error} — using fallback plan
                    </p>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-[#2a3f52]">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors
                        ${activeTab === tab.id
                          ? 'text-[#52d48a] border-b-2 border-[#52d48a]'
                          : 'text-[#8fa3b1] hover:text-[#d4dde6]'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-3 max-h-96 overflow-y-auto">
                  {activeTab === 'planner'   && <PlannerPanel directive={directive} />}
                  {activeTab === 'evaluator' && <EvaluatorPanel directive={directive} />}
                  {activeTab === 'self-eval' && <SelfEvalPanel directive={directive} />}
                  {activeTab === 'tokens'    && <TokenPanel directive={directive} />}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
