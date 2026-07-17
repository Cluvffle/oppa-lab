'use client'

interface OptionSelectProps {
  name: string
  options: string[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  grid?: boolean
}

export default function OptionSelect({
  name,
  options,
  value,
  onChange,
  multi = false,
  grid = false,
}: OptionSelectProps) {
  const isSelected = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt

  const handleClick = (opt: string) => {
    if (multi) {
      const current = (value as string[]) || []
      onChange(
        current.includes(opt)
          ? current.filter((v) => v !== opt)
          : [...current, opt]
      )
    } else {
      onChange(opt)
    }
  }

  return (
    <div className={grid ? 'q-options q-options-grid' : 'q-options'}>
      {options.map((opt, i) => (
        <label
          key={i}
          className={`q-option${isSelected(opt) ? ' selected' : ''}`}
          onClick={(e) => { e.preventDefault(); handleClick(opt) }}
        >
          <input
            type={multi ? 'checkbox' : 'radio'}
            name={name}
            value={opt}
            checked={isSelected(opt)}
            onChange={() => {}}
            style={{ pointerEvents: 'none' }}
          />
          <span className="q-option-label">{opt}</span>
        </label>
      ))}
    </div>
  )
}
