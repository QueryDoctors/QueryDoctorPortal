import type { IncidentStatus } from '../types/incident.types'

const CLASSES: Record<IncidentStatus, string> = {
  open: 'bg-orange-900/50 text-orange-300 border border-orange-700/50',
  investigating: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
  resolved: 'bg-gray-800/50 text-gray-400 border border-gray-700/50',
}

interface Props {
  status: IncidentStatus
}

export function IncidentStatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center text-xs font-medium capitalize px-1.5 py-0.5 rounded ${CLASSES[status]}`}>
      {status}
    </span>
  )
}
