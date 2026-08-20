// Score Ring SVG component
export default function ScoreRing({ score, size = 120 }) {
  const radius = (size - 24) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 90) return '#10b981'
    if (s >= 80) return '#3b82f6'
    if (s >= 70) return '#f59e0b'
    if (s >= 50) return '#f97316'
    return '#ef4444'
  }

  const color = getColor(score)
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(30,45,61,0.8)" strokeWidth={8}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold" style={{ fontSize: size * 0.22, color, lineHeight: 1 }}>{score}</span>
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>/ 100</span>
        <span className="font-bold text-xs mt-0.5" style={{ color }}>{grade}</span>
      </div>
    </div>
  )
}
