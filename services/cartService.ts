import { ApiRequest } from "@/app/_api/api"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { CartItemRecord, Product } from "@/types"

export type CartResponse = {
  items: CartItemRecord[]
}

export const getCart = async () => {
  return ApiRequest<CartResponse>(ENDPOINTS.CART.BASE, "GET", undefined, {
    withAuth: true,
  })
}

export const addToCart = async (product: Product) => {
  return ApiRequest<{ message: string }, any>(ENDPOINTS.CART.BASE, "POST", {
    productId: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
  }, {
    withAuth: true,
    showToasts: true,
    successToast: MESSAGES.CART.ADD_SUCCESS,
    errorToast: MESSAGES.CART.ADD_FAILED,
  })
}

export const updateCartItem = async (productId: string, quantity: number) => {
  return ApiRequest<{ message: string }, any>(ENDPOINTS.CART.BASE, "PUT", {
    productId,
    quantity,
  }, {
    withAuth: true,
  })
}

export const removeFromCart = async (productId: string) => {
  return ApiRequest<{ message: string }>(ENDPOINTS.CART.BASE, "DELETE", undefined, {
    withAuth: true,
    params: { productId },
    showToasts: true,
    successToast: MESSAGES.CART.REMOVE_SUCCESS,
    errorToast: MESSAGES.CART.REMOVE_FAILED,
  })
}
