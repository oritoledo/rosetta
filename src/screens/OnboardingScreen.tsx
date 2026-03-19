import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { useStore } from '../store/userStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'test' | 'analyzing' | 'result'
type Language = 'Italian' | 'Spanish' | 'French' | 'German'

interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  text: string
}

// ─── Mock AI conversation ─────────────────────────────────────────────────────

const AI_PROMPTS = [
  'Ciao! Sono Sofia. Come stai oggi? (Hi! I\'m Sofia. How are you today?)',
  'Bello! Da dove vieni? Sei qui in vacanza o per lavoro? (Nice! Where are you from? Are you here on holiday or for work?)',
  'Interessante! Hai mai visitato l\'Italia prima d\'ora? Cosa ti piacerebbe fare qui? (Interesting! Have you visited Italy before? What would you like to do here?)',
]

// ─── Level detection (mock) ───────────────────────────────────────────────────

function detectLevel(totalChars: number): { code: string; name: string; description: string } {
  if (totalChars < 30)  return { code: 'A1', name: 'Beginner',          description: "You're just starting out. We'll build your foundations word by word, scene by scene." }
  if (totalChars < 80)  return { code: 'A2', name: 'Elementary',        description: 'You can handle familiar topics and simple conversations. Let\'s build from here.' }
  if (totalChars < 150) return { code: 'B1', name: 'Intermediate',      description: 'You navigate everyday situations with growing confidence. Time to push further.' }
  if (totalChars < 250) return { code: 'B2', name: 'Upper Intermediate', description: 'You express yourself fluently on most topics. Nuance is your next frontier.' }
  if (totalChars < 400) return { code: 'C1', name: 'Advanced',          description: 'You speak with precision and flexibility. Let\'s refine the finer edges.' }
  return                       { code: 'C2', name: 'Mastery',            description: "You're near-native. We'll challenge you with culture, idiom, and register." }
}

const LANGUAGE_FLAGS: Record<Language, string> = {
  Italian: '🇮🇹',
  Spanish: '🇪🇸',
  French:  '🇫🇷',
  German:  '🇩🇪',
}

const FIRST_SCENES: Record<Language, { emoji: string; name: string }> = {
  Italian: { emoji: '☕', name: 'Ordering at a Café' },
  Spanish: { emoji: '🌮', name: 'Tapas Bar Order' },
  French:  { emoji: '🥐', name: 'Boulangerie Visit' },
  German:  { emoji: '🍺', name: 'Biergarten Chat' },
}

