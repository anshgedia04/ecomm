export type AuthUserRole = "admin" | "customer"

export type LoginRequestBody = {
  email: string
  password: string
}

export type FirebaseLoginSuccess = {
  idToken: string
  email: string
  localId: string
}

export type FirebaseLoginError = {
  error?: {
    message?: string
  }
}

export type SignupRequestBody = {
  email: string
  password: string
  role: AuthUserRole
}

export type FirebaseAdminError = {
  code?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  role: AuthUserRole | string
  firebaseCustomToken: string
}

export type SignupPayload = {
  role: AuthUserRole
  email: string
  password: string
}

export type SignupResponse = {
  success: boolean
  message: string
}
