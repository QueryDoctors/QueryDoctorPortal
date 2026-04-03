interface Props {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export function TabGroup({ tabs, active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-100 ${
            tab === active
              ? 'border-b-2 border-blue-400 text-gray-100'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
