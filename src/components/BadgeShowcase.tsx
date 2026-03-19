import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/userStore'
import { BADGES, RARITY_CONFIG, CATEGORY_CONFIG } from '../data/achievements'
import type { Badge, BadgeCategory, BadgeStoreView } from '../types/achievements'

// ─── Badge Card ───────────────────────────────────────────────────────────────

function BadgeCard({ badge, isUnlocked, storeView }: {
  badge: Badge
  isUnlocked: boolean
  storeView: BadgeStoreView
}) {
  const [hovered, setHovered] = useState(false)
  const cfg = RARITY_CONFIG[badge.rarity]
  const progress = badge.progress ? badge.progress(storeView) : null
  const progressPct = progress ? Math.min((progress.current / progress.total) * 100, 100) : 0
  const isHidden = badge.hidden && !isUnlocked

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.04 : 1 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '16px',
        background: isUnlocked
          ? `linear-gradient(145deg, #0d1117 0%, #0a0d14 100%)`
          : 'rgba(13,17,23,0.6)',
        border: `1px solid ${isUnlocked ? cfg.border : 'rgba(16,185,129,0.1)'}`,
        boxShadow: isUnlocked && hovered ? `0 0 24px ${cfg.glow}` : 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Rarity glow top strip for unlocked */}
      {isUnlocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: isUnlocked
            ? `radial-gradient(circle at 35% 35%, ${cfg.color}28, ${cfg.bg})`
            : 'rgba(16,185,129,0.05)',
          border: `1px solid ${isUnlocked ? cfg.border : 'rgba(16,185,129,0.08)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isHidden ? '18px' : '22px',
          marginBottom: '10px',
          filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.4)',
        }}
      >
        {isHidden ? '❓' : badge.icon}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          color: isUnlocked ? '#e2e8f0' : '#475569',
          marginBottom: '4px',
          lineHeight: 1.2,
        }}
      >
        {isHidden ? '???' : badge.name}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '11px',
          fontStyle: 'italic',
          color: isUnlocked ? '#64748b' : '#334155',
          lineHeight: 1.4,
          marginBottom: '10px',
        }}
      >
        {isHidden ? 'Keep playing to discover this badge' : badge.description}
      </div>

      {/* Rarity chip */}
      {!isHidden && (
        <span
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '8px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: isUnlocked ? cfg.color : '#475569',
            background: isUnlocked ? cfg.bg : 'rgba(16,185,129,0.05)',
            border: `1px solid ${isUnlocked ? cfg.border : 'rgba(16,185,129,0.08)'}`,
            borderRadius: '20px',
            padding: '2px 8px',
          }}
        >
          {badge.rarity}
        </span>
      )}

      {/* Progress bar (locked, visible, has progress) */}
      {!isUnlocked && !isHidden && progress && (
        <div style={{ marginTop: '10px' }}>
          <div
            style={{
              height: '3px',
              background: 'rgba(16,185,129,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: cfg.color,
                opacity: 0.5,
                borderRadius: '2px',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '8px',
              color: '#475569',
              marginTop: '4px',
              textAlign: 'right',
            }}
          >
            {progress.current} / {progress.total}
          </div>
        </div>
      )}

      {/* Unlocked checkmark */}
      {isUnlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: cfg.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
          }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

const CATEGORIES: BadgeCategory[] = [
  'first-steps',
  'streak',
  'scenes',
  'vocabulary',
  'grammar',
  'hidden',
]

export default function BadgeShowcase() {
  const { state } = useStore()
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all')
  const storeView = state as unknown as BadgeStoreView

  const unlockedIds = new Set(state.unlockedBadges.map((u) => u.badgeId))
  const unlockedCount = unlockedIds.size
  const totalCount = BADGES.length

  const filtered = activeCategory === 'all'
    ? BADGES
    : BADGES.filter((b) => b.category === activeCategory)

  return (
    <div>
      {/* Header stats */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #0a0d14 100%)',
          border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '32px',
              fontWeight: 700,
              color: '#c9a84c',
              lineHeight: 1,
            }}
          >
            {unlockedCount}
          </div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#64748b',
              marginTop: '4px',
            }}
          >
            Earned
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ height: '4px', background: 'rgba(16,185,129,0.12)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #c9a84c, #e8c96c)',
                borderRadius: '3px',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontSize: '11px',
              fontStyle: 'italic',
              color: '#475569',
              marginTop: '6px',
            }}
          >
            {unlockedCount} of {totalCount} badges unlocked
          </div>
        </div>

        <div
          style={{
            fontFamily: 'Public Sans, sans-serif',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          {totalCount - unlockedCount} remaining
        </div>
      </div>

      {/* Category filter */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {(['all', ...CATEGORIES] as const).map((cat) => {
          const active = activeCategory === cat
          const cfg = cat === 'all' ? null : CATEGORY_CONFIG[cat]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 12px',
                background: active ? '#0d1117' : 'transparent',
                border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.1)'}`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: active ? '#e2e8f0' : '#64748b',
                transition: 'all 150ms ease',
              }}
            >
              {cat === 'all' ? '✦ All' : `${cfg!.icon} ${cfg!.label}`}
            </button>
          )
        })}
      </div>

      {/* Badge grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {filtered.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <BadgeCard
                badge={badge}
                isUnlocked={unlockedIds.has(badge.id)}
                storeView={storeView}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
