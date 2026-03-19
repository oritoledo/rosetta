import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'

// ─── Types ────────────────────────────────────────────────────────────────────

type ExerciseType = 'fix' | 'fill' | 'match'
type FeedbackState = 'none' | 'correct' | 'incorrect'

interface FixExercise {
  type: 'fix'
  instruction: string
  sentence: string
  errorWord: string
  options: [string, string]
  correctIndex: 0 | 1
  rule: string
}

interface FillExercise {
  type: 'fill'
  sentence: string
  answer: string
  rule: string
}

interface MatchPair {
  italian: string
  english: string
}

interface MatchExercise {
  type: 'match'
  pairs: MatchPair[]
}

type Exercise = FixExercise | FillExercise | MatchExercise

// ─── Drill data by category ───────────────────────────────────────────────────

const DRILLS: Record<string, { title: string; subtitle: string; exercises: Exercise[] }> = {
  'verb-tense': {
    title: 'Condizionale vs Passato Prossimo',
    subtitle: '5-minute drill built from your actual mistakes',
    exercises: [
      {
        type: 'fix',
        instruction: 'Correct the verb tense in this sentence',
        sentence: 'Ho voluto ordinare un cornetto, per favore.',
        errorWord: 'Ho voluto ordinare',
        options: ['Vorrei ordinare', 'Ho voluto ordinare'],
        correctIndex: 0,
        rule: 'Use condizionale (vorrei) not passato prossimo for polite requests in restaurants and shops.',
      },
      {
        type: 'fill',
        sentence: 'Mi _____ tanto visitare il Colosseo.',
        answer: 'piacerebbe',
        rule: "'Piacere' in condizionale = 'piacerebbe' — expressing a wish or preference politely.",
      },
      {
        type: 'match',
        pairs: [
          { italian: 'Vorrei un caffè',       english: "I'd like a coffee" },
          { italian: 'Ho preso un caffè',     english: 'I had a coffee' },
          { italian: 'Potrei avere il conto', english: 'Could I have the bill?' },
          { italian: 'Ho pagato il conto',    english: 'I paid the bill' },
        ],
      },
      {
        type: 'fix',
        instruction: 'Which tense is correct here?',
        sentence: 'Ieri sono andato al mercato e _____ molte cose.',
        errorWord: '(select the correct verb)',
        options: ['ho comprato', 'comprerei'],
        correctIndex: 0,
        rule: 'For completed past events, use passato prossimo (ho comprato) not condizionale.',
      },
      {
        type: 'fill',
        sentence: '_____ venire alla festa domani sera?',
        answer: 'Potresti',
        rule: "'Potere' in condizionale (potresti) = 'could you' — a polite invitation or question.",
      },
    ],
  },
  'gender-agreement': {
    title: 'Noun Gender & Agreement',
    subtitle: 'Practice matching articles and adjectives',
    exercises: [
      {
        type: 'fix',
        instruction: 'Fix the gender agreement',
        sentence: 'Un bella giornata di sole!',
        errorWord: 'Un',
        options: ['Una bella giornata', 'Un bella giornata'],
        correctIndex: 0,
        rule: '"Giornata" is feminine — use "una" before feminine nouns starting with a consonant.',
      },
      {
        type: 'fill',
        sentence: 'Il cappuccino è molto _____.',
        answer: 'buono',
        rule: 'Adjectives agree in gender with the noun — "cappuccino" is masculine, so "buono" not "buona".',
      },
      {
        type: 'match',
        pairs: [
          { italian: 'il ragazzo',    english: 'the boy (masc.)' },
          { italian: 'la ragazza',    english: 'the girl (fem.)' },
          { italian: 'il libro',      english: 'the book (masc.)' },
          { italian: "l'amica",       english: 'the friend (fem.)' },
        ],
      },
      {
        type: 'fix',
        instruction: 'Choose the correct article',
        sentence: '_____ zaino è molto pesante.',
        errorWord: '(select article)',
        options: ['Lo', 'Il'],
        correctIndex: 0,
        rule: 'Use "lo" (not "il") before masculine nouns starting with z, ps, gn, or s+consonant.',
      },
      {
        type: 'fill',
        sentence: 'Questa _____ è molto buona.',
        answer: 'pizza',
        rule: '"Pizza" is feminine — the feminine demonstrative "questa" confirms the gender.',
      },
    ],
  },
  'word-order': {
    title: 'Italian Word Order',
    subtitle: 'Place words in their natural Italian position',
    exercises: [
      {
        type: 'fix',
        instruction: 'Fix the word order',
        sentence: 'Io sempre prendo il treno delle otto.',
        errorWord: 'Io sempre',
        options: ['Prendo sempre il treno', 'Io sempre prendo il treno'],
        correctIndex: 0,
        rule: 'Italian rarely starts a sentence with a subject pronoun. Frequency adverbs precede the main verb.',
      },
      {
        type: 'fill',
        sentence: 'Non _____ mai mangiato la pizza napoletana.',
        answer: 'ho',
        rule: "Negation + adverb + auxiliary: 'non ho mai' — never put 'mai' before 'non'.",
      },
      {
        type: 'match',
        pairs: [
          { italian: 'Mi piace molto',  english: 'I like it a lot' },
          { italian: 'Non lo so',       english: "I don't know it" },
          { italian: 'Ce lo dà',        english: 'He/she gives it to us' },
          { italian: 'Gliel\'ho detto', english: 'I told him/her it' },
        ],
      },
      {
        type: 'fix',
        instruction: 'Which sentence has the correct pronoun order?',
        sentence: 'Puoi _____ dare il libro?',
        errorWord: '(select the correct pronoun)',
        options: ['me lo', 'lo me'],
        correctIndex: 0,
        rule: "When combining pronouns, indirect object (me) comes before direct object (lo) — 'me lo'.",
      },
      {
        type: 'fill',
        sentence: 'A che ora _____ trovi domani?',
        answer: 'ci',
        rule: "Reflexive/reciprocal pronoun 'ci' (we meet each other) comes directly before the verb.",
      },
    ],
  },
}

