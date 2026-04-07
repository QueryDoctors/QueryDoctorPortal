/** Raw API response shapes */
export interface RawLoginResponse {
  access_token: string
  token_type: string
}

export interface RawRegisterResponse {
  user_id: string
  email: string
}

/** Domain models */
export interface AuthResult {
  accessToken: string
  userId: string
  email: string
}

export interface RegisterResult {
  userId: string
  email: string
}

/** Form values */
export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
}
