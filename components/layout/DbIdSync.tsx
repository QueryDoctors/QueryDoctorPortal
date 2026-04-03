'use client'

import { useEffect } from 'react'
import { useConnectionStore } from '@/store/connection.store'

interface Props {
  dbId: string
}

/**
 * Syncs the db_id from the URL into the Zustand store.
 * Runs once on mount — allows Header and other components
 * that read the store to access the current db_id without prop drilling.
 */
export function DbIdSync({ dbId }: Props) {
  const setConnection = useConnectionStore((s) => s.setConnection)

  useEffect(() => {
    setConnection(dbId)
  }, [dbId, setConnection])

  return null
}
