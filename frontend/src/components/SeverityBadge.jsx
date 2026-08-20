export default function SeverityBadge({ severity, small = false }) {
  const classes = {
    CRITICAL: 'severity-critical',
    HIGH: 'severity-high',
    MEDIUM: 'severity-medium',
    LOW: 'severity-low',
  }
  return (
    <span className={`inline-flex items-center gap-1 ${small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} rounded font-semibold ${classes[severity] || 'severity-low'}`}>
      {severity === 'CRITICAL' && '⚠ '}
      {severity}
    </span>
  )
}
