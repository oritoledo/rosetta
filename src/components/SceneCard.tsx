import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Scene } from '../data/scenes'
import { useStore } from '../store/userStore'

interface SceneCardProps {
  scene: Scene
}

const levelColors = {
  Beginner: {
    bg: 'rgba(16,185,129,0.18)',
    color: 'var(--lapis-bright)',
    border: 'rgba(16,185,129,0.3)',
  },
  Intermediate: {
    bg: 'rgba(180,140,40,0.15)',
    color: '#d4a830',
    border: 'rgba(180,140,40,0.25)',
  },
  Advanced: {
    bg: 'rgba(180,60,50,0.15)',
    color: '#d47060',
    border: 'rgba(180,60,50,0.25)',
  },
}

export default function SceneCard({ scene }: SceneCardProps) {
  const navigate = useNavigate()
  const { state } = useStore()
  const lvl = levelColors[scene.level]

  // Count vocab words for this scene that are due for review
  const dueWordsForScene = state.reviewQueue.filter((w) => w.sceneId === scene.id)
  const dueCount = dueWordsForScene.length
  const hasDue = dueCount > 0

  return (
    <motion.div
      onClick={() => navigate(`/scene/${scene.id}`)}
      initial={false}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', borderColor: hasDue ? 'rgba(52,211,153,0.45)' : 'rgba(52,211,153,0.25)' }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--basalt-mid)',
        border: hasDue
          ? '1px solid rgba(52,211,153,0.22)'
          : '1px solid rgba(226,232,240,0.06)',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: hasDue ? '0 0 16px rgba(16,185,129,0.12)' : 'none',
      }}
    >
      {/* Color strip */}
      <div
        style={{
          height: '80px',
          background: scene.bgGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '36px',
            filter: `drop-shadow(0 0 16px ${scene.emojiShadow})`,
          }}
        >
          {scene.emoji}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--moon)',
            marginBottom: '4px',
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '11px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginBottom: '10px',
          }}
        >
          {scene.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              background: lvl.bg,
              border: `1px solid ${lvl.border}`,
              color: lvl.color,
              borderRadius: '20px',
              padding: '3px 10px',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {scene.level}
          </span>
          <span
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '10px',
              fontStyle: 'italic',
              color: 'var(--muted)',
            }}
          >
            {scene.duration}
          </span>
        </div>
      </div>

      {/* Vocab due indicator */}
      {hasDue && (
        <div
          style={{
            padding: '8px 16px 0',
          }}
        >
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '10px',
              fontStyle: 'italic',
              color: 'var(--lapis-bright)',
            }}
          >
            📚 {dueCount} word{dueCount !== 1 ? 's' : ''} due for review
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div style={{ padding: '10px 16px 14px', marginTop: hasDue ? '6px' : '10px' }}>
        {scene.progress !== undefined ? (
          <div>
            <div
              style={{
                height: '3px',
                background: 'rgba(226,232,240,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${scene.progress}%`,
                  background: 'var(--lapis-mid)',
                  borderRadius: '2px',
                }}
              />
            </div>
            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '9px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                marginTop: '4px',
              }}
            >
              {scene.progress}% complete
            </div>
          </div>
        ) : (
          <span
            style={{
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '8px',
              padding: '3px 10px',
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--lapis-bright)',
            }}
          >
            New
          </span>
        )}
      </div>
    </motion.div>
  )
}
