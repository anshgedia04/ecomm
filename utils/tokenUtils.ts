import { jwtDecode } from "jwt-decode"
import type { DecodedToken } from "@/types"

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

export function getTokenFromLocalStorage(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function saveTokenToLocalStorage(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("authToken", token)
}

export function removeTokenFromLocalStorage(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("authToken")
}
