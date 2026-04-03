interface Props {
  status: 'healthy' | 'warning' | 'critical'
  pulse?: boolean
}

const COLOR: Record<Props['status'], string> = {
  healthy: 'bg-green-400',
  warning: 'bg-yellow-400',
  critical: 'bg-red-500',
}

export function StatusDot({ status, pulse = true }: Props) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${COLOR[status]} opacity-75`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${COLOR[status]}`}
      />
    </span>
  )
}
