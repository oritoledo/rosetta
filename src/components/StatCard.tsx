interface StatCardProps {
  value: string
  label: string
  trend?: string
}

export default function StatCard({ value, label, trend }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--basalt-mid)',
        border: '1px solid rgba(232,238,245,0.07)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}
    >
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--moon-bright)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--muted)',
          marginTop: '6px',
        }}
      >
        {label}
      </div>
      {trend && (
        <div
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '11px',
            fontStyle: 'italic',
            color: 'var(--lapis-bright)',
            marginTop: '6px',
          }}
        >
          {trend}
        </div>
      )}
    </div>
  )
}
