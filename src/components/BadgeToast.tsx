import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Badge } from '../types/achievements'
import { RARITY_CONFIG } from '../data/achievements'

interface BadgeToastProps {
  badge: Badge | null
  onDismiss: () => void
}

export default function BadgeToast({ badge, onDismiss }: BadgeToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!badge) return
    timerRef.current = setTimeout(onDismiss, 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [badge, onDismiss])

  const cfg = badge ? RARITY_CONFIG[badge.rarity] : null

  return (
    <AnimatePresence>
      {badge && cfg && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          onClick={onDismiss}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9999,
            cursor: 'pointer',
            maxWidth: '340px',
            width: '340px',
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '22px',
              background: `linear-gradient(135deg, ${cfg.color}44, transparent 60%)`,
              boxShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}`,
              pointerEvents: 'none',
            }}
          />

          {/* Main card */}
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(145deg, #0d1117 0%, #0a0d14 100%)',
              border: `1px solid ${cfg.border}`,
              borderRadius: '20px',
              padding: '20px 22px',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${cfg.color}18, transparent)`,
                pointerEvents: 'none',
              }}
            />

            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              {/* Rarity pill */}
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                }}
              >
                {badge.rarity}
              </span>

              <div style={{ flex: 1 }} />

              {/* Dismiss hint */}
              <span
                style={{
                  fontFamily: 'Public Sans, sans-serif',
                  fontSize: '8px',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                tap to dismiss
              </span>
            </div>

            {/* Badge content */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* Icon orb */}
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `radial-gradient(circle at 35% 35%, ${cfg.color}30, ${cfg.bg})`,
                  border: `1px solid ${cfg.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${cfg.glow}`,
                }}
              >
                {badge.icon}
              </motion.div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* "Badge Unlocked" eyebrow */}
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: cfg.color,
                    opacity: 0.8,
                    marginBottom: '4px',
                  }}
                >
                  Badge Unlocked
                </div>

                {/* Badge name */}
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    lineHeight: 1.1,
                    marginBottom: '5px',
                  }}
                >
                  {badge.name}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: '#64748b',
                    lineHeight: 1.4,
                  }}
                >
                  {badge.description}
                </div>
              </div>
            </div>

            {/* Flavour quote */}
            <div
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(16,185,129,0.1)',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: cfg.color,
                opacity: 0.75,
                letterSpacing: '0.02em',
              }}
            >
              {badge.flavorQuote}
            </div>

            {/* Progress bar (auto-dismiss) */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
                borderRadius: '0 0 20px 20px',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
