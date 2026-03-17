interface SectionLabelProps {
  children: string
  dark?: boolean
}

export default function SectionLabel({ children, dark = false }: SectionLabelProps) {
  const labelColor = dark ? '#8a7a68' : 'var(--lapis-bright)'
  const lineColor = dark
    ? 'linear-gradient(90deg, rgba(139,115,85,0.2), transparent)'
    : 'linear-gradient(90deg, rgba(91,143,214,0.2), transparent)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span
        style={{
          fontFamily: 'Cinzel, serif',
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
