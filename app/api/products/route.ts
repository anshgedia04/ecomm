import { NextRequest, NextResponse } from "next/server"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { getAdminDb } from "@/lib/firebase/admin"
import { verifyAdminToken } from "@/services/accessServices"
import { productSchema } from "@/schema/product"

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "products"))

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Verify admin token
  const verification = verifyAdminToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const body = await request.json()
    const validationResult = productSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message:
            validationResult.error.issues[0]?.message ?? "Invalid product data",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { title, price, description, category, imageUrl } =
      validationResult.data

    const adminDb = getAdminDb()
    const docRef = await adminDb.collection("products").add({
      title,
      price,
      description,
      category,
      imageUrl,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json(
      { message: "Product created", id: docRef.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    )
  }
}
