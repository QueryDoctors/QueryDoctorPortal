import { apiClient } from '@/lib/api-client'
import type {
  AuthResult,
  LoginFormValues,
  RawLoginResponse,
  RawRegisterResponse,
  RegisterResult,
} from '../types/auth.types'

function parseJwtPayload(token: string): Record<string, string> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return {}
  }
}

export async function loginUser(values: LoginFormValues): Promise<AuthResult> {
  // Backend expects OAuth2 form: username + password fields
  const raw = await apiClient.postForm<RawLoginResponse>('/auth/login', {
    username: values.email,
    password: values.password,
  })

  const payload = parseJwtPayload(raw.access_token)
  return {
    accessToken: raw.access_token,
    userId: payload.sub ?? '',
    email: payload.email ?? values.email,
  }
}

export async function registerUser(
  email: string,
  password: string,
): Promise<RegisterResult> {
  const raw = await apiClient.post<RawRegisterResponse>('/auth/register', {
    email,
    password,
  })
  return { userId: raw.user_id, email: raw.email }
}

export async function logoutUser(): Promise<void> {
  await apiClient.post<void>('/auth/logout', {})
}
