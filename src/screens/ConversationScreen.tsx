import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import { mockConversation } from '../data/mockConversation'
import { scenes } from '../data/scenes'
import { useStore } from '../store/userStore'
import { CheatSheetItemType } from '../store/userStore'

const grammarTips = [
  {
    label: 'Polite Requests',
    text: "Use 'vorrei' (I would like) for polite requests — more natural than 'voglio' (I want) with strangers.",
  },
  {
    label: 'Placement',
    text: "'Per favore' goes at the end of the sentence in spoken Italian — 'Un caffè, per favore.'",
  },
  {
    label: 'Local Knowledge',
    text: "Italians say 'un caffè' not 'un espresso' — espresso is the default. Specify if you want anything else.",
  },
]

const vocabWords = [
  { word: 'cornetto', translation: 'croissant (Italian style)' },
  { word: 'sfogliatella', translation: 'shell-shaped pastry' },
  { word: 'al banco', translation: 'at the counter (standing)' },
  { word: 'a parte', translation: 'on the side / separately' },
]

const typeLabels: Record<CheatSheetItemType, string> = {
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  pronunciation: 'Pronunciation',
}

export default function ConversationScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const scene = (id && scenes[id]) ? scenes[id] : scenes.cafe
  const { state } = useStore()
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false)

  const sceneCheatSheet = state.cheatSheet.filter((i) => i.sceneId === scene.id)
  const allCheatSheet = state.cheatSheet

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setInputValue('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {/* LEFT — CHAT PANEL */}
        <div
          style={{
            background: 'var(--basalt)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid rgba(232,238,245,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--lapis-deep)',
                  border: '1.5px solid var(--lapis)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {scene.guide.emoji}
              </div>
              {/* Online dot */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#52d48a',
                  border: '2px solid var(--basalt)',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--moon)',
                  marginBottom: '2px',
                }}
              >
                {scene.guide.name}
              </div>
              <div
                style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'var(--lapis-bright)',
                }}
              >
                Scene in progress · {scene.language}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Cheat sheet toggle */}
              <button
                onClick={() => setCheatSheetOpen((o) => !o)}
                style={{
                  background: cheatSheetOpen ? 'rgba(42,82,152,0.25)' : 'none',
                  border: `1px solid ${cheatSheetOpen ? 'rgba(91,143,214,0.45)' : 'rgba(232,238,245,0.15)'}`,
                  borderRadius: '20px',
                  padding: '7px 16px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: cheatSheetOpen ? 'var(--lapis-bright)' : 'var(--moon-dim)',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📋 Cheat Sheet
                {allCheatSheet.length > 0 && (
                  <span
                    style={{
                      background: 'var(--lapis)',
                      color: 'var(--moon-bright)',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      fontSize: '9px',
                    }}
                  >
                    {allCheatSheet.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/debrief')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(232,238,245,0.15)',
                  borderRadius: '20px',
                  padding: '7px 16px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--moon-dim)',
                  transition: 'border-color 150ms ease',
                }}
              >
                End Scene
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {mockConversation.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: '20px 32px',
              borderTop: '1px solid rgba(232,238,245,0.06)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              {/* Mic button */}
              <button
                onClick={() => setIsRecording((r) => !r)}
                className={isRecording ? 'mic-recording' : ''}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: isRecording ? '#c04030' : 'var(--lapis)',
                  border: `1px solid ${isRecording ? 'rgba(192,64,48,0.5)' : 'rgba(91,143,214,0.4)'}`,
                  boxShadow: isRecording
                    ? '0 0 24px rgba(192,64,48,0.5)'
                    : '0 0 24px rgba(42,82,152,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 200ms ease',
                }}
              >
                🎙
              </button>

              {/* Text input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in Italian…"
                style={{
                  flex: 1,
                  height: '48px',
                  background: 'var(--basalt-mid)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  borderRadius: '28px',
                  padding: '0 20px',
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--moon)',
                  outline: 'none',
                }}
              />

              {/* Send button */}
              <button
                onClick={() => setInputValue('')}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--basalt-raised)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: inputValue.trim() ? 'var(--moon-dim)' : 'var(--muted)',
                  fontSize: '18px',
                  flexShrink: 0,
                  transition: 'color 150ms ease',
                }}
              >
                ↑
              </button>
            </div>

            <div
              style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: '10px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                marginTop: '8px',
                paddingLeft: '64px',
              }}
            >
              Press mic to speak or type your reply
            </div>
          </div>
        </div>

        {/* CHEAT SHEET SLIDE-IN PANEL */}
        <AnimatePresence>
          {cheatSheetOpen && (
            <motion.div
              key="cheat-sheet"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '100%',
                background: 'var(--basalt-mid)',
                borderLeft: '1px solid rgba(91,143,214,0.2)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: '20px 20px 16px',
                  borderBottom: '1px solid rgba(232,238,245,0.06)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    color: 'var(--lapis-bright)',
                    opacity: 0.7,
                    marginBottom: '4px',
                  }}
                >
                  Cheat Sheet
                </div>
                <div
                  style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                  }}
                >
                  {allCheatSheet.length === 0
                    ? 'No items saved yet'
                    : `${allCheatSheet.length} item${allCheatSheet.length !== 1 ? 's' : ''} saved`}
                </div>
              </div>

              {/* Panel content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {allCheatSheet.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '200px',
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontSize: '32px', opacity: 0.4 }}>📋</div>
                    <div
                      style={{
                        fontFamily: 'Crimson Pro, serif',
                        fontSize: '12px',
                        fontStyle: 'italic',
                        color: 'var(--muted)',
                        textAlign: 'center',
                        lineHeight: 1.5,
                      }}
                    >
                      Tap items in the Brief screen to add them to your cheat sheet
                    </div>
                  </div>
                ) : (
                  (['vocab', 'grammar', 'pronunciation'] as CheatSheetItemType[]).map((type) => {
                    const items = allCheatSheet.filter((i) => i.type === type)
                    if (items.length === 0) return null
                    return (
                      <div key={type} style={{ marginBottom: '20px' }}>
                        <div
                          style={{
                            fontFamily: 'Cinzel, serif',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.16em',
                            color: 'var(--lapis-bright)',
                            opacity: 0.6,
                            marginBottom: '8px',
                          }}
                        >
                          {typeLabels[type]}
                        </div>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              background: 'var(--basalt-raised)',
                              border: '1px solid rgba(232,238,245,0.06)',
                              borderRadius: '10px',
                              padding: '10px 12px',
                              marginBottom: '6px',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'Crimson Pro, serif',
                                fontSize: '14px',
                                fontStyle: 'italic',
                                color: 'var(--moon)',
                                marginBottom: '2px',
                              }}
                            >
                              {item.word}
                            </div>
                            <div
                              style={{
                                fontFamily: 'Crimson Pro, serif',
                                fontSize: '11px',
                                fontStyle: 'italic',
                                color: 'var(--muted)',
                              }}
                            >
                              {item.translation}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Scene-specific note */}
              {sceneCheatSheet.length < allCheatSheet.length && (
                <div
                  style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(232,238,245,0.06)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontSize: '10px',
                      fontStyle: 'italic',
                      color: 'var(--muted)',
                    }}
                  >
                    Showing all saved items ({sceneCheatSheet.length} from this scene)
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT — CONTEXT PANEL */}
        <div
          style={{
            background: 'var(--basalt-mid)',
            borderLeft: '1px solid rgba(232,238,245,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '28px',
          }}
        >
          {/* Current scene */}
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--lapis-bright)',
              opacity: 0.7,
              marginBottom: '10px',
            }}
          >
            Current scene
          </div>
          <div
            style={{
              background: 'var(--basalt-raised)',
              border: '1px solid rgba(232,238,245,0.07)',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '6px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{scene.emoji}</span>
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--moon)',
                }}
              >
                {scene.title}
              </div>
            </div>
            <div
              style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                marginBottom: '10px',
              }}
            >
              {scene.location}
            </div>
            <div
              style={{
                height: '4px',
                background: 'rgba(232,238,245,0.07)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '45%',
                  height: '100%',
                  background: 'var(--lapis-mid)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          {/* Live grammar tips */}
          <div style={{ marginTop: '24px' }}>
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--lapis-bright)',
                opacity: 0.7,
                marginBottom: '10px',
              }}
            >
              Live tips
            </div>
            {grammarTips.map((tip, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--basalt-raised)',
                  border: '1px solid rgba(232,238,245,0.07)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--lapis-bright)',
                    marginBottom: '4px',
                  }}
                >
                  {tip.label}
                </div>
                <div
                  style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: 'var(--moon-dim)',
                    lineHeight: '1.6',
                  }}
                >
                  {tip.text}
                </div>
              </div>
            ))}
          </div>

          {/* Vocabulary */}
          <div style={{ marginTop: '24px' }}>
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--lapis-bright)',
                opacity: 0.7,
                marginBottom: '10px',
              }}
            >
              New words this scene
            </div>
            {vocabWords.map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom:
                    i < vocabWords.length - 1
                      ? '1px solid rgba(232,238,245,0.05)'
                      : 'none',
                  padding: '8px 0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: 'var(--moon)',
                  }}
                >
                  {v.word}
                </span>
                <span
                  style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    textAlign: 'right',
                    maxWidth: '55%',
                  }}
                >
                  {v.translation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
