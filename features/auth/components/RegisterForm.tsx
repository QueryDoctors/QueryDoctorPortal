'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '../hooks/useRegister'

const schema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type FormValues = z.infer<typeof schema>

interface Props {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: Props) {
  const { register: registerUser, isLoading, isSuccess, error, reset } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    reset()
    registerUser(values, {
      onSuccess: () => {
        // Redirect to login after account creation
        setTimeout(onSwitchToLogin, 800)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Confirm password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
          {error.message}
        </p>
      )}

      {isSuccess && (
        <p className="rounded-md border border-green-800 bg-green-950/40 px-3 py-2 text-xs text-green-400">
          Account created — redirecting to sign in…
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || isSuccess}
        className="mt-1 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
