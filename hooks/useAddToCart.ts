import { addToCart } from "@/services/cartService"
import useVerify from "@/hooks/useVerify"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { Product } from "@/types"

export default function useAddToCart(product: Product) {
  const { verifyOrRedirect } = useVerify()

  const handleAddToCart = async () => {
    const verified = verifyOrRedirect({
      noTokenMessage: MESSAGES.CART.AUTH_REQUIRED,
    })
    if (!verified) {
      return
    }

    await addToCart(product)
  }

  return { handleAddToCart }
}
