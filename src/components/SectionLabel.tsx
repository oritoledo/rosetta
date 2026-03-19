interface SectionLabelProps {
  children: string
  dark?: boolean
}

export default function SectionLabel({ children, dark = false }: SectionLabelProps) {
  const labelColor = dark ? '#64748b' : 'var(--lapis-bright)'
  const lineColor = dark
    ? 'linear-gradient(90deg, rgba(16,185,129,0.15), transparent)'
    : 'linear-gradient(90deg, rgba(52,211,153,0.2), transparent)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span
        style={{
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: labelColor,
          opacity: 0.7,
          flexShrink: 0,
        }}
      >
        {children}
      </span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: lineColor,
        }}
      />
    </div>
  )
}
