import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/userStore'
import { calculateNextReview } from '../hooks/useSM2'
import { VocabWord } from '../data/vocabulary'
import ScoreRing from '../components/ScoreRing'

type RatingScore = 0 | 3 | 4 | 5
type CardFace = 'front' | 'revealing' | 'back'

const SCENE_NAMES: Record<string, string> = {
  cafe:   'Café',
  market: 'Market',
  doctor: 'Doctor',
  train:  'Travel',
}

export default function ReviewScreen() {
  const navigate = useNavigate()
  const { state, dispatch } = useStore()

  const [queue, setQueue] = useState<VocabWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [face, setFace] = useState<CardFace>('front')
  const [sessionScores, setSessionScores] = useState<RatingScore[]>([])
  const [done, setDone] = useState(false)
  const [rotateY, setRotateY] = useState(0)

  // Build the review queue from the store on mount
  useEffect(() => {
    const due = state.reviewQueue.length > 0
      ? state.reviewQueue
      : state.vocabulary.slice(0, 6) // fallback if nothing is due
    setQueue(due)
  }, [])

  const currentWord = queue[currentIndex]
  const totalWords = queue.length
  const progressPct = totalWords > 0 ? Math.round((currentIndex / totalWords) * 100) : 0

  function handleReveal() {
    setFace('revealing')
    // flip animation: front → 90 deg
    setRotateY(90)
    setTimeout(() => {
      setFace('back')
      setRotateY(0) // 90 → 0 on back face
    }, 300)
  }

  function handleRate(score: RatingScore) {
    if (!currentWord) return

    const updated = calculateNextReview(currentWord, score)
    dispatch({ type: 'UPDATE_VOCAB_WORD', payload: updated })

    const newScores = [...sessionScores, score]
    setSessionScores(newScores)

    if (currentIndex + 1 >= totalWords) {
      setDone(true)
    } else {
      // Flip back to front for next card
      setRotateY(90)
      setTimeout(() => {
        setCurrentIndex((i) => i + 1)
        setFace('front')
        setRotateY(0)
      }, 300)
    }
  }

  // ── Session summary stats ─────────────────────────────────────────────────

  const mastered = sessionScores.filter((s) => s >= 4).length
  const needsWork = sessionScores.filter((s) => s < 4).length
  const accuracy = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0

  if (queue.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--basalt)',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '48px' }}>✨</div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', color: 'var(--moon)', fontWeight: 700 }}>
          All caught up!
        </div>
        <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: '16px', fontStyle: 'italic', color: 'var(--muted)' }}>
          No words due for review right now.
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '8px',
            padding: '12px 28px',
            background: 'var(--lapis)',
            border: '1px solid rgba(91,143,214,0.35)',
            borderRadius: '14px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--moon-bright)',
          }}
        >
          Back to Home →
        </button>
      </motion.div>
    )
  }

  // ── Done screen ─────────────────────────────────────────────────────────────

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--basalt)',
          flexDirection: 'column',
          gap: '0',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <ScoreRing score={accuracy} size={120} />

        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            marginTop: '24px',
            marginBottom: '8px',
          }}
        >
          Review Complete
        </div>
        <div
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginBottom: '28px',
          }}
        >
          Great session — keep the momentum going.
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[
            { value: mastered, label: 'Mastered', color: '#52d48a', bg: 'rgba(82,212,138,0.1)', border: 'rgba(82,212,138,0.25)' },
            { value: needsWork, label: 'Needs Work', color: '#e8504c', bg: 'rgba(232,80,60,0.1)', border: 'rgba(232,80,60,0.25)' },
            { value: totalWords, label: 'Total Reviewed', color: 'var(--lapis-bright)', bg: 'rgba(42,82,152,0.12)', border: 'rgba(91,143,214,0.25)' },
          ].map(({ value, label, color, bg, border }) => (
            <div
              key={label}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '16px',
                padding: '20px 24px',
                minWidth: '100px',
              }}
            >
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginTop: '6px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ backgroundColor: 'var(--lapis-mid)', boxShadow: '0 0 48px rgba(42,82,152,0.5)' }}
          transition={{ duration: 0.15 }}
          style={{
            padding: '0 40px',
            height: '56px',
            background: 'var(--lapis)',
            border: '1px solid rgba(91,143,214,0.35)',
            borderRadius: '16px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--moon-bright)',
            boxShadow: '0 0 32px rgba(42,82,152,0.3)',
          }}
        >
          Back to Learning →
        </motion.button>
      </motion.div>
    )
  }

  // ── Main review layout ───────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: '100dvh',
        }}
      >
        {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(170deg, #0d1e38, #060e1a)',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Progress */}
          <div
            style={{
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--lapis-bright)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Word {currentIndex + 1} of {totalWords}
            </div>
            <div style={{ height: '3px', background: 'var(--basalt-edge)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
                style={{ height: '100%', background: 'var(--lapis-bright)', borderRadius: '2px' }}
              />
            </div>
          </div>

          {/* Card with flip animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                textAlign: 'center',
                perspective: '1000px',
              }}
            >
              <motion.div
                animate={{ rotateY }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Word in target language */}
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '52px',
                    fontWeight: 700,
                    color: 'var(--moon-bright)',
                    lineHeight: 1.1,
                    marginBottom: '12px',
                  }}
                >
                  {currentWord?.word}
                </div>

                {/* Pronunciation */}
                {currentWord?.pronunciation && (
                  <div
                    style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontSize: '18px',
                      fontStyle: 'italic',
                      color: 'var(--muted)',
                      marginBottom: '16px',
                    }}
                  >
                    {currentWord.pronunciation}
                  </div>
                )}

                {/* Scene pill */}
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(42,82,152,0.2)',
                    border: '1px solid rgba(91,143,214,0.25)',
                    borderRadius: '20px',
                    padding: '4px 14px',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--lapis-bright)',
                    marginBottom: '32px',
                  }}
                >
                  {SCENE_NAMES[currentWord?.sceneId] ?? currentWord?.sceneId} scene
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Reveal button — only show on front */}
          {face === 'front' && (
            <motion.button
              onClick={handleReveal}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                border: '1px solid rgba(232,238,245,0.2)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--moon)',
                transition: 'border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(91,143,214,0.4)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232,238,245,0.2)'
              }}
            >
              Reveal translation
            </motion.button>
          )}
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--basalt)',
            borderLeft: '1px solid rgba(232,238,245,0.06)',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {face === 'front' ? (
              <motion.div
                key="front-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '18px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                  }}
                >
                  Try to recall the meaning before revealing.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back-content"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Translation */}
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: 'var(--moon)',
                    marginBottom: '12px',
                  }}
                >
                  {currentWord?.translation}
                </div>

                {/* Example sentence */}
                {currentWord?.exampleSentence && (
                  <div
                    style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontSize: '16px',
                      fontStyle: 'italic',
                      color: 'var(--muted)',
                      marginBottom: '28px',
                      lineHeight: 1.6,
                    }}
                  >
                    "{currentWord.exampleSentence}"
                  </div>
                )}

                {/* Rating prompt */}
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--muted)',
                    marginBottom: '14px',
                  }}
                >
                  How well did you know this?
                </div>

                {/* Rating buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {([
                    { label: 'Again', score: 0 as RatingScore, bg: 'rgba(232,80,60,0.15)',  border: 'rgba(232,80,60,0.3)',   color: '#e8504c' },
                    { label: 'Hard',  score: 3 as RatingScore, bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.25)', color: '#c9a84c' },
                    { label: 'Good',  score: 4 as RatingScore, bg: 'rgba(42,82,152,0.2)',   border: 'rgba(91,143,214,0.3)',  color: 'var(--lapis-bright)' },
                    { label: 'Easy',  score: 5 as RatingScore, bg: 'rgba(82,212,138,0.12)', border: 'rgba(82,212,138,0.25)', color: '#52d48a' },
                  ] as const).map(({ label, score, bg, border, color }) => (
                    <motion.button
                      key={label}
                      onClick={() => handleRate(score)}
                      whileHover={{ opacity: 0.85, scale: 1.02 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        flex: 1,
                        height: '56px',
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        fontFamily: 'Cinzel, serif',
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color,
                      }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
