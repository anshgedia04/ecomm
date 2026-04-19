import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin"
import type { FirebaseAdminError, SignupRequestBody } from "@/types/authTypes"

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function parseBody(body: unknown): SignupRequestBody | null {
  if (!body || typeof body !== "object") {
    return null
  }

  const { email, password, role } = body as Record<string, unknown>

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return null
  }

  const normalizedRole = role === "admin" ? "admin" : "customer"

  return {
    email: email.trim(),
    password,
    role: normalizedRole,
  }
}

function mapSignupError(error: unknown) {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as FirebaseAdminError).code === "string"
      ? (error as FirebaseAdminError).code
      : ""

  switch (code) {
    case "auth/email-already-exists":
      return { message: "Email already exists", status: 409 }
    case "auth/invalid-password":
      return { message: "Password is too weak", status: 400 }
    case "auth/invalid-email":
      return { message: "Invalid email address", status: 400 }
    default:
      return { message: "Failed to create account", status: 500 }
  }
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("Invalid JSON body", 400)
  }

  const parsedBody = parseBody(body)
  if (!parsedBody) {
    return errorResponse(
      "Valid email, password (min 8 chars), and role are required",
      400
    )
  }

  try {
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    const userRecord = await adminAuth.createUser({
      email: parsedBody.email,
      password: parsedBody.password,
    })

    await adminDb.collection("users").doc(userRecord.uid).set({
      email: userRecord.email ?? parsedBody.email,
      role: parsedBody.role,
      createdAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    const mappedError = mapSignupError(error)
    return errorResponse(mappedError.message, mappedError.status)
  }
}
