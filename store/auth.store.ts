'use client'

import { create } from 'zustand'

interface AuthStore {
  /** Access token — in-memory only, never persisted (restored via /auth/refresh on mount) */
  accessToken: string | null
  userId: string | null
  email: string | null
  /** True once the silent-refresh attempt on app boot has settled (success or fail) */
  isInitialized: boolean

  setAuth: (accessToken: string, userId: string, email: string) => void
  /** Used when refresh only returns a new token (userId/email already in store) */
  setToken: (accessToken: string) => void
  clearAuth: () => void
  setInitialized: () => void
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  accessToken: null,
  userId: null,
  email: null,
  isInitialized: false,

  setAuth: (accessToken, userId, email) =>
    set({ accessToken, userId, email }),

  setToken: (accessToken) =>
    set({ accessToken }),

  clearAuth: () =>
    set({ accessToken: null, userId: null, email: null }),

  setInitialized: () => set({ isInitialized: true }),
}))
