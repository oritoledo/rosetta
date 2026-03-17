import React from 'react'
import { ChatMessage } from '../data/mockConversation'

function renderWithErrors(
  text: string,
  errorWords: string[] = []
): React.ReactNode {
  if (!errorWords.length) return text

  const escaped = errorWords.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  const regex = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    errorWords.includes(part) ? (
      <span
        key={i}
        style={{
          color: '#e8a090',
          borderBottom: '1px dotted #e8a090',
          cursor: 'help',
        }}
        title="Click for a hint"
      >
        {part}
      </span>
    ) : (
      part
    )
  )
}

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  if (message.role === 'hint') {
    return (
      <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'rgba(42,82,152,0.12)',
            border: '1px solid rgba(91,143,214,0.18)',
            borderRadius: '20px',
            padding: '6px 18px',
          }}
        >
          <span
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--lapis-bright)',
            }}
          >
            {message.text}
          </span>
        </div>
      </div>
    )
  }

  if (message.role === 'ai') {
    return (
      <div style={{ alignSelf: 'flex-start', maxWidth: '65%' }}>
        <div
          style={{
            background: 'var(--basalt-mid)',
            border: '1px solid rgba(232,238,245,0.07)',
            borderRadius: '18px',
            borderBottomLeftRadius: '3px',
            padding: '14px 18px',
          }}
        >
          <p
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '14px',
              fontStyle: 'italic',
              color: 'var(--moon-dim)',
              lineHeight: '1.55',
              margin: 0,
            }}
          >
            {message.text}
          </p>
          {message.translation && (
            <p
              style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                borderTop: '1px solid rgba(232,238,245,0.05)',
                paddingTop: '8px',
                margin: 0,
                marginTop: '8px',
              }}
            >
              {message.translation}
            </p>
          )}
        </div>
      </div>
    )
  }

  // user bubble
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '65%' }}>
      <div
        style={{
          background: 'var(--lapis-deep)',
          border: '1px solid rgba(91,143,214,0.2)',
          borderRadius: '18px',
          borderBottomRightRadius: '3px',
          padding: '14px 18px',
          boxShadow: '0 2px 12px rgba(27,58,92,0.4)',
        }}
      >
        <p
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '14px',
            fontStyle: 'italic',
            color: 'var(--moon)',
            lineHeight: '1.55',
            margin: 0,
          }}
        >
          {renderWithErrors(message.text, message.errorWords)}
        </p>
      </div>
    </div>
  )
}
