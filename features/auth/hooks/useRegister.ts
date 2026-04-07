import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../services/auth.service'
import type { RegisterFormValues } from '../types/auth.types'

export function useRegister() {
  const mutation = useMutation({
    mutationFn: ({ email, password }: RegisterFormValues) =>
      registerUser(email, password),
  })

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
