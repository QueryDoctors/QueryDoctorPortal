interface Props {
  message: string
  description?: string
}

export function EmptyState({ message, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm font-medium text-gray-400">{message}</p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}
