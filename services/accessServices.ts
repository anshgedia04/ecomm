import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { decodeToken, getTokenFromLocalStorage, isTokenExpired } from "@/utils/tokenUtils"
import type {
  VerifyAdminAccessResult,
  VerifyAdminFailure,
  VerifyAdminSuccess,
  VerifyUserSuccess,
} from "@/types"

const JWT_SECRET = process.env.JWT_SECRET

export function verifyAdminToken(
  request: NextRequest
): VerifyAdminSuccess | VerifyAdminFailure {
  const verification = verifyUserToken(request)
  if (!verification.isValid) return verification

  if (verification.user.role !== "admin") {
    return {
      isValid: false,
      error: NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      ),
    }
  }

  return verification as VerifyAdminSuccess
}

export function verifyUserToken(
  request: NextRequest
): VerifyUserSuccess | VerifyAdminFailure {
  let token = null

  const authHeader = request.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7)
  } else {
    token = request.cookies.get("token")?.value
  }

  if (!token) {
    return {
      isValid: false,
      error: NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      ),
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || "") as {
      uid: string
      email: string
      role: string
    }

    return {
      isValid: true,
      user: decoded,
    }
  } catch {
    return {
      isValid: false,
      error: NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      ),
    }
  }
}

export function verifyAdminAccess(): VerifyAdminAccessResult {
  const token = getTokenFromLocalStorage()

  if (!token) {
    return { isAuthorized: false, redirectTo: "/login" }
  }

  if (isTokenExpired(token)) {
    return { isAuthorized: false, redirectTo: "/login" }
  }

  const decoded = decodeToken(token)
  if (!decoded) {
    return { isAuthorized: false, redirectTo: "/login" }
  }

  if (decoded.role !== "admin") {
    return { isAuthorized: false, redirectTo: "/" }
  }

  return { isAuthorized: true }
}
