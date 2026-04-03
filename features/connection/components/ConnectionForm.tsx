'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useConnectDb } from '../hooks/useConnectDb'
import { useConnectionStore } from '@/store/connection.store'
import { testConnection, connectDatabase } from '../services/connection.service'
import { setDbIdCookie } from '@/lib/cookies'
import type { ConnectFormValues, TestConnectionResult } from '../types/connection.types'

const schema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().min(1).max(65535),
  database: z.string().min(1, 'Database is required'),
  user: z.string().min(1, 'User is required'),
  password: z.string().min(1, 'Password is required'),
})

export function ConnectionForm() {
  const router = useRouter()
  const { connect, isLoading: isConnecting, error: connectError } = useConnectDb()
  const setConnection = useConnectionStore((s) => s.setConnection)
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null)

  const testMutation = useMutation({
    mutationFn: testConnection,
    onSuccess: (result) => setTestResult(result),
    onError: () =>
      setTestResult({ success: false, message: 'Could not reach the backend server' }),
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ConnectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { host: 'localhost', port: 5432 },
  })

  const handleTest = () => {
    const values = getValues()
    const parsed = schema.safeParse(values)
    if (!parsed.success) return
    setTestResult(null)
    testMutation.mutate(parsed.data)
  }

  const onSubmit = (values: ConnectFormValues) => {
    setTestResult(null)
    connect(values, {
      onSuccess: (result) => {
        setConnection(result.dbId)
        setDbIdCookie(result.dbId)          // persists across sessions via cookie
        router.push(`/dashboard/${result.dbId}`)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md">
      <Field label="Host" error={errors.host?.message}>
        <input {...register('host')} placeholder="localhost" />
      </Field>

      <Field label="Port" error={errors.port?.message}>
        <input {...register('port')} type="number" placeholder="5432" />
      </Field>

      <Field label="Database" error={errors.database?.message}>
        <input {...register('database')} placeholder="postgres" />
      </Field>

      <Field label="User" error={errors.user?.message}>
        <input {...register('user')} placeholder="postgres" />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input {...register('password')} type="password" placeholder="••••••••" />
      </Field>

      {/* Test result banner */}
      {testResult && (
        <div
          className={`flex items-start gap-2 px-3 py-2.5 rounded-md text-xs leading-relaxed ${
            testResult.success
              ? 'bg-green-950 border border-green-700 text-green-400'
              : 'bg-red-950 border border-red-800 text-red-400'
          }`}
        >
          <span className="shrink-0 mt-0.5">{testResult.success ? '✓' : '✕'}</span>
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Connect error */}
      {connectError && !testResult && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-md text-xs bg-red-950 border border-red-800 text-red-400">
          <span className="shrink-0 mt-0.5">✕</span>
          <span>{connectError.message}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          disabled={testMutation.isPending || isConnecting}
          onClick={handleTest}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 text-sm font-medium rounded-md transition-colors duration-100"
        >
          {testMutation.isPending ? 'Testing...' : 'Test Connection'}
        </button>

        <button
          type="submit"
          disabled={isConnecting || testMutation.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors duration-100"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactElement
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="[&_input]:w-full [&_input]:bg-gray-800 [&_input]:border [&_input]:border-gray-700 [&_input]:rounded-md [&_input]:px-3 [&_input]:py-1.5 [&_input]:text-sm [&_input]:text-gray-100 [&_input]:placeholder:text-gray-500 [&_input]:focus:outline-none [&_input]:focus:ring-1 [&_input]:focus:ring-blue-500">
        {children}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
