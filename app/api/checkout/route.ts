import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/services/accessServices';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token from Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET || "") as {
      email: string
      role: string
    }

    // Get order data
    const { products, userId, userEmail } = await request.json()

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "No products in order" },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      message: 'Order placed successfully',
      orderId,
      status: 'confirmed'
    })

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      )
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { message: "Authentication token expired" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Failed to process order" },
      { status: 500 }
    )
  }
}
