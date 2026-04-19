import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase/client"
import { decodeToken, getTokenFromLocalStorage, isTokenExpired } from "@/utils/tokenUtils"
import { MESSAGES, ROUTES } from "@/constants/CONSTANTS"
import type { VerifySessionOptions, VerifySessionResult } from "@/types"

const DEFAULT_MESSAGES = {
  noTokenMessage: MESSAGES.AUTH.REQUIRED,
  expiredTokenMessage: "Session expired. Please login again",
  invalidTokenMessage: "Invalid session. Please login again",
  missingAuthMessage: "Authentication required. Please login",
} satisfies Required<Omit<VerifySessionOptions, "requireDecodedToken">>

export function verifySession(options?: VerifySessionOptions): VerifySessionResult {
  const settings = {
    ...DEFAULT_MESSAGES,
    ...options,
  }

  const token = getTokenFromLocalStorage()
  if (!token) {
    return { ok: false, message: settings.noTokenMessage }
  }

  if (isTokenExpired(token)) {
    return { ok: false, message: settings.expiredTokenMessage }
  }

  const decoded = decodeToken(token)
  if (settings.requireDecodedToken && !decoded) {
    return { ok: false, message: settings.invalidTokenMessage }
  }

  const user = auth.currentUser
  if (!user) {
    return { ok: false, message: settings.missingAuthMessage }
  }

  return { ok: true, token, user, decoded }
}

export default function useVerify() {
  const router = useRouter()

  const verifyOrRedirect = (options?: VerifySessionOptions) => {
    const result = verifySession(options)

    if (!result.ok) {
      toast.error(result.message)
      router.push(ROUTES.LOGIN)
      return null
    }

    return result
  }

  return { verifyOrRedirect }
}
