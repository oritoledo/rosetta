import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { scenes, Scene } from '../data/scenes'
import { briefs, VocabItem, GrammarItem, PronunciationItem, GrammarSlot, SceneBrief } from '../data/briefs'
import { useStore, CheatSheetItem } from '../store/userStore'

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TABS = ['vocabulary', 'grammar', 'pronunciation', 'culture'] as const
type TabId = typeof ALL_TABS[number]

const TAB_META: Record<TabId, { icon: string; label: string; subtitle: string }> = {
  vocabulary:    { icon: '📖', label: 'Vocabulary',    subtitle: 'Key words' },
  grammar:       { icon: '🏗️', label: 'Grammar',       subtitle: '3 structures' },
  pronunciation: { icon: '🔊', label: 'Pronunciation', subtitle: '5 tricky words' },
  culture:       { icon: '🎭', label: 'Culture',       subtitle: "Do's & don'ts" },
}

const DIFFICULTY_COLORS = {
  easy:   { text: '#52d48a', bg: 'rgba(82,212,138,0.1)',  border: 'rgba(82,212,138,0.25)' },
  medium: { text: '#c9a84c', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)' },
  hard:   { text: '#e8504c', bg: 'rgba(232,80,60,0.1)',   border: 'rgba(232,80,60,0.25)' },
}

const SLOT_COLORS: Record<GrammarSlot['type'], { bg: string; border: string; color: string }> = {
  subject:   { bg: 'rgba(91,143,214,0.15)',  border: 'rgba(91,143,214,0.3)',   color: 'var(--lapis-bright)' },
  verb:      { bg: 'rgba(82,212,138,0.12)',  border: 'rgba(82,212,138,0.25)',  color: '#52d48a' },
  object:    { bg: 'rgba(201,168,76,0.12)',  border: 'rgba(201,168,76,0.25)', color: '#c9a84c' },
  connector: { bg: 'transparent',            border: 'transparent',           color: 'var(--muted)' },
}

// ─── Waveform helper ──────────────────────────────────────────────────────────

function deterministicBars(seed: string, count: number, min: number, max: number): number[] {
  const base = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return Array.from({ length: count }, (_, i) => {
    const pseudo = ((base * (i + 1) * 7919) % 997) / 997
    return Math.round(min + pseudo * (max - min))
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifficultyDot({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const c = DIFFICULTY_COLORS[level]
  return (
    <span
      style={{
        width: 6, height: 6, borderRadius: '50%',
        background: c.text,
        display: 'inline-block',
        boxShadow: `0 0 4px ${c.text}`,
      }}
    />
  )
}

// ── Waveform ──

function Waveform({ seed, animated }: { seed: string; animated: boolean }) {
  const bars = deterministicBars(seed, 20, 8, 28)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '32px' }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          animate={animated
            ? { scaleY: [1, 0.6 + Math.random() * 0.8, 0.8 + Math.random() * 0.4, 1] }
            : { scaleY: 1 }
          }
          transition={animated
            ? { duration: 0.8, repeat: 2, delay: i * 0.03, ease: 'easeInOut' }
            : { duration: 0.2 }
          }
          style={{
            width: 2,
            height: h,
            background: 'var(--lapis-mid)',
            borderRadius: 1,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}

// ── Vocab Card ──

function VocabCard({ item, onAdd, isInSheet }: {
  item: VocabItem
  onAdd: (item: VocabItem) => void
  isInSheet: boolean
}) {
  const [active, setActive] = useState(false)
  const diff = DIFFICULTY_COLORS[item.difficulty]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => onAdd(item)}
      style={{
        background: 'var(--basalt-mid)',
        border: `1px solid ${active ? 'rgba(91,143,214,0.4)' : isInSheet ? 'rgba(91,143,214,0.25)' : 'rgba(232,238,245,0.07)'}`,
        borderRadius: 16,
        padding: 20,
        cursor: 'pointer',
        boxShadow: active ? '0 0 20px rgba(42,82,152,0.2)' : isInSheet ? '0 0 12px rgba(42,82,152,0.1)' : 'none',
        transition: 'border-color 200ms, box-shadow 200ms',
      }}
    >
      {/* Top row: word + audio btn */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, color: 'var(--moon-bright)', flex: 1 }}>
          {item.word}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setActive((v) => !v) }}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'transparent',
            border: '1px solid rgba(232,238,245,0.1)',
            cursor: 'pointer', fontSize: 14,
            color: active ? 'var(--lapis-bright)' : 'var(--moon-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 150ms',
          }}
        >
          🔊
        </button>
      </div>

      {/* Phonetic */}
      <div style={{
        fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic',
        color: active ? 'var(--lapis-bright)' : 'var(--muted)',
        marginTop: 2,
        transform: active ? 'scale(1.02)' : 'scale(1)',
        transformOrigin: 'left center',
        transition: 'color 150ms, transform 150ms',
      }}>
        {item.phonetic}
      </div>

      {/* Waveform when active */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 8 }}
        >
          <Waveform seed={item.id} animated />
        </motion.div>
      )}

      <div style={{ height: 1, background: 'rgba(232,238,245,0.06)', margin: '12px 0' }} />

      {/* Translation */}
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--moon)', marginBottom: 8 }}>
        {item.translation}
      </div>

      {/* Example sentence with word bolded */}
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.6 }}>
        {item.example.split(item.word).map((part, i, arr) =>
          i < arr.length - 1 ? (
            <span key={i}>
              {part}
              <strong style={{ color: 'var(--lapis-bright)', fontWeight: 600 }}>{item.word}</strong>
            </span>
          ) : <span key={i}>{part}</span>
        )}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--lapis-bright)',
          background: 'rgba(42,82,152,0.12)', borderRadius: 20, padding: '3px 10px',
        }}>
          {item.difficulty}
        </span>
        <DifficultyDot level={item.difficulty} />
      </div>

      {isInSheet && (
        <div style={{ marginTop: 8, fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lapis-bright)', opacity: 0.7 }}>
          ✓ added to cheat sheet
        </div>
      )}
    </motion.div>
  )
}

