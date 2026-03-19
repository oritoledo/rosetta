import { ActivityItem } from '../data/mockProgress'
import { getPersonaById } from '../data/personas'

interface ActivityRowProps {
  item: ActivityItem
}

function scoreBadgeStyle(score: number, status: ActivityItem['status']) {
  if (status === 'in-progress') {
    return {
      background: 'rgba(52,211,153,0.15)',
      color: 'var(--lapis-bright)',
      border: '1px solid rgba(52,211,153,0.25)',
    }
  }
  if (score >= 80) {
    return {
      background: 'rgba(16,185,129,0.2)',
      color: 'var(--lapis-bright)',
      border: '1px solid rgba(16,185,129,0.3)',
    }
  }
  if (score >= 60) {
    return {
      background: 'rgba(226,232,240,0.08)',
      color: 'var(--moon-dim)',
      border: '1px solid rgba(226,232,240,0.12)',
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
  const persona = getPersonaById(item.personaId)

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(16,185,129,0.1)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Icon box + persona avatar dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: '#e2e8f0',
            border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          {item.emoji}
        </div>
        {/* Persona avatar dot */}
        <div
          title={`Practiced with ${persona.name}`}
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: persona.avatarBg,
            border: `1.5px solid ${persona.avatarAccent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
          }}
        >
          {persona.emoji}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '13px',
            color: '#0d1117',
            marginBottom: '3px',
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '11px',
            fontStyle: 'italic',
            color: '#64748b',
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
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '11px',
          flexShrink: 0,
        }}
      >
        {badgeText}
      </div>
    </div>
  )
}
