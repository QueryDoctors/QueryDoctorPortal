'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useConnectionStore } from '@/store/connection.store'
import { useAuthStore } from '@/store/auth.store'
import { testConnection, connectDatabase } from '../services/connection.service'
import { saveConnection } from '../services/saved-connection.service'
import { setDbIdCookie } from '@/lib/cookies'
import { useSavedConnections, useDeleteSavedConnection } from '../hooks/useSavedConnections'
import { Spinner } from '@/components/ui/Spinner'
import type { ConnectFormValues, TestConnectionResult } from '../types/connection.types'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  host: z.string().min(1, 'Required'),
  port: z.coerce.number().int().min(1).max(65535),
  database: z.string().min(1, 'Required'),
  user: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
})

// ── Main modal ────────────────────────────────────────────────────────────────

interface Prefill {
  host: string
  port: number
  database: string
  user: string
}

export function ConnectDbModal() {
  const [tab, setTab] = useState<'new' | 'saved'>('new')
  const [prefill, setPrefill] = useState<Prefill | null>(null)
  const email = useAuthStore((s) => s.email)

  const handlePrefill = (values: Prefill) => {
    setPrefill(values)
    setTab('new')
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Connect to PostgreSQL</h2>
            {email && (
              <p className="mt-0.5 text-xs text-gray-500 truncate max-w-[260px]">{email}</p>
            )}
          </div>
          <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {(['new', 'saved'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors duration-100 ${
                tab === t
                  ? 'text-blue-400 border-b-2 border-blue-500 -mb-px bg-blue-950/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'new' ? 'New Connection' : 'Saved'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          {tab === 'new'
            ? <NewConnectionForm prefill={prefill} />
            : <SavedList onConnect={handlePrefill} />
          }
        </div>
      </div>
    </div>
  )
}

// ── New connection form ───────────────────────────────────────────────────────

function NewConnectionForm({ prefill }: { prefill: Prefill | null }) {
  const router = useRouter()
  const setConnection = useConnectionStore((s) => s.setConnection)
  const queryClient = useQueryClient()
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null)

  const testMutation = useMutation({
    mutationFn: testConnection,
    onSuccess: (r) => setTestResult(r),
    onError: () => setTestResult({ success: false, message: 'Could not reach server' }),
  })

  const connectMutation = useMutation({
    mutationFn: connectDatabase,
    onSuccess: async (result, variables) => {
      setConnection(result.dbId)
      setDbIdCookie(result.dbId)

      // Auto-save so it appears on next login (fire-and-forget, errors are non-fatal)
      const name = `${variables.database}@${variables.host}`
      saveConnection({
        name,
        host: variables.host,
        port: variables.port,
        database: variables.database,
        user: variables.user,
        password: variables.password,
      })
        .then(() => queryClient.invalidateQueries({ queryKey: ['saved-connections'] }))
        .catch((err) => {
          // 409/400 = duplicate name already saved — ignore
          console.warn('[ConnectDbModal] auto-save skipped:', err?.message ?? err)
        })

      queryClient.invalidateQueries()
      router.push(`/dashboard/${result.dbId}`)
    },
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ConnectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: prefill
      ? { host: prefill.host, port: prefill.port, database: prefill.database, user: prefill.user }
      : { host: 'localhost', port: 5432 },
  })

  const handleTest = () => {
    const parsed = schema.safeParse(getValues())
    if (!parsed.success) return
    setTestResult(null)
    testMutation.mutate(parsed.data)
  }

  const onSubmit = (values: ConnectFormValues) => {
    setTestResult(null)
    connectMutation.mutate(values)
  }

  const isBusy = testMutation.isPending || connectMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      {prefill && (
        <p className="text-xs text-blue-400 bg-blue-950/30 border border-blue-800/50 rounded-md px-3 py-2">
          Fields pre-filled from saved connection — enter your password to connect.
        </p>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <ModalField label="Host" error={errors.host?.message}>
            <input {...register('host')} placeholder="localhost" />
          </ModalField>
        </div>
        <ModalField label="Port" error={errors.port?.message}>
          <input {...register('port')} type="number" placeholder="5432" />
        </ModalField>
      </div>

      <ModalField label="Database" error={errors.database?.message}>
        <input {...register('database')} placeholder="postgres" />
      </ModalField>

      <div className="grid grid-cols-2 gap-3">
        <ModalField label="User" error={errors.user?.message}>
          <input {...register('user')} placeholder="postgres" />
        </ModalField>
        <ModalField label="Password" error={errors.password?.message}>
          <input {...register('password')} type="password" placeholder="••••••••" />
        </ModalField>
      </div>

      {/* Test result */}
      {testResult && (
        <div className={`flex items-start gap-2 px-3 py-2 rounded-md text-xs ${
          testResult.success
            ? 'bg-green-950/60 border border-green-800 text-green-400'
            : 'bg-red-950/60 border border-red-800 text-red-400'
        }`}>
          <span className="shrink-0">{testResult.success ? '✓' : '✕'}</span>
          {testResult.message}
        </div>
      )}

      {connectMutation.isError && !testResult && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-md text-xs bg-red-950/60 border border-red-800 text-red-400">
          <span className="shrink-0">✕</span>
          {connectMutation.error?.message}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={isBusy}
          onClick={handleTest}
          className="flex-1 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 text-xs font-medium transition-colors"
        >
          {testMutation.isPending ? 'Testing…' : 'Test'}
        </button>
        <button
          type="submit"
          disabled={isBusy}
          className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
        >
          {connectMutation.isPending ? 'Connecting…' : 'Connect'}
        </button>
      </div>
    </form>
  )
}

// ── Saved connections list ────────────────────────────────────────────────────

function SavedList({ onConnect }: { onConnect: (p: Prefill) => void }) {
  const { data, isLoading } = useSavedConnections()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="sm" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-gray-500">No saved connections yet.</p>
        <p className="mt-1 text-xs text-gray-600">
          Connect to a database first — it will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((conn) => (
        <SavedRow key={conn.id} connection={conn} onConnect={onConnect} />
      ))}
    </div>
  )
}

function SavedRow({
  connection,
  onConnect,
}: {
  connection: { id: string; name: string; host: string; port: number; database: string; user: string; lastUsed?: string | null }
  onConnect: (p: Prefill) => void
}) {
  const { deleteConnection, isLoading: isDeleting } = useDeleteSavedConnection()

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-800/50 hover:border-gray-700 transition-colors">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-gray-100 truncate">{connection.name}</span>
        <span className="text-xs text-gray-500">
          {connection.host}:{connection.port}/{connection.database}
        </span>
        {connection.lastUsed && (
          <span className="text-xs text-gray-600">
            {new Date(connection.lastUsed).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-3 shrink-0">
        <button
          type="button"
          onClick={() => onConnect({ host: connection.host, port: connection.port, database: connection.database, user: connection.user })}
          className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={() => deleteConnection(connection.id)}
          disabled={isDeleting}
          className="px-2.5 py-1 text-xs text-gray-500 hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          {isDeleting ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

// ── Field primitive ───────────────────────────────────────────────────────────

function ModalField({
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
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="[&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-gray-700 [&_input]:bg-gray-800 [&_input]:px-3 [&_input]:py-1.5 [&_input]:text-sm [&_input]:text-gray-100 [&_input]:placeholder:text-gray-600 [&_input]:focus:border-blue-500 [&_input]:focus:outline-none [&_input]:focus:ring-1 [&_input]:focus:ring-blue-500 [&_input]:transition-colors">
        {children}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
