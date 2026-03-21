interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

export default function Toggle({ value, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={() => !disabled && onChange(!value)}
      style={{
        position: 'relative',
        width: 40,
        height: 22,
        borderRadius: 11,
        background: value ? 'var(--lapis)' : 'var(--basalt-edge)',
        border: value ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(232,238,245,0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 200ms ease, border-color 200ms ease',
        flexShrink: 0,
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 20 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'var(--moon-bright)',
          transition: 'left 200ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  )
}