// ── Grammar Card ──

function GrammarCard({ item, onAdd, isInSheet }: {
  item: GrammarItem
  onAdd: (item: GrammarItem) => void
  isInSheet: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--basalt-mid)',
        border: `1px solid ${isInSheet ? 'rgba(91,143,214,0.25)' : 'rgba(232,238,245,0.07)'}`,
        borderRadius: 18, padding: 24, marginBottom: 24,
        cursor: 'pointer',
      }}
      onClick={() => onAdd(item)}
    >
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lapis-bright)', marginBottom: 4 }}>
        {item.name}
      </div>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700, color: 'var(--moon)', marginBottom: 20 }}>
        {item.title}
      </div>

      {/* Sentence builder */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 20 }}>
        {item.slots.map((slot, i) => {
          const sc = SLOT_COLORS[slot.type]
          if (slot.type === 'connector') {
            return (
              <span key={i} style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)' }}>
                {slot.text}
              </span>
            )
          }
          return (
            <div
              key={i}
              title={slot.note}
              style={{
                background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 600,
                padding: '8px 16px', borderRadius: 24,
              }}
            >
              {slot.text}
            </div>
          )
        })}
      </div>

      {/* Examples */}
      {item.examples.map((ex, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          padding: '10px 0', borderBottom: i < item.examples.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lapis-mid)', flexShrink: 0, marginTop: 6 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, fontStyle: 'italic', color: 'var(--moon)' }}>{ex.it}</span>
          </div>
          <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', textAlign: 'right', maxWidth: '40%' }}>
            {ex.en}
          </div>
        </div>
      ))}

      {/* When to use */}
      <div style={{
        marginTop: 16,
        background: 'rgba(42,82,152,0.08)',
        borderLeft: '3px solid var(--lapis-mid)',
        borderRadius: '0 8px 8px 0',
        padding: '12px 16px',
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lapis-bright)', marginBottom: 4 }}>
          When to use
        </div>
        <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--moon-dim)', lineHeight: 1.55 }}>
          {item.whenToUse}
        </div>
      </div>

      {isInSheet && (
        <div style={{ marginTop: 10, fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lapis-bright)', opacity: 0.7 }}>
          ✓ added to cheat sheet
        </div>
      )}
    </div>
  )
}

