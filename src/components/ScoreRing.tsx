import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (score / 100) * circumference
  const gradientId = 'scoreRingGradient'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--lapis)" />
            <stop offset="100%" stopColor="var(--moon-bright)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--basalt-edge)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      {/* Score number overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--moon-bright)',
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted)',
            marginTop: '2px',
          }}
        >
          pts
        </span>
      </div>
    </div>
  )
}
