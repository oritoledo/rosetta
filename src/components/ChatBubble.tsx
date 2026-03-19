import React from 'react'
import { motion } from 'framer-motion'
import { ChatMessage } from '../data/mockConversation'
import { TTSHook } from '../hooks/useSpeech'

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
  tts?: TTSHook
  ttsLang?: string
}

export default function ChatBubble({ message, tts, ttsLang = 'it-IT' }: ChatBubbleProps) {
  if (message.role === 'hint') {
    return (
      <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(52,211,153,0.18)',
            borderRadius: '20px',
            padding: '6px 18px',
          }}
        >
          <span
            style={{
              fontFamily: 'Public Sans, sans-serif',
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
    const bubbleId = `bubble-${message.id}`
    const isActivelySpeaking = tts?.activeSpeakingId === bubbleId

    return (
      <div style={{ alignSelf: 'flex-start', maxWidth: '65%', position: 'relative' }}>
        <div
          style={{
            background: 'var(--basalt-mid)',
            border: `1px solid ${isActivelySpeaking ? 'rgba(16,185,129,0.3)' : 'rgba(226,232,240,0.07)'}`,
            borderRadius: '18px',
            borderBottomLeftRadius: '3px',
            padding: '14px 18px',
            boxShadow: isActivelySpeaking
              ? '0 0 12px rgba(16,185,129,0.2)'
              : 'none',
            transition: 'border-color 200ms, box-shadow 200ms',
          }}
        >
          <p
            style={{
              fontFamily: 'Public Sans, sans-serif',
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
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                borderTop: '1px solid rgba(226,232,240,0.05)',
                paddingTop: '8px',
                margin: 0,
                marginTop: '8px',
              }}
            >
              {message.translation}
            </p>
          )}
        </div>

        {/* TTS speaker button + equalizer */}
        {tts && (
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {/* Equalizer bars when speaking */}
            {isActivelySpeaking && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                {[8, 12, 6].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [h, h * 0.4, h * 1.3, h * 0.6, h] }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.15,
                    }}
                    style={{
                      width: '2px',
                      height: h,
                      background: 'var(--lapis-bright)',
                      borderRadius: '1px',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Speaker button */}
            <button
              onClick={() => {
                if (isActivelySpeaking) {
                  tts.stop()
                } else {
                  tts.speak(message.text, ttsLang, { id: bubbleId })
                }
              }}
              title={isActivelySpeaking ? 'Stop' : 'Listen'}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isActivelySpeaking ? 'var(--lapis)' : 'var(--basalt-raised)',
                border: '1px solid rgba(226,232,240,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                flexShrink: 0,
                transition: 'background 150ms ease',
              }}
            >
              {isActivelySpeaking ? '⏹' : '🔊'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // user bubble
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '65%' }}>
      <div
        style={{
          background: 'var(--lapis-deep)',
          border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: '18px',
          borderBottomRightRadius: '3px',
          padding: '14px 18px',
          boxShadow: '0 2px 12px rgba(27,58,92,0.4)',
        }}
      >
        <p
          style={{
            fontFamily: 'Public Sans, sans-serif',
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
