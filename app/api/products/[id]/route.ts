import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { getAdminDb } from "@/lib/firebase/admin"
import { verifyAdminToken } from "@/services/accessServices"
import { productSchema } from "@/schema/product"
import type { RouteIdParams } from "@/types"

export async function GET(_: NextRequest, { params }: RouteIdParams) {
  try {
    const { id } = await params
    const docRef = doc(db, "products", id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        product: {
          id: snapshot.id,
          ...snapshot.data(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteIdParams) {
  // Verify admin token
  const verification = verifyAdminToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const { id } = await params
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
    const docRef = adminDb.collection("products").doc(id)

    await docRef.update({
      title,
      price,
      description,
      category,
      imageUrl,
    })

    return NextResponse.json(
      { message: "Product updated" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteIdParams) {
  // Verify admin token
  const verification = verifyAdminToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const { id } = await params
    const adminDb = getAdminDb()
    const docRef = adminDb.collection("products").doc(id)

    await docRef.delete()

    return NextResponse.json(
      { message: "Product deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}
