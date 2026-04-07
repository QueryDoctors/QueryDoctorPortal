import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useConnectionStore } from '@/store/connection.store'
import { clearAuthCookie, clearDbIdCookie } from '@/lib/cookies'
import { logoutUser } from '../services/auth.service'

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const { clearConnection } = useConnectionStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      // Always clear local state even if the request fails
      clearAuth()
      clearConnection()
      clearAuthCookie()
      clearDbIdCookie()
      queryClient.clear()
      router.replace('/login')
    },
  })

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
  }
}
