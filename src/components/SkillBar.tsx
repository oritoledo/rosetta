import { motion } from 'framer-motion'

interface SkillBarProps {
  label: string
  percent: number
  gradient: string
  index?: number
}

export default function SkillBar({ label, percent, gradient, index = 0 }: SkillBarProps) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(139,115,85,0.15)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            fontStyle: 'italic',
            color: '#3a3228',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '14px',
            color: '#1a1612',
          }}
        >
          {percent}%
        </span>
      </div>
      <div
        style={{
          height: '8px',
          background: 'rgba(139,115,85,0.12)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 + index * 0.08 }}
          style={{
            height: '100%',
            background: gradient,
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  )
}
