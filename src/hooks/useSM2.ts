import { VocabWord } from '../data/vocabulary'

/**
 * SM-2 spaced repetition algorithm.
 * score: 0–2 = failed recall, 3 = hard, 4 = good, 5 = easy
 */
export function calculateNextReview(
  word: VocabWord,
  score: 0 | 1 | 2 | 3 | 4 | 5,
): VocabWord {
  let { repetitions, interval, easeFactor } = word

  if (score < 3) {
    // Failed — reset
    repetitions = 0
    interval = 1
  } else {
    // Passed — advance
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  }

  // Update ease factor (clamped at 1.3 minimum)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02),
  )

  const nextReview = Date.now() + interval * 86_400_000

  return { ...word, repetitions, interval, easeFactor, nextReview, lastScore: score }
}

/** Words due for review right now */
export function getDueWords(vocab: VocabWord[]): VocabWord[] {
  const now = Date.now()
  return vocab.filter((w) => w.nextReview <= now)
}
