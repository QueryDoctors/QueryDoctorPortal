import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConnectionStore {
  dbId: string | null
  connectionId: string | null

  setConnection: (dbId: string, connectionId?: string | null) => void
  clearConnection: () => void
}

export const useConnectionStore = create<ConnectionStore>()(
  persist(
    (set) => ({
      dbId: null,
      connectionId: null,

      setConnection: (dbId, connectionId = null) =>
        set({ dbId, connectionId }),

      clearConnection: () =>
        set({ dbId: null, connectionId: null }),
    }),
    {
      name: 'connection-store',
      // dbId persisted — but components must handle 404 (server restart = db_id lost)
      // and redirect to /connect on 404
    },
  ),
)
