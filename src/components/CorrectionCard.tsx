export type CorrectionType = 'error' | 'good'

interface ErrorCard {
  type: 'error'
  category: string
  youSaid: string
  nativeForm: string
  rule: string
}

interface GoodCard {
  type: 'good'
  category: string
  text: string
}

export type CorrectionCardProps = ErrorCard | GoodCard

export default function CorrectionCard(props: CorrectionCardProps) {
  const isError = props.type === 'error'
  const accentColor = isError ? '#e8a090' : '#52d48a'
  const borderLeftColor = accentColor
  const borderColor = isError
    ? 'rgba(232,144,120,0.15)'
    : 'rgba(82,212,138,0.12)'

  return (
    <div
      style={{
        background: 'var(--basalt-raised)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '12px',
        borderLeft: `3px solid ${borderLeftColor}`,
        border: `1px solid ${borderColor}`,
        borderLeftWidth: '3px',
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: accentColor,
          marginBottom: '12px',
        }}
      >
        {props.category}
      </div>

      {isError && props.type === 'error' ? (
        <>
          {/* Comparison grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            {/* You said */}
            <div
              style={{
                background: 'rgba(232,144,120,0.08)',
                border: '1px solid rgba(232,144,120,0.15)',
                borderRadius: '10px',
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(232,144,120,0.5)',
                  marginBottom: '4px',
                }}
              >
                You said
              </div>
              <div
                style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'rgba(232,144,120,0.7)',
                }}
              >
                {props.youSaid}
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: 'var(--muted)', fontSize: '16px' }}>→</span>

            {/* Native form */}
            <div
              style={{
                background: 'rgba(91,143,214,0.08)',
                border: '1px solid rgba(91,143,214,0.15)',
                borderRadius: '10px',
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(91,143,214,0.5)',
                  marginBottom: '4px',
                }}
              >
                Native form
              </div>
              <div
                style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--moon)',
                }}
              >
                {props.nativeForm}
              </div>
            </div>
          </div>

          {/* Rule */}
          <div
            style={{
              borderTop: '1px solid rgba(232,238,245,0.06)',
              paddingTop: '10px',
              fontFamily: 'Crimson Pro, serif',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'var(--muted)',
              lineHeight: '1.6',
            }}
          >
            {props.rule}
          </div>
        </>
      ) : (
        <div
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--moon)',
            lineHeight: '1.6',
          }}
        >
          {props.type === 'good' ? props.text : ''}
        </div>
      )}
    </div>
  )
}
