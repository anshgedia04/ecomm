import * as admin from "firebase-admin"

function normalizePrivateKey(rawValue?: string) {
  if (!rawValue) {
    return undefined
  }

  const trimmed = rawValue.trim()
  const unwrapped =
    trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1)
      : trimmed

  return unwrapped.replace(/\\n/g, "\n")
}

function getFirebaseAdminConfig() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    )
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app()
  }

  const credentials = getFirebaseAdminConfig()

  return admin.initializeApp({
    credential: admin.credential.cert(credentials),
  })
}

export function getAdminAuth() {
  return admin.auth(getFirebaseAdminApp())
}

export function getAdminDb() {
  return admin.firestore(getFirebaseAdminApp())
}
