'use client'

interface Filter {
  label: string
  value: string
}

interface FilterBarProps {
  filters:  Filter[]
  active:   string
  onChange: (value: string) => void
}

export default function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div style={{
      display:    'flex',
      gap:        '8px',
      flexWrap:   'wrap',
      padding:    '0 0 1.5rem',
    }}>
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          style={{
            padding:      '6px 18px',
            borderRadius: '20px',
            fontSize:     '13px',
            fontFamily:   'inherit',
            cursor:       'pointer',
            transition:   'all 0.15s',
            background:   active === f.value ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
            color:        active === f.value ? '#fff'          : '#8884a0',
            border:       active === f.value
              ? '0.5px solid var(--accent)'
              : '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}