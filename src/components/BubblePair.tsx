import { Message } from '../hooks/useClaude'

interface AIBubbleProps {
  message: Message
}

export function AIBubble({ message }: AIBubbleProps) {
  if (message.isStreaming && message.content === '') {
    return (
      <div
        style={{
          alignSelf: 'flex-start',
          background: 'var(--basalt-mid)',
          border: '1px solid rgba(232,238,245,0.07)',
          borderRadius: '16px',
          borderBottomLeftRadius: '3px',
          padding: '10px 14px',
          maxWidth: '85%',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          minWidth: '52px',
          minHeight: '38px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot"
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--moon-dim)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        background: 'var(--basalt-mid)',
        border: '1px solid rgba(232,238,245,0.07)',
        borderRadius: '16px',
        borderBottomLeftRadius: '3px',
        padding: '10px 14px',
        maxWidth: '85%',
      }}
    >
      <p
        style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'var(--moon-dim)',
          lineHeight: '1.5',
          margin: 0,
        }}
      >
        {message.content}
      </p>
      {message.translation && !message.isStreaming && (
        <p
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '10px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            borderTop: '1px solid rgba(232,238,245,0.05)',
            paddingTop: '5px',
            margin: 0,
            marginTop: '5px',
          }}
        >
          {message.translation}
        </p>
      )}
    </div>
  )
}

interface UserBubbleProps {
  content: string
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div
      style={{
        alignSelf: 'flex-end',
        background: 'var(--lapis-deep)',
        border: '1px solid rgba(91,143,214,0.2)',
        borderRadius: '16px',
        borderBottomRightRadius: '3px',
        padding: '10px 14px',
        maxWidth: '85%',
        boxShadow: '0 2px 12px rgba(27,58,92,0.3)',
      }}
    >
      <p
        style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'var(--moon)',
          lineHeight: '1.5',
          margin: 0,
        }}
      >
        {content}
      </p>
    </div>
  )
}
