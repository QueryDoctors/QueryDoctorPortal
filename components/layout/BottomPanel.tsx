'use client'

import { Collapsible } from '@/components/ui/Collapsible'
import { useAlertStore } from '@/store/alert.store'
import { LogsPanel } from '@/features/logs/components/LogsPanel'

export function BottomPanel() {
  const { bottomPanelOpen, toggleBottomPanel } = useAlertStore()

  return (
    <div className="bg-gray-900 border-t border-gray-800 shrink-0">
      <Collapsible
        open={bottomPanelOpen}
        onToggle={toggleBottomPanel}
        label="Live Logs"
      >
        <div className="h-48">
          <LogsPanel />
        </div>
      </Collapsible>
    </div>
  )
}
