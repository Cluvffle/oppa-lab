'use client'

interface SliderInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function SliderInput({
  value,
  onChange,
  min = 1,
  max = 10,
}: SliderInputProps) {
  const displayValue = value || Math.floor((max - min) / 2) + min

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={displayValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="q-slider"
        style={{ width: '100%' }}
      />
      <div className="q-slider-labels">
        <span>😔 {min}점 (최하)</span>
        <span>{max}점 (최고) 😎</span>
      </div>
      <div className="q-slider-value">{displayValue}점</div>
    </div>
  )
}
