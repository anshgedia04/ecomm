import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin"
import type {
  FirebaseLoginError,
  FirebaseLoginSuccess,
  LoginRequestBody,
} from "@/types/authTypes"

const JWT_SECRET = process.env.JWT_SECRET
const FIREBASE_WEB_API_KEY =
  process.env.FIREBASE_WEB_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function parseBody(body: unknown): LoginRequestBody | null {
  if (!body || typeof body !== "object") {
    return null
  }

  const { email, password } = body as Record<string, unknown>

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password.trim()
  ) {
    return null
  }

  return {
    email: email.trim(),
    password,
  }
}

import { MESSAGES } from "@/constants/CONSTANTS"

function mapFirebaseAuthError(message?: string) {
  switch (message) {
    case "INVALID_LOGIN_CREDENTIALS":
    case "INVALID_PASSWORD":
    case "EMAIL_NOT_FOUND":
      return MESSAGES.AUTH.INVALID_CREDENTIALS
    case "USER_DISABLED":
      return "User account is disabled"
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many login attempts. Please try again later"
    case "INVALID_API_KEY":
    case "API_KEY_INVALID":
      return "Firebase API key is invalid"
    default:
      return "Failed to authenticate user"
  }
}

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    return errorResponse("JWT_SECRET is not configured", 500)
  }
  if (!FIREBASE_WEB_API_KEY) {
    return errorResponse("Firebase API key is not configured", 500)
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("Invalid JSON body", 400)
  }

  const parsedBody = parseBody(body)
  if (!parsedBody) {
    return errorResponse("email and password are required", 400)
  }

  try {
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    const firebaseLoginResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsedBody.email,
          password: parsedBody.password,
          returnSecureToken: true,
        }),
      }
    )

    if (!firebaseLoginResponse.ok) {
      const errorBody =
        (await firebaseLoginResponse.json().catch(() => null)) as FirebaseLoginError | null
      
      console.error("Firebase Login Failed for:", parsedBody.email, "Error:", errorBody?.error?.message)
      
      const message = mapFirebaseAuthError(errorBody?.error?.message)
      return errorResponse(message, 401)
    }

    const firebaseData = (await firebaseLoginResponse.json()) as FirebaseLoginSuccess
    const decodedIdToken = await adminAuth.verifyIdToken(firebaseData.idToken)
    const uid = decodedIdToken.uid
    const email = decodedIdToken.email ?? firebaseData.email

    if (!email) {
      return errorResponse("Email is missing from authenticated user", 401)
    }

    const userDocRef = adminDb.collection("users").doc(uid)
    const userDoc = await userDocRef.get()

    let role: "admin" | "customer" = "customer"

    if (!userDoc.exists) {
      // Backfill profile for users that exist in Firebase Auth but not in Firestore.
      await userDocRef.set({
        email,
        role,
        createdAt: FieldValue.serverTimestamp(),
      })
    } else {
      const userData = userDoc.data()
      const roleRaw =
        typeof userData?.role === "string"
          ? userData.role.toLowerCase()
          : "customer"
      role = roleRaw === "admin" ? "admin" : "customer"
    }

    const token = jwt.sign({ uid, email, role }, JWT_SECRET, {
      expiresIn: "1h",
    })
    const firebaseCustomToken = await adminAuth.createCustomToken(uid, { role })

    const response = NextResponse.json({
      success: true,
      token,
      role,
      firebaseCustomToken,
    })

    response.cookies.set("token", token, {
      path: "/",
      maxAge: 60*60, //cookie is valid for 1 hr
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch {
    return errorResponse("Failed to login", 500)
  }
}
