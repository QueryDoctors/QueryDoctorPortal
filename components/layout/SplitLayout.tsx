import type { ReactNode } from 'react'

interface Props {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: Props) {
  return (
    <div className="flex flex-1 min-h-0">
      <div className="w-[70%] flex flex-col overflow-hidden border-r border-gray-800">
        {left}
      </div>
      <div className="w-[30%] flex flex-col overflow-hidden">
        {right}
      </div>
    </div>
  )
}
