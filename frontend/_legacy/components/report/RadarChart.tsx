'use client'

/**
 * 6축 매력 레이더 차트 (SVG).
 * 점수는 0~100. 핑크/퍼플 테마(globals.css CSS 변수)와 동일한 색을 사용한다.
 *
 * 사용 예:
 *   <RadarChart axes={[
 *     { key: 'A', label: '외형 매력', score: 55 },
 *     ...6개
 *   ]} />
 */

export interface RadarAxis {
  key: string
  label: string
  score: number // 0~100
}

interface RadarChartProps {
  axes?: RadarAxis[]
  size?: number
}

const DEFAULT_AXES: RadarAxis[] = [
  { key: 'A', label: '외형 매력', score: 55 },
  { key: 'B', label: '자기관리', score: 40 },
  { key: 'C', label: '대화·호감력', score: 33 },
  { key: 'D', label: '사회성·기회', score: 27 },
  { key: 'E', label: '안정성', score: 73 },
  { key: 'F', label: '마인드셋', score: 33 },
]

export default function RadarChart({ axes = DEFAULT_AXES, size = 380 }: RadarChartProps) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.33
  const n = axes.length

  // A를 12시 방향에 두고 시계방향으로 배치
  const angle = (i: number) => ((-90 + (360 / n) * i) * Math.PI) / 180
  const point = (i: number, v: number): [number, number] => [
    cx + (R * v) / 100 * Math.cos(angle(i)),
    cy + (R * v) / 100 * Math.sin(angle(i)),
  ]
  const poly = (v: number) =>
    axes.map((_, i) => point(i, v).join(',')).join(' ')
  const dataPoly = axes.map((a, i) => point(i, a.score).join(',')).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="매력 6축 레이더 차트"
    >
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--pink-400, #FF6B9D)" />
          <stop offset="100%" stopColor="var(--purple, #C084FC)" />
        </linearGradient>
      </defs>

      {/* 배경 그리드 링 */}
      {[20, 40, 60, 80, 100].map((v) => (
        <polygon
          key={v}
          points={poly(v)}
          fill="none"
          stroke="var(--pink-200, #FFC2D8)"
          strokeOpacity={0.7}
          strokeWidth={1}
        />
      ))}

      {/* 축 스포크 + 라벨 */}
      {axes.map((ax, i) => {
        const [x, y] = point(i, 100)
        const [lx, ly] = point(i, 116)
        return (
          <g key={ax.key}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--pink-200, #FFC2D8)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight={700}
              fill="var(--purple-dark, #9B59B6)"
            >
              {ax.key}
            </text>
          </g>
        )
      })}

      {/* 데이터 폴리곤 */}
      <polygon
        points={dataPoly}
        fill="url(#radarFill)"
        fillOpacity={0.35}
        stroke="var(--pink-500, #FF4785)"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {axes.map((ax, i) => {
        const [x, y] = point(i, ax.score)
        return (
          <circle key={ax.key} cx={x} cy={y} r={3.5} fill="var(--pink-500, #FF4785)" />
        )
      })}
    </svg>
  )
}
