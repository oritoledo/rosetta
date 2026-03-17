import { ActivityItem } from '../data/mockProgress'

interface ActivityRowProps {
  item: ActivityItem
}

function scoreBadgeStyle(score: number, status: ActivityItem['status']) {
  if (status === 'in-progress') {
    return {
      background: 'rgba(91,143,214,0.15)',
      color: 'var(--lapis-bright)',
      border: '1px solid rgba(91,143,214,0.25)',
    }
  }
  if (score >= 80) {
    return {
      background: 'rgba(42,82,152,0.2)',
      color: 'var(--lapis-bright)',
      border: '1px solid rgba(42,82,152,0.3)',
    }
  }
  if (score >= 60) {
    return {
      background: 'rgba(232,238,245,0.08)',
      color: 'var(--moon-dim)',
      border: '1px solid rgba(232,238,245,0.12)',
    }
  }
  return {
    background: 'rgba(232,100,80,0.12)',
    color: '#e8a090',
    border: '1px solid rgba(232,100,80,0.2)',
  }
}

export default function ActivityRow({ item }: ActivityRowProps) {
  const badgeStyle = scoreBadgeStyle(item.score, item.status)
  const badgeText =
    item.status === 'in-progress' ? 'In Progress' : `${item.score}%`

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(139,115,85,0.12)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: '#f0ece4',
          border: '1px solid rgba(139,115,85,0.2)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}
      >
        {item.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
            color: '#1a1612',
            marginBottom: '3px',
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '11px',
            fontStyle: 'italic',
            color: '#8a7a68',
          }}
        >
          {item.timeAgo} · {item.language}
          {item.status === 'completed' && ` · ${item.score}% score`}
        </div>
      </div>

      {/* Score badge */}
      <div
        style={{
          ...badgeStyle,
          borderRadius: '8px',
          padding: '4px 10px',
          fontFamily: 'Cinzel, serif',
          fontSize: '11px',
          flexShrink: 0,
        }}
      >
        {badgeText}
      </div>
    </div>
  )
}
