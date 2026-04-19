import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"
import { verifyUserToken } from "@/services/accessServices"

export async function GET(request: NextRequest) {
  const verification = verifyUserToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const db = getAdminDb()
    const { uid } = verification.user
    const cartRef = db.collection("cart").doc(uid).collection("items")
    const snapshot = await cartRef.get()

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const verification = verifyUserToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const db = getAdminDb()
    const { uid } = verification.user
    const { productId, title, price, imageUrl } = await request.json()

    if (!productId || !title || !price || !imageUrl) {
      return NextResponse.json(
        { message: "Missing product data" },
        { status: 400 }
      )
    }

    const itemRef = db.collection("cart").doc(uid).collection("items").doc(productId)
    const existingItem = await itemRef.get()

    if (existingItem.exists) {
      return NextResponse.json(
        { message: "Product already in cart" },
        { status: 200 } // Keep as 200 to match frontend's logic for now
      )
    }

    await itemRef.set({
      productId,
      title,
      price,
      imageUrl,
      quantity: 1,
      addedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: "Item added to cart" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const verification = verifyUserToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const db = getAdminDb()
    const { uid } = verification.user
    const { productId, quantity } = await request.json()

    if (!productId || typeof quantity !== "number") {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
        { status: 400 }
      )
    }

    const itemRef = db.collection("cart").doc(uid).collection("items").doc(productId)
    
    await itemRef.update({
      quantity,
    })

    return NextResponse.json(
      { message: "Cart updated" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { message: "Failed to update cart" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const verification = verifyUserToken(request)
  if (!verification.isValid) {
    return verification.error
  }

  try {
    const db = getAdminDb()
    const { uid } = verification.user
    const productId = request.nextUrl.searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      )
    }

    const itemRef = db.collection("cart").doc(uid).collection("items").doc(productId)
    await itemRef.delete()

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 500 }
    )
  }
}