const FOCUS_AREAS: Record<string, string> = {
  A1: 'Basic greetings & numbers',
  A2: 'Present tense & common verbs',
  B1: 'Past tenses & connectors',
  B2: 'Subjunctive & nuance',
  C1: 'Idiomatic expressions',
  C2: 'Register & stylistic precision',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulsingDot() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--lapis-bright)',
        animation: 'dotPulse 1.4s ease-in-out infinite',
      }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const { dispatch } = useStore()

  const [phase, setPhase] = useState<Phase>('intro')
  const [selectedLang, setSelectedLang] = useState<Language>('Italian')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [aiPromptIndex, setAiPromptIndex] = useState(0)
  const [userResponses, setUserResponses] = useState<string[]>([])
  const [detectedLevel, setDetectedLevel] = useState<ReturnType<typeof detectLevel> | null>(null)
  const [analyzeScore, setAnalyzeScore] = useState(0)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(1)

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // When test phase starts — push first AI message after a short delay
  useEffect(() => {
    if (phase !== 'test') return
    const timer = setTimeout(() => {
      pushAiMessage(0)
    }, 600)
    return () => clearTimeout(timer)
  }, [phase])

  // When analyzing phase starts — count up score ring then move to result
  useEffect(() => {
    if (phase !== 'analyzing') return

    const totalChars = userResponses.join('').length
    const level = detectLevel(totalChars)
    setDetectedLevel(level)

    // Animate score value up
    const scoreTarget = Math.min(100, 40 + totalChars / 6)
    let current = 0
    const step = scoreTarget / 40
    const interval = setInterval(() => {
      current = Math.min(scoreTarget, current + step)
      setAnalyzeScore(Math.round(current))
      if (current >= scoreTarget) clearInterval(interval)
    }, 37)

    const timer = setTimeout(() => setPhase('result'), 2800)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [phase])

  function pushAiMessage(index: number) {
    const id = nextIdRef.current++
    setMessages((prev) => [...prev, { id, role: 'ai', text: AI_PROMPTS[index] }])
  }

  function handleSend() {
    const text = inputText.trim()
    if (!text) return

    const userMsg: ChatMessage = { id: nextIdRef.current++, role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')

    const newResponses = [...userResponses, text]
    setUserResponses(newResponses)

    const nextIndex = aiPromptIndex + 1

    if (nextIndex >= AI_PROMPTS.length) {
      // All 3 exchanges done → analyze
      setTimeout(() => setPhase('analyzing'), 800)
    } else {
      setAiPromptIndex(nextIndex)
      setTimeout(() => pushAiMessage(nextIndex), 900)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleBeginJourney() {
    if (!detectedLevel) return
    const user = {
      name: 'Alessandro',
      language: selectedLang,
      level: detectedLevel.code,
      onboardingComplete: true,
      startDate: Date.now(),
    }
    dispatch({ type: 'SET_USER', payload: user })
    localStorage.setItem('rosetta_user', JSON.stringify(user))
    navigate('/')
  }

  // ── Render phases ────────────────────────────────────────────────────────────

  const progressPct = phase === 'test'
    ? Math.round((userResponses.length / AI_PROMPTS.length) * 100)
    : 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        minHeight: '100dvh',
        overflow: 'auto',
      }}
    >
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(170deg, #0a1628, #0a0d14)',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Glyph */}
        <div
          style={{
            fontSize: '24px',
            color: 'var(--lapis-bright)',
            opacity: 0.6,
            marginBottom: '24px',
          }}
        >
          𓂀
        </div>

        {/* Logo */}
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '48px',
            fontWeight: 900,
            color: 'var(--moon-bright)',
            letterSpacing: '0.2em',
            lineHeight: 1,
          }}
        >
          ROSETTA
        </div>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginTop: '8px',
          }}
        >
          speak every tongue
        </div>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'rgba(52,211,153,0.3)',
            margin: '28px 0',
          }}
        />

        {/* Language selector */}
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--lapis-bright)',
            opacity: 0.7,
            marginBottom: '12px',
          }}
        >
          I want to learn
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {(Object.keys(LANGUAGE_FLAGS) as Language[]).map((lang) => {
            const selected = lang === selectedLang
            return (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                style={{
                  background: selected ? 'var(--lapis-deep)' : 'var(--basalt-mid)',
                  border: selected
                    ? '1px solid rgba(52,211,153,0.35)'
                    : '1px solid rgba(226,232,240,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: selected ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(52,211,153,0.25)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(226,232,240,0.08)'
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{LANGUAGE_FLAGS[lang]}</span>
                <span
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--moon)',
                  }}
                >
                  {lang}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--basalt)',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <AnimatePresence mode="wait">

          {/* ── PHASE: INTRO ── */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--moon)',
                  marginBottom: '8px',
                }}
              >
                Before we begin
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  marginBottom: '32px',
                }}
              >
                Let's find your level through conversation — not a quiz.
              </div>

              {[
                {
                  icon: '💬',
                  title: 'A short conversation',
                  desc: `Chat with Sofia for 2–3 minutes in any mix of English and ${selectedLang}`,
                },
                {
                  icon: '🎯',
                  title: 'We detect your level',
                  desc: 'Your vocabulary, grammar, and confidence automatically place you A1–C2',
                },
                {
                  icon: '⚡',
                  title: 'Jump straight in',
                  desc: 'Your first scenes and pace are personalised from the very first word',
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    marginBottom: '16px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--basalt-mid)',
                      border: '1px solid rgba(226,232,240,0.07)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '13px',
                        color: 'var(--moon)',
                        marginBottom: '2px',
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '12px',
                        fontStyle: 'italic',
                        color: 'var(--muted)',
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => setPhase('test')}
                whileHover={{
                  backgroundColor: 'var(--lapis-mid)',
                  boxShadow: '0 0 48px rgba(16,185,129,0.5)',
                }}
                transition={{ duration: 0.15 }}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  height: '56px',
                  background: 'var(--lapis)',
                  border: '1px solid rgba(52,211,153,0.35)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--moon-bright)',
                  boxShadow: '0 0 32px rgba(16,185,129,0.3)',
                }}
              >
                Start Placement Test →
              </motion.button>
            </motion.div>
          )}

          {/* ── PHASE: TEST ── */}
          {phase === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Progress bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ width: '100%', height: '3px', background: 'var(--basalt-edge)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ height: '100%', background: 'var(--lapis-bright)', borderRadius: '2px' }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--lapis-bright)',
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Analysing your {selectedLang}…
                  </div>
                </div>
              </div>

              {/* Guide header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--lapis-deep)',
                    border: '1px solid rgba(52,211,153,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  👩‍🦰
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '14px',
                        color: 'var(--moon)',
                      }}
                    >
                      Sofia is listening…
                    </span>
                    {/* Green pulse dot */}
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#52d48a',
                        display: 'inline-block',
                        boxShadow: '0 0 6px rgba(82,212,138,0.6)',
                        animation: 'micPulse 1.6s ease-in-out infinite',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: 'var(--lapis-bright)',
                      marginTop: '2px',
                    }}
                  >
                    Placement Test · {selectedLang}
                  </div>
                </div>
              </div>

              {/* Chat area */}
              <div
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '4px 0',
                }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '10px 14px',
                          borderRadius: msg.role === 'user'
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                          background: msg.role === 'user'
                            ? 'var(--lapis)'
                            : 'var(--basalt-mid)',
                          border: '1px solid',
                          borderColor: msg.role === 'user'
                            ? 'rgba(52,211,153,0.3)'
                            : 'rgba(226,232,240,0.07)',
                          fontFamily: 'Public Sans, sans-serif',
                          fontSize: '14px',
                          color: 'var(--moon)',
                          lineHeight: 1.55,
                        }}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Input bar */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response…"
                  style={{
                    flex: 1,
                    height: '48px',
                    background: 'var(--basalt-mid)',
                    border: '1px solid rgba(226,232,240,0.1)',
                    borderRadius: '12px',
                    padding: '0 16px',
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '15px',
                    color: 'var(--moon)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--lapis)',
                    border: '1px solid rgba(52,211,153,0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'var(--moon-bright)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--lapis-mid)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--lapis)'
                  }}
                >
                  ↑
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PHASE: ANALYZING ── */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0',
              }}
            >
              <ScoreRing score={analyzeScore} size={120} />

              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '16px',
                  color: 'var(--moon)',
                  marginTop: '20px',
                  marginBottom: '16px',
                }}
              >
                Analysing your {selectedLang}…
              </div>

              {/* Pulsing dots */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--lapis-bright)',
                      display: 'inline-block',
                      animation: `dotPulse 1.4s ease-in-out ${i * 0.22}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PHASE: RESULT ── */}
          {phase === 'result' && detectedLevel && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              {/* Level badge */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
                style={{
                  height: '80px',
                  background: 'var(--lapis-deep)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: '20px',
                  padding: '0 40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '48px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                    lineHeight: 1,
                  }}
                >
                  {detectedLevel.code}
                </span>
              </motion.div>

              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '18px',
                  color: 'var(--moon)',
                  marginBottom: '8px',
                }}
              >
                {detectedLevel.name}
              </div>
              <div
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '15px',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  maxWidth: '380px',
                  lineHeight: 1.55,
                  marginBottom: '24px',
                }}
              >
                {detectedLevel.description}
              </div>

              {/* Personalisation cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  width: '100%',
                  marginBottom: '28px',
                }}
              >
                {[
                  {
                    label: 'First scene',
                    emoji: FIRST_SCENES[selectedLang].emoji,
                    value: FIRST_SCENES[selectedLang].name,
                  },
                  {
                    label: 'Focus area',
                    emoji: '🎯',
                    value: FOCUS_AREAS[detectedLevel.code] ?? 'Core grammar',
                  },
                  {
                    label: 'Daily goal',
                    emoji: '⏱️',
                    value: '15 min · 2 scenes',
                  },
                ].map(({ label, emoji, value }) => (
                  <div
                    key={label}
                    style={{
                      background: 'var(--basalt-mid)',
                      border: '1px solid rgba(226,232,240,0.07)',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--muted)',
                        marginBottom: '8px',
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{emoji}</div>
                    <div
                      style={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '11px',
                        color: 'var(--moon)',
                        lineHeight: 1.4,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleBeginJourney}
                whileHover={{
                  backgroundColor: 'var(--lapis-mid)',
                  boxShadow: '0 0 48px rgba(16,185,129,0.5)',
                }}
                transition={{ duration: 0.15 }}
                style={{
                  width: '100%',
                  height: '56px',
                  background: 'var(--lapis)',
                  border: '1px solid rgba(52,211,153,0.35)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--moon-bright)',
                  boxShadow: '0 0 32px rgba(16,185,129,0.3)',
                }}
              >
                Begin Your Journey →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
