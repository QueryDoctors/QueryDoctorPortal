import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomPanel } from '@/components/layout/BottomPanel'
import { DbIdSync } from '@/components/layout/DbIdSync'
import { ConnectionGuard } from '@/components/layout/ConnectionGuard'

interface Props {
  children: ReactNode
  params: Promise<{ db_id: string }>
}

export default async function DashboardLayout({ children, params }: Props) {
  const { db_id } = await params

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
      <DbIdSync dbId={db_id} />
      {/* Detects 404 (server restarted → db_id lost) → clears cookie → /connect */}
      <ConnectionGuard dbId={db_id} />
      <Header />
      <main className="flex flex-1 min-h-0">
        {children}
      </main>
      <BottomPanel />
    </div>
  )
}
