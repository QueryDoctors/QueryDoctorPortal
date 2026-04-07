import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { setAuthCookie } from '@/lib/cookies'
import { loginUser } from '../services/auth.service'
import type { LoginFormValues } from '../types/auth.types'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => loginUser(values),
    onSuccess: (result) => {
      setAuth(result.accessToken, result.userId, result.email)
      setAuthCookie()
      router.replace('/connect')
    },
  })

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
