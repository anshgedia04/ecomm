"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { IoCartSharp } from "react-icons/io5" 
import { removeTokenFromLocalStorage } from "@/utils/tokenUtils"
import type { UserPayload } from "@/types"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserPayload>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")

    try {
      if (!token) {
        setUser(null)
        return
      }

      const decoded = jwtDecode<UserPayload>(token)
      setUser(decoded || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [pathname])

  const handleLogout = () => {
    //ew are handling logout here by removing token 
    removeTokenFromLocalStorage()

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax"   
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-semibold text-black">
          E-Comm
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
          {(user?.role === "customer" || !user) && (
            <>
              <Link
                href="/"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Home
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <IoCartSharp className="text-base" />
                Cart
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Admin Panel
            </Link>
          )}

          {!user ? (
            <Link
              href="/login"
              className="rounded-full border border-gray-200 bg-black px-4 py-2 text-white transition hover:bg-gray-800"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
