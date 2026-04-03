interface Props {
  message: string
  retry?: () => void
}

export function ErrorMessage({ message, retry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm text-gray-400">{message}</p>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-100"
        >
          Retry
        </button>
      )}
    </div>
  )
}
