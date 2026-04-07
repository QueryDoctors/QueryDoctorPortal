import type { IncidentSeverity } from '../types/incident.types'

const CLASSES: Record<IncidentSeverity, string> = {
  critical: 'bg-red-700 text-white animate-pulse',
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-gray-900',
  low: 'bg-blue-500 text-white',
}

const LABELS: Record<IncidentSeverity, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}

interface Props {
  severity: IncidentSeverity
}

export function IncidentSeverityBadge({ severity }: Props) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${CLASSES[severity]}`}
    >
      {LABELS[severity]}
    </span>
  )
}