// ── Pronunciation Card ──

function PronunciationCard({ item, onAdd, isInSheet }: {
  item: PronunciationItem
  onAdd: (item: PronunciationItem) => void
  isInSheet: boolean
}) {
  const [animating, setAnimating] = useState(false)
  const bars = deterministicBars(item.id, 32, 6, 40)
  const diff = DIFFICULTY_COLORS[item.difficulty]

  function handleAudio(e: React.MouseEvent) {
    e.stopPropagation()
    setAnimating(true)
    setTimeout(() => setAnimating(false), 2000)
  }

  return (
    <div
      style={{
        background: 'var(--basalt-mid)',
        border: `1px solid ${isInSheet ? 'rgba(91,143,214,0.25)' : 'rgba(232,238,245,0.07)'}`,
        borderRadius: 16, padding: 22, marginBottom: 16,
        cursor: 'pointer',
      }}
      onClick={() => onAdd(item)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)' }}>
          {item.word}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleAudio}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'transparent', border: '1px solid rgba(232,238,245,0.1)',
              cursor: 'pointer', fontSize: 14, color: 'var(--moon-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            🔊
          </button>
          <span style={{
            fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em',
            color: diff.text, background: diff.bg, border: `1px solid ${diff.border}`,
            borderRadius: 20, padding: '3px 10px',
          }}>
            {item.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Syllable breakdown */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', marginBottom: 14, flexWrap: 'wrap' }}>
        {item.syllables.map((syl, i) => {
          const isStressed = i === item.stressed
          return (
            <div key={i} style={{ position: 'relative' }}>
              {isStressed && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: 'Cinzel, serif', fontSize: 10, color: 'var(--lapis-bright)',
                }}>
                  ′
                </div>
              )}
              <motion.div
                initial={isStressed ? { scale: 1 } : false}
                animate={isStressed ? { scale: [1, 1.06, 1] } : undefined}
                transition={isStressed ? { duration: 0.4, delay: 0.2 } : undefined}
                style={{
                  background: isStressed ? 'var(--lapis-deep)' : 'var(--basalt-raised)',
                  border: `1px solid ${isStressed ? 'rgba(91,143,214,0.35)' : 'rgba(232,238,245,0.07)'}`,
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: isStressed ? 18 : 16,
                  fontWeight: isStressed ? 700 : 400,
                  color: isStressed ? 'var(--moon-bright)' : 'var(--moon)',
                  boxShadow: isStressed ? '0 0 12px rgba(42,82,152,0.3)' : 'none',
                }}
              >
                {syl}
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* IPA */}
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 14 }}>
        {item.ipa}
      </div>

      {/* Waveform */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 2, marginBottom: 6 }}>
        {bars.map((h, i) => {
          const centre = Math.abs(i - 16) / 16
          const blended = Math.round(h * (1 - centre * 0.6))
          const isEdge = i < 6 || i > 25
          return (
            <motion.div
              key={i}
              animate={animating
                ? { scaleY: [1, 0.5 + Math.random(), 1.2 - Math.random() * 0.4, 1] }
                : { scaleY: 1 }
              }
              transition={animating
                ? { duration: 2, delay: i * 0.04, ease: 'easeInOut' }
                : { duration: 0.3 }
              }
              style={{
                width: 3,
                height: blended,
                background: isEdge ? 'var(--basalt-edge)' : 'var(--lapis-mid)',
                borderRadius: 2,
                transformOrigin: 'center',
              }}
            />
          )
        })}
      </div>
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)', textAlign: 'center', marginBottom: 14 }}>
        Tap 🔊 to hear
      </div>

      {/* Mistake note */}
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic', color: 'rgba(232,144,120,0.85)', lineHeight: 1.5 }}>
        ⚠ {item.mistake}
      </div>

      {isInSheet && (
        <div style={{ marginTop: 10, fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lapis-bright)', opacity: 0.7 }}>
          ✓ added to cheat sheet
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BriefScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { state, dispatch } = useStore()

  const sceneId = id ?? 'cafe'
  const scene = scenes[sceneId] ?? scenes.cafe
  const brief = briefs[sceneId] ?? briefs.cafe

  const [activeTab, setActiveTab] = useState<TabId>('vocabulary')
  const visitedTabs = state.visitedTabs[sceneId] ?? []
  const allVisited = ALL_TABS.every((t) => visitedTabs.includes(t))
  const cheatSheetIds = new Set(state.cheatSheet.map((i) => i.id))

  // Mark the initial tab as visited on mount
  useEffect(() => {
    dispatch({ type: 'MARK_TAB_VISITED', payload: { sceneId, tabId: 'vocabulary' } })
  }, [])

  function handleTabClick(tab: TabId) {
    setActiveTab(tab)
    dispatch({ type: 'MARK_TAB_VISITED', payload: { sceneId, tabId: tab } })
  }

  function handleBegin() {
    if (!allVisited) return
    dispatch({ type: 'COMPLETE_BRIEF', payload: sceneId })
    navigate(`/conversation/${sceneId}`)
  }

  function addVocabToSheet(item: VocabItem) {
    const cs: CheatSheetItem = {
      id: `${sceneId}_${item.id}`,
      type: 'vocab',
      word: item.word,
      translation: item.translation,
      sceneId,
    }
    dispatch({ type: 'ADD_TO_CHEAT_SHEET', payload: cs })
  }

  function addGrammarToSheet(item: GrammarItem) {
    const cs: CheatSheetItem = {
      id: `${sceneId}_${item.id}`,
      type: 'grammar',
      word: item.title,
      translation: item.whenToUse.slice(0, 60) + '…',
      sceneId,
    }
    dispatch({ type: 'ADD_TO_CHEAT_SHEET', payload: cs })
  }

  function addPronToSheet(item: PronunciationItem) {
    const cs: CheatSheetItem = {
      id: `${sceneId}_${item.id}`,
      type: 'pronunciation',
      word: item.word,
      translation: item.ipa,
      sceneId,
    }
    dispatch({ type: 'ADD_TO_CHEAT_SHEET', payload: cs })
  }

  const tabCount = visitedTabs.length

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--basalt)',
      }}
    >
      {/* Horizontal line texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(232,238,245,0.018) 39px, rgba(232,238,245,0.018) 40px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* 3-column grid — fills height minus bottom bar */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '220px 1fr 300px',
          height: 'calc(100dvh - 80px)',
          overflow: 'hidden',
        }}
      >
        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--basalt-mid)',
          borderRight: '1px solid rgba(232,238,245,0.06)',
          padding: '32px 20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Scene identity */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 36, filter: 'drop-shadow(0 0 20px rgba(91,143,214,0.35))', marginBottom: 10 }}>
              {scene.emoji}
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 15, fontWeight: 700, color: 'var(--moon)', marginBottom: 8, lineHeight: 1.2 }}>
              {scene.title}
            </div>
            <div style={{ display: 'inline-block', fontFamily: 'Cinzel, serif', fontSize: 9, color: 'var(--lapis-bright)', background: 'rgba(42,82,152,0.15)', border: '1px solid rgba(91,143,214,0.2)', borderRadius: 20, padding: '4px 12px', marginBottom: 8 }}>
              {scene.location}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[scene.duration, scene.level].map((chip) => (
                <span key={chip} style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--moon-dim)', background: 'rgba(232,238,245,0.06)', border: '1px solid rgba(232,238,245,0.08)', borderRadius: 20, padding: '3px 10px' }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Section label */}
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 10 }}>
            Briefing
          </div>

          {/* Tab nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ALL_TABS.map((tab) => {
              const meta = TAB_META[tab]
              const active = activeTab === tab
              const visited = visitedTabs.includes(tab)
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                    background: active ? 'var(--lapis-deep)' : 'transparent',
                    border: active ? '1px solid rgba(91,143,214,0.2)' : '1px solid transparent',
                    transition: 'background 150ms, border-color 150ms',
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--basalt-raised)' }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: active ? 'var(--lapis)' : 'var(--basalt-raised)',
                    border: '1px solid rgba(232,238,245,0.07)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 600, color: active ? 'var(--lapis-bright)' : 'var(--moon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meta.label}
                    </div>
                    <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)' }}>
                      {meta.subtitle}
                    </div>
                  </div>
                  {visited && (
                    <span style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: 'var(--lapis-bright)', flexShrink: 0 }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Progress tracker */}
          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 10 }}>
              Briefing Progress
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              {ALL_TABS.map((tab, i) => {
                const isCurrentTab = tab === activeTab
                const visited = visitedTabs.includes(tab)
                return (
                  <motion.div
                    key={tab}
                    animate={isCurrentTab ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: visited ? 'var(--lapis-mid)' : isCurrentTab ? 'var(--moon-bright)' : 'var(--basalt-edge)',
                      boxShadow: visited ? '0 0 6px rgba(58,106,191,0.5)' : isCurrentTab ? '0 0 8px rgba(244,247,250,0.4)' : 'none',
                    }}
                  />
                )
              })}
            </div>
            <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)' }}>
              {tabCount} of 4 sections reviewed
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
        <div style={{ overflowY: 'auto', padding: '48px 40px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >

              {/* ── TAB 1: VOCABULARY ── */}
              {activeTab === 'vocabulary' && (
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)', marginBottom: 6 }}>Key Vocabulary</div>
                  <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 20 }}>
                    Words you'll hear and need in this scene
                  </div>
                  <div style={{ height: 1, background: 'var(--lapis)', opacity: 0.3, marginBottom: 24 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {brief.vocabulary.map((item) => (
                      <VocabCard
                        key={item.id}
                        item={item}
                        onAdd={addVocabToSheet}
                        isInSheet={cheatSheetIds.has(`${sceneId}_${item.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 2: GRAMMAR ── */}
              {activeTab === 'grammar' && (
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)', marginBottom: 6 }}>Grammar Structures</div>
                  <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 20 }}>
                    The exact patterns you'll use in this scene
                  </div>
                  <div style={{ height: 1, background: 'var(--lapis)', opacity: 0.3, marginBottom: 24 }} />
                  {brief.grammar.map((item) => (
                    <GrammarCard
                      key={item.id}
                      item={item}
                      onAdd={addGrammarToSheet}
                      isInSheet={cheatSheetIds.has(`${sceneId}_${item.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* ── TAB 3: PRONUNCIATION ── */}
              {activeTab === 'pronunciation' && (
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)', marginBottom: 6 }}>Pronunciation Guide</div>
                  <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 20 }}>
                    Master these before the scene — they trip everyone up
                  </div>
                  <div style={{ height: 1, background: 'var(--lapis)', opacity: 0.3, marginBottom: 24 }} />
                  {brief.pronunciation.map((item) => (
                    <PronunciationCard
                      key={item.id}
                      item={item}
                      onAdd={addPronToSheet}
                      isInSheet={cheatSheetIds.has(`${sceneId}_${item.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* ── TAB 4: CULTURE ── */}
              {activeTab === 'culture' && (
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: 'var(--moon-bright)', marginBottom: 6 }}>Cultural Intelligence</div>
                  <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 24 }}>
                    {brief.culture.tagline}
                  </div>

                  {/* Insider tip */}
                  <div style={{
                    background: 'var(--lapis-deep)',
                    border: '1px solid rgba(91,143,214,0.25)',
                    borderRadius: 18, padding: 24, marginBottom: 28,
                    boxShadow: '0 4px 32px rgba(27,58,92,0.5)',
                  }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--lapis-bright)', opacity: 0.8, marginBottom: 10 }}>
                      𓂀 Local Insider Tip
                    </div>
                    <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 18, fontStyle: 'italic', color: 'var(--moon)', lineHeight: 1.6 }}>
                      {brief.culture.insiderTip}
                    </div>
                    <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', marginTop: 12, textAlign: 'right' }}>
                      {brief.culture.insiderSource}
                    </div>
                  </div>

                  {/* Do's and Don'ts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                    {/* Do's */}
                    <div style={{ background: 'rgba(82,212,138,0.06)', border: '1px solid rgba(82,212,138,0.18)', borderRadius: 16, padding: 20 }}>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#52d48a', marginBottom: 14 }}>
                        ✓ Do
                      </div>
                      {brief.culture.dos.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < brief.culture.dos.length - 1 ? '1px solid rgba(82,212,138,0.08)' : 'none' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(82,212,138,0.15)', border: '1px solid rgba(82,212,138,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#52d48a', flexShrink: 0, marginTop: 1 }}>✓</div>
                          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, fontStyle: 'italic', color: 'var(--moon-dim)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Don'ts */}
                    <div style={{ background: 'rgba(232,80,60,0.06)', border: '1px solid rgba(232,80,60,0.15)', borderRadius: 16, padding: 20 }}>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#e8504c', marginBottom: 14 }}>
                        ✗ Don't
                      </div>
                      {brief.culture.donts.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < brief.culture.donts.length - 1 ? '1px solid rgba(232,80,60,0.08)' : 'none' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(232,80,60,0.12)', border: '1px solid rgba(232,80,60,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#e8504c', flexShrink: 0, marginTop: 1 }}>✗</div>
                          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, fontStyle: 'italic', color: 'var(--moon-dim)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Context cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {brief.culture.contextCards.map((card) => (
                      <div key={card.title} style={{ background: 'var(--basalt-mid)', border: '1px solid rgba(232,238,245,0.07)', borderRadius: 14, padding: 16 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--lapis-deep)', border: '1px solid rgba(91,143,214,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>
                          {card.icon}
                        </div>
                        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 600, color: 'var(--moon)', marginBottom: 4 }}>{card.title}</div>
                        <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.5 }}>{card.body}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────────── */}
        <RightPanel
          sceneId={sceneId}
          scene={scene}
          brief={brief}
          cheatSheet={state.cheatSheet.filter((i) => i.sceneId === sceneId)}
          onRemove={(id) => dispatch({ type: 'REMOVE_FROM_CHEAT_SHEET', payload: id })}
        />
      </div>

      {/* ── BOTTOM ACTION BAR ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 220, right: 0,
        height: 80,
        background: 'rgba(16,16,16,0.97)',
        borderTop: '1px solid rgba(232,238,245,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 20,
      }}>
        {/* Status */}
        <div>
          {allVisited ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#52d48a' }}>
                ✓ Briefing complete
              </div>
              <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)' }}>
                You're ready for this scene
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--muted)' }}>
                Review all 4 sections to continue
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {ALL_TABS.map((tab) => (
                  <div
                    key={tab}
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: visitedTabs.includes(tab) ? 'var(--lapis-bright)' : 'var(--basalt-edge)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleBegin}
          animate={allVisited ? { scale: 1 } : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          style={{
            height: 52, padding: '0 36px',
            background: allVisited ? 'var(--lapis)' : 'var(--basalt-raised)',
            border: `1px solid ${allVisited ? 'rgba(91,143,214,0.35)' : 'rgba(232,238,245,0.1)'}`,
            borderRadius: 16,
            boxShadow: allVisited ? '0 0 24px rgba(42,82,152,0.3)' : 'none',
            cursor: allVisited ? 'pointer' : 'not-allowed',
            fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: allVisited ? 'var(--moon-bright)' : 'var(--muted)',
            transition: 'background 300ms, border-color 300ms, box-shadow 300ms, color 300ms',
          }}
          whileHover={allVisited ? { backgroundColor: 'var(--lapis-mid)', boxShadow: '0 0 40px rgba(42,82,152,0.5)' } : undefined}
        >
          I'm Ready →
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel({
  sceneId,
  scene,
  brief,
  cheatSheet,
  onRemove,
}: {
  sceneId: string
  scene: Scene
  brief: SceneBrief
  cheatSheet: CheatSheetItem[]
  onRemove: (id: string) => void
}) {
  const [showDuringScene, setShowDuringScene] = useState(true)

  const TYPE_COLORS: Record<string, string> = {
    vocab:         'var(--lapis-bright)',
    grammar:       '#52d48a',
    pronunciation: '#c9a84c',
  }

  const DIFFICULTY_FORECAST = [
    { label: 'Vocabulary load',    value: brief.difficulty.vocabulary },
    { label: 'Grammar complexity', value: brief.difficulty.grammar },
    { label: 'Speaking speed',     value: brief.difficulty.speakingSpeed },
    { label: 'Cultural nuance',    value: brief.difficulty.culturalNuance },
  ]

  return (
    <div style={{
      background: 'var(--basalt-mid)',
      borderLeft: '1px solid rgba(232,238,245,0.06)',
      padding: '32px 22px',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Cheat sheet builder */}
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--lapis-bright)', marginBottom: 4 }}>
        Your Cheat Sheet
      </div>
      <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 14 }}>
        Tap any word or structure to add it
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8, minHeight: 60 }}>
        {cheatSheet.length === 0 ? (
          <div style={{
            border: '1px dashed var(--basalt-edge)',
            borderRadius: 12, padding: 18, textAlign: 'center',
            fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)',
          }}>
            Tap vocab or grammar to add to your cheat sheet
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {cheatSheet.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  background: 'var(--basalt-raised)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[item.type] ?? 'var(--lapis-bright)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: 'var(--moon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.word}
                  </div>
                  <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.translation}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontSize: 12, color: 'var(--muted)', padding: 0, flexShrink: 0 }}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Available during scene label + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)' }}>
          Available during scene
        </div>
        <button
          onClick={() => setShowDuringScene((v) => !v)}
          style={{
            width: 32, height: 18, borderRadius: 9,
            background: showDuringScene ? 'var(--lapis)' : 'var(--basalt-edge)',
            border: 'none', cursor: 'pointer',
            position: 'relative', transition: 'background 200ms',
          }}
        >
          <div style={{
            position: 'absolute', top: 2,
            left: showDuringScene ? 16 : 2,
            width: 14, height: 14, borderRadius: '50%',
            background: 'white',
            transition: 'left 200ms',
          }} />
        </button>
      </div>

      <div style={{ height: 1, background: 'rgba(232,238,245,0.06)', margin: '20px 0' }} />

      {/* Difficulty forecast */}
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--lapis-bright)', marginBottom: 14 }}>
        Difficulty Forecast
      </div>
      {DIFFICULTY_FORECAST.map(({ label, value }) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--moon-dim)' }}>{label}</span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: 'var(--muted)' }}>{value}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--basalt-edge)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              style={{ height: '100%', background: 'var(--lapis)', borderRadius: 3 }}
            />
          </div>
        </div>
      ))}

      <div style={{ height: 1, background: 'rgba(232,238,245,0.06)', margin: '20px 0' }} />

      {/* Readiness check */}
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--lapis-bright)', marginBottom: 14 }}>
        Readiness Check
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--moon-dim)' }}>Your level</span>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: 'var(--moon-bright)', background: 'var(--lapis)', borderRadius: 8, padding: '3px 10px' }}>B1</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--moon-dim)' }}>Scene level</span>
          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--moon)' }}>{scene.level}</span>
        </div>
      </div>
      <div style={{ background: 'rgba(82,212,138,0.08)', border: '1px solid rgba(82,212,138,0.18)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: '#52d48a', lineHeight: 1.45 }}>
          Well matched — you're ready for this scene
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(232,238,245,0.06)', margin: '20px 0' }} />

      {/* Quick tips */}
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--lapis-bright)', marginBottom: 10 }}>
        Tips for this scene
      </div>
      {brief.culture.tips.map((tip: string, i: number) => (
        <div key={i} style={{
          display: 'flex', gap: 10, padding: '8px 0',
          borderBottom: i < brief.culture.tips.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none',
          alignItems: 'flex-start',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lapis-mid)', flexShrink: 0, marginTop: 5 }} />
          <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--moon-dim)', lineHeight: 1.5 }}>{tip}</span>
        </div>
      ))}
    </div>
  )
}
