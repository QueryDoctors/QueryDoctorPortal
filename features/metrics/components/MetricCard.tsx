interface Props {
  label: string
  value: number | null
  unit?: string
  alert?: boolean
}

export function MetricCard({ label, value, unit, alert }: Props) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${alert ? 'text-red-400' : 'text-gray-100'}`}>
        {value !== null ? value.toLocaleString() : '—'}
        {value !== null && unit && (
          <span className="text-sm text-gray-500 ml-1">{unit}</span>
        )}
      </p>
    </div>
  )
}