const DEFAULT_DRILL = DRILLS['verb-tense']

// ─── Component ────────────────────────────────────────────────────────────────

export default function DrillScreen() {
  const navigate = useNavigate()
  const { category } = useParams<{ category: string }>()

  const drill = (category && DRILLS[category]) ? DRILLS[category] : DEFAULT_DRILL
  const exercises = drill.exercises

  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [fillValue, setFillValue] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [matchSelected, setMatchSelected] = useState<{ italian: number | null; english: number | null }>({ italian: null, english: null })
  const [matchCorrect, setMatchCorrect] = useState<Set<string>>(new Set())
  const [matchWrong, setMatchWrong] = useState<string | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  const ex = exercises[currentIndex]
  const progressPct = Math.round((currentIndex / exercises.length) * 100)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [done])

  function advanceOrFinish(wasCorrect: boolean) {
    if (wasCorrect) setSessionCorrect((n) => n + 1)
    setTimeout(() => {
      if (currentIndex + 1 >= exercises.length) {
        setDone(true)
      } else {
        setCurrentIndex((i) => i + 1)
        setFeedback('none')
        setFillValue('')
        setSelectedOption(null)
        setMatchSelected({ italian: null, english: null })
        setMatchCorrect(new Set())
        setMatchWrong(null)
      }
    }, 1200)
  }

  // ── Fix exercise handlers ────────────────────────────────────────────────────

  function handleFixSelect(index: number) {
    if (feedback !== 'none') return
    setSelectedOption(index)
    const fixEx = ex as FixExercise
    const correct = index === fixEx.correctIndex
    setFeedback(correct ? 'correct' : 'incorrect')
    advanceOrFinish(correct)
  }

  // ── Fill exercise handler ────────────────────────────────────────────────────

  function handleFillCheck() {
    if (feedback !== 'none') return
    const fillEx = ex as FillExercise
    const correct = fillValue.trim().toLowerCase() === fillEx.answer.toLowerCase()
    setFeedback(correct ? 'correct' : 'incorrect')
    advanceOrFinish(correct)
  }

  // ── Match exercise handler ───────────────────────────────────────────────────

  function handleMatchSelect(side: 'italian' | 'english', index: number, pairs: MatchPair[]) {
    const next = { ...matchSelected, [side]: index }
    setMatchSelected(next)
    if (next.italian !== null && next.english !== null) {
      const iWord = pairs[next.italian].italian
      const eWord = pairs[next.english].english
      const expected = pairs[next.italian].english
      if (eWord === expected) {
        const newCorrect = new Set(matchCorrect).add(iWord)
        setMatchCorrect(newCorrect)
        setMatchSelected({ italian: null, english: null })
        if (newCorrect.size === pairs.length) {
          setFeedback('correct')
          advanceOrFinish(true)
        }
      } else {
        setMatchWrong(iWord)
        setTimeout(() => {
          setMatchSelected({ italian: null, english: null })
          setMatchWrong(null)
        }, 600)
      }
    }
  }

  // ── Done screen ─────────────────────────────────────────────────────────────

  if (done) {
    const accuracy = Math.round((sessionCorrect / exercises.length) * 100)
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--basalt)',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '40px',
          gap: '0',
        }}
      >
        <ScoreRing score={accuracy} size={120} />

        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            marginTop: '24px',
            marginBottom: '8px',
          }}
        >
          Drill Complete
        </div>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '15px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginBottom: '28px',
          }}
        >
          Keep practising this pattern — it'll click soon.
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[
            { value: sessionCorrect, label: 'Correct', color: '#52d48a', bg: 'rgba(82,212,138,0.1)', border: 'rgba(82,212,138,0.25)' },
            { value: timeStr,        label: 'Time',    color: 'var(--lapis-bright)', bg: 'rgba(16,185,129,0.12)', border: 'rgba(52,211,153,0.25)' },
            { value: '🔥',           label: 'Streak maintained', color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)' },
          ].map(({ value, label, color, bg, border }) => (
            <div
              key={label}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '20px 24px', minWidth: '90px' }}
            >
              <div style={{ fontFamily: 'Public Sans, sans-serif', fontSize: '26px', fontWeight: 700, color, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontFamily: 'Public Sans, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginTop: '6px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ backgroundColor: 'var(--lapis-mid)', boxShadow: '0 0 48px rgba(16,185,129,0.5)' }}
          transition={{ duration: 0.15 }}
          style={{
            padding: '0 40px',
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
          Back to Practice →
        </motion.button>
      </motion.div>
    )
  }

  // ── Main drill layout ────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'var(--basalt)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 40px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '720px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--lapis-bright)',
              }}
            >
              Exercise {currentIndex + 1} of {exercises.length}
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--muted)',
              }}
            >
              {drill.title}
            </div>
          </div>
          <div style={{ height: '3px', background: 'var(--basalt-edge)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: 'var(--lapis-bright)', borderRadius: '2px' }}
            />
          </div>
        </div>

        {/* Exercise card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── TYPE A: Fix ── */}
            {ex.type === 'fix' && (() => {
              const fixEx = ex as FixExercise
              return (
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--muted)',
                      marginBottom: '20px',
                    }}
                  >
                    {fixEx.instruction}
                  </div>

                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '20px',
                      fontStyle: 'italic',
                      color: 'var(--moon)',
                      lineHeight: 1.6,
                      marginBottom: '28px',
                    }}
                  >
                    {fixEx.sentence.includes(fixEx.errorWord)
                      ? fixEx.sentence.split(fixEx.errorWord).map((part, i, arr) =>
                          i < arr.length - 1 ? (
                            <span key={i}>
                              {part}
                              <span
                                style={{
                                  textDecoration: 'underline dotted',
                                  textDecorationColor: '#e8a090',
                                  color: '#e8a090',
                                }}
                              >
                                {fixEx.errorWord}
                              </span>
                            </span>
                          ) : <span key={i}>{part}</span>
                        )
                      : fixEx.sentence
                    }
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {fixEx.options.map((opt, i) => {
                      let bg = 'var(--basalt-mid)'
                      let border = 'rgba(226,232,240,0.08)'
                      let color = 'var(--moon)'
                      if (selectedOption === i) {
                        if (i === fixEx.correctIndex) {
                          bg = 'rgba(82,212,138,0.12)'; border = 'rgba(82,212,138,0.35)'; color = '#52d48a'
                        } else {
                          bg = 'rgba(232,80,60,0.12)'; border = 'rgba(232,80,60,0.35)'; color = '#e8504c'
                        }
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleFixSelect(i)}
                          disabled={feedback !== 'none'}
                          style={{
                            padding: '18px 20px',
                            background: bg,
                            border: `1px solid ${border}`,
                            borderRadius: '14px',
                            cursor: feedback !== 'none' ? 'default' : 'pointer',
                            fontFamily: 'Public Sans, sans-serif',
                            fontSize: '16px',
                            color,
                            textAlign: 'left',
                            transition: 'all 150ms ease',
                          }}
                          onMouseEnter={(e) => {
                            if (feedback === 'none') {
                              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(52,211,153,0.3)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (feedback === 'none' && selectedOption !== i) {
                              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(226,232,240,0.08)'
                            }
                          }}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  <FeedbackBlock feedback={feedback} rule={fixEx.rule} />
                </div>
              )
            })()}

            {/* ── TYPE B: Fill ── */}
            {ex.type === 'fill' && (() => {
              const fillEx = ex as FillExercise
              return (
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '22px',
                      fontStyle: 'italic',
                      color: 'var(--moon)',
                      lineHeight: 1.6,
                      marginBottom: '28px',
                    }}
                  >
                    {fillEx.sentence}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      value={fillValue}
                      onChange={(e) => setFillValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleFillCheck() }}
                      disabled={feedback !== 'none'}
                      placeholder="Type the missing word…"
                      style={{
                        flex: 1,
                        height: '56px',
                        background: 'var(--basalt-mid)',
                        border: `1px solid ${
                          feedback === 'correct' ? 'rgba(82,212,138,0.4)'
                          : feedback === 'incorrect' ? 'rgba(232,80,60,0.4)'
                          : 'rgba(226,232,240,0.1)'
                        }`,
                        borderRadius: '12px',
                        padding: '0 20px',
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '16px',
                        color: 'var(--moon)',
                        outline: 'none',
                        transition: 'border-color 200ms ease',
                      }}
                    />
                    <button
                      onClick={handleFillCheck}
                      disabled={feedback !== 'none'}
                      style={{
                        padding: '0 28px',
                        height: '56px',
                        background: 'var(--lapis)',
                        border: '1px solid rgba(52,211,153,0.3)',
                        borderRadius: '12px',
                        cursor: feedback !== 'none' ? 'default' : 'pointer',
                        fontFamily: 'Public Sans, sans-serif',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--moon-bright)',
                        opacity: feedback !== 'none' ? 0.5 : 1,
                      }}
                    >
                      Check
                    </button>
                  </div>

                  <FeedbackBlock feedback={feedback} rule={fillEx.rule} correct={fillEx.answer} />
                </div>
              )
            })()}

            {/* ── TYPE C: Match ── */}
            {ex.type === 'match' && (() => {
              const matchEx = ex as MatchExercise
              return (
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--muted)',
                      marginBottom: '24px',
                    }}
                  >
                    Match the pairs
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Italian column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {matchEx.pairs.map((pair, i) => {
                        const isMatched = matchCorrect.has(pair.italian)
                        const isSelected = matchSelected.italian === i
                        const isWrong = matchWrong === pair.italian
                        return (
                          <button
                            key={i}
                            onClick={() => !isMatched && handleMatchSelect('italian', i, matchEx.pairs)}
                            style={{
                              padding: '14px 16px',
                              background: isMatched
                                ? 'rgba(82,212,138,0.12)'
                                : isWrong
                                ? 'rgba(232,80,60,0.12)'
                                : isSelected
                                ? 'rgba(16,185,129,0.25)'
                                : 'var(--basalt-mid)',
                              border: `1px solid ${
                                isMatched ? 'rgba(82,212,138,0.35)'
                                : isWrong ? 'rgba(232,80,60,0.35)'
                                : isSelected ? 'rgba(52,211,153,0.4)'
                                : 'rgba(226,232,240,0.08)'
                              }`,
                              borderRadius: '12px',
                              cursor: isMatched ? 'default' : 'pointer',
                              fontFamily: 'Public Sans, sans-serif',
                              fontSize: '15px',
                              fontStyle: 'italic',
                              color: isMatched ? '#52d48a' : isWrong ? '#e8504c' : 'var(--moon)',
                              textAlign: 'left',
                              transition: 'all 150ms ease',
                              opacity: isMatched ? 0.7 : 1,
                            }}
                          >
                            {pair.italian}
                          </button>
                        )
                      })}
                    </div>

                    {/* English column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {matchEx.pairs.map((pair, i) => {
                        const isMatched = matchCorrect.has(matchEx.pairs.find(p => p.english === pair.english)?.italian ?? '')
                        const isSelected = matchSelected.english === i
                        return (
                          <button
                            key={i}
                            onClick={() => !isMatched && handleMatchSelect('english', i, matchEx.pairs)}
                            style={{
                              padding: '14px 16px',
                              background: isMatched
                                ? 'rgba(82,212,138,0.12)'
                                : isSelected
                                ? 'rgba(16,185,129,0.25)'
                                : 'var(--basalt-mid)',
                              border: `1px solid ${
                                isMatched ? 'rgba(82,212,138,0.35)'
                                : isSelected ? 'rgba(52,211,153,0.4)'
                                : 'rgba(226,232,240,0.08)'
                              }`,
                              borderRadius: '12px',
                              cursor: isMatched ? 'default' : 'pointer',
                              fontFamily: 'Public Sans, sans-serif',
                              fontSize: '15px',
                              color: isMatched ? '#52d48a' : 'var(--moon)',
                              textAlign: 'left',
                              transition: 'all 150ms ease',
                              opacity: isMatched ? 0.7 : 1,
                            }}
                          >
                            {pair.english}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Feedback block ───────────────────────────────────────────────────────────

function FeedbackBlock({
  feedback,
  rule,
  correct,
}: {
  feedback: FeedbackState
  rule: string
  correct?: string
}) {
  return (
    <AnimatePresence>
      {feedback !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            marginTop: '16px',
            padding: '16px',
            background: feedback === 'correct'
              ? 'rgba(82,212,138,0.08)'
              : 'rgba(232,80,60,0.08)',
            border: `1px solid ${feedback === 'correct' ? 'rgba(82,212,138,0.25)' : 'rgba(232,80,60,0.25)'}`,
            borderRadius: '14px',
          }}
        >
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: feedback === 'correct' ? '#52d48a' : '#e8504c',
              marginBottom: '6px',
            }}
          >
            {feedback === 'correct' ? '✓ Correct' : '✗ Not quite'}
          </div>
          {correct && feedback === 'incorrect' && (
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '13px',
                color: 'var(--moon)',
                marginBottom: '6px',
              }}
            >
              Answer: {correct}
            </div>
          )}
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--moon-dim)',
              lineHeight: 1.5,
            }}
          >
            {rule}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
