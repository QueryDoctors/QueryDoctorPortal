interface Props {
  severity: 'critical' | 'warning' | 'info'
}

const CLASSES: Record<Props['severity'], string> = {
  critical: 'bg-red-700 text-white animate-pulse',
  warning: 'bg-yellow-500 text-gray-900',
  info: 'bg-blue-500 text-white',
}

const LABELS: Record<Props['severity'], string> = {
  critical: 'CRITICAL',
  warning: 'WARNING',
  info: 'INFO',
}

export function SeverityBadge({ severity }: Props) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${CLASSES[severity]}`}
    >
      {LABELS[severity]}
    </span>
  )
}
