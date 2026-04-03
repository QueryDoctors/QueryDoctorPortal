import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onToggle: () => void
  label: string
  children: ReactNode
}

export function Collapsible({ open, onToggle, label, children }: Props) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-300 transition-colors duration-100"
      >
        <span>{label}</span>
        <span className="ml-2 text-gray-500">{open ? '▲' : '▼'}</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: open ? '12rem' : '0' }}
      >
        {children}
      </div>
    </div>
  )
}
