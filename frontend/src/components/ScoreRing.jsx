// Score Ring SVG component
export default function ScoreRing({ score, size = 120 }) {
  const radius = (size - 24) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 90) return '#059669' // Emerald
    if (s >= 80) return '#2563eb' // Blue
    if (s >= 70) return '#d97706' // Amber
    if (s >= 50) return '#ea580c' // Orange
    return '#dc2626' // Red
  }

  const color = getColor(score)
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth={8}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
          style={{ filter: `drop-shadow(0 2px 8px ${color}30)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold" style={{ fontSize: size * 0.22, color, lineHeight: 1 }}>{score}</span>
        <span className="text-xs font-semibold text-slate-400">/ 100</span>
        <span className="font-bold text-xs mt-0.5" style={{ color }}>{grade}</span>
      </div>
    </div>
  )
}
