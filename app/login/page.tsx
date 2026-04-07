'use client'

import { useState } from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-sm font-semibold text-gray-100 tracking-wide uppercase">
            DB Monitor
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            PostgreSQL Performance Advisor
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-6">
          <h2 className="mb-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>

          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
