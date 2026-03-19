import { Stamp } from '../data/mockProgress'

interface StampGridProps {
  stamps: Stamp[]
  columns?: number
}

export default function StampGrid({ stamps, columns = 4 }: StampGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '10px',
        marginTop: '16px',
      }}
    >
      {stamps.map((stamp) => {
        const isDone = stamp.state === 'done'
        const isOpen = stamp.state === 'open'

        return (
          <div
            key={stamp.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 6px',
              borderRadius: '12px',
              background: isDone ? '#0d1117' : 'transparent',
              border: isDone
                ? '1px solid rgba(52,211,153,0.2)'
                : isOpen
                ? '1px dashed rgba(16,185,129,0.2)'
                : '1px solid rgba(16,185,129,0.08)',
              cursor: isOpen ? 'pointer' : 'default',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                filter: isDone ? 'none' : 'grayscale(100%)',
                opacity: isDone ? 1 : isOpen ? 0.2 : 0.12,
              }}
            >
              {stamp.emoji}
            </span>
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: isDone
                  ? 'rgba(226,232,240,0.5)'
                  : 'rgba(139,115,85,0.4)',
                textAlign: 'center',
              }}
            >
              {stamp.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
