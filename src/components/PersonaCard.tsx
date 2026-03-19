import { Persona } from '../data/personas'

interface PersonaCardProps {
  persona: Persona
  selected: boolean
  onSelect: (id: string) => void
  currentSceneId?: string
}

export default function PersonaCard({
  persona,
  selected,
  onSelect,
  currentSceneId,
}: PersonaCardProps) {
  const isBestFor = currentSceneId
    ? persona.bestFor.includes(currentSceneId)
    : false

  return (
    <div
      onClick={() => onSelect(persona.id)}
      style={{
        background: selected ? persona.avatarBg : 'var(--basalt-mid)',
        border: `1px solid ${selected ? `rgba(52,211,153,0.3)` : 'rgba(226,232,240,0.07)'}`,
        borderRadius: '14px',
        padding: '14px',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 16px rgba(16,185,129,0.25)' : 'none',
        transition: 'all 150ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor =
            'rgba(52,211,153,0.2)'
          ;(e.currentTarget as HTMLDivElement).style.transform =
            'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor =
            'rgba(226,232,240,0.07)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: persona.avatarBg,
            border: `1.5px solid ${persona.avatarAccent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
          }}
        >
          {persona.emoji}
        </div>

        {/* Info block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + role */}
          <div style={{ marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--moon)',
              }}
            >
              {persona.name}
            </span>
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                marginLeft: '6px',
              }}
            >
              {persona.role}
            </span>
          </div>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              marginBottom: '6px',
            }}
          >
            {persona.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--moon-dim)',
                  background: 'rgba(226,232,240,0.06)',
                  border: '1px solid rgba(226,232,240,0.08)',
                  borderRadius: '20px',
                  padding: '2px 7px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Difficulty + best-for */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '8px',
                color: persona.difficultyColor,
                fontWeight: 600,
              }}
            >
              {persona.difficultyLabel}
            </span>
            {isBestFor && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '9px',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#52d48a',
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                Best match
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--lapis-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: 'white',
          }}
        >
          ✓
        </div>
      )}
    </div>
  )
}
