interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--basalt-raised)',
        border: '1px solid rgba(232,238,245,0.08)',
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '5px 10px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              background: active ? 'var(--lapis-deep)' : 'transparent',
              color: active ? 'var(--moon-bright)' : 'var(--muted)',
              fontFamily: 'Cinzel, serif',
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              transition: 'background 150ms ease, color 150ms ease',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
