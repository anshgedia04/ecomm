"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithCustomToken } from "firebase/auth"
import { toast } from "sonner"

import { auth } from "@/lib/firebase/client"
import { saveTokenToLocalStorage } from "@/utils/tokenUtils"
import { login, signup } from "@/services/authService"

export default function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const loginWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { token, role, firebaseCustomToken } = await login({
        email,
        password,
      })

      await signInWithCustomToken(auth, firebaseCustomToken)
      saveTokenToLocalStorage(token)

      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const signupWithPassword = async (
    role: "admin" | "customer",
    email: string,
    password: string
  ) => {
    try {
      setLoading(true)

      await signup({
        role,
        email,
        password,
      })

      router.push("/login")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    loginWithPassword,
    signupWithPassword,
  }
}
