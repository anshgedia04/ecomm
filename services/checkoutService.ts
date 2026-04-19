import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { ApiRequest } from "@/app/_api/api"
import { verifySession } from "@/hooks/useVerify"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { CartItemProduct } from "@/types"

export const checkoutOrder = async (items: CartItemProduct[]) => {
  const verified = verifySession({
    noTokenMessage: MESSAGES.CHECKOUT.AUTH_REQUIRED,
    requireDecodedToken: true,
  })
  if (!verified.ok) {
    throw new Error(verified.message)
  }

  if (!verified.decoded) {
    throw new Error("Invalid session. Please login again")
  }

  if (items.length === 0) {
    throw new Error(MESSAGES.CHECKOUT.EMPTY_CART)
  }

  const products = items.map((item) => ({
    productId: item.productId,
    title: item.title,
    price: item.price,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
  }))

  // Send order to API with token for server-side verification
  const result = await ApiRequest<{
    message: string
    orderId: string
    status: string
  }>(
    ENDPOINTS.CHECKOUT.BASE,
    "POST",
    {
      products,
      userId: verified.user.uid,
      userEmail: verified.decoded.email,
    },
    {
      withAuth: true,
      token: verified.token,
      errorToast: MESSAGES.CHECKOUT.FAILED,
    }
  )

  // Also save to Firestore for backward compatibility
  await addDoc(collection(db, "orders"), {
    uid: verified.user.uid,
    products,
    createdAt: serverTimestamp(),
    orderId: result.orderId,
  })

  return result
}
