import { ApiRequest } from "@/app/_api/api"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { Product, ProductPayload } from "@/types"

type GetProductsResponse = {
  products: Product[]
}

export const getProducts = async () => {
  const response = await ApiRequest<GetProductsResponse>(
    ENDPOINTS.PRODUCTS.BASE,
    "GET",
    undefined,
    {
      withAuth: true,
      showToasts: true,
      errorToast: MESSAGES.PRODUCT.FETCH_FAILED,
    }
  )

  return response
}

export const uploadProduct = async (payload: ProductPayload) => {
  const response = await ApiRequest<{ message: string; id: string }, ProductPayload>(
    ENDPOINTS.PRODUCTS.BASE,
    "POST",
    payload,
    {
      withAuth: true,
      showToasts: true,
      successToast: MESSAGES.PRODUCT.CREATE_SUCCESS,
      errorToast: MESSAGES.PRODUCT.CREATE_FAILED,
    }
  )

  return response
}

export const editProduct = async (id: string, payload: ProductPayload) => {
  const response = await ApiRequest<{ message: string }, ProductPayload>(
    ENDPOINTS.PRODUCTS.BY_ID(id),
    "PUT",
    payload,
    {
      withAuth: true,
      showToasts: true,
      successToast: MESSAGES.PRODUCT.UPDATE_SUCCESS,
      errorToast: MESSAGES.PRODUCT.UPDATE_FAILED,
    }
  )

  return response
}

export const deleteProduct = async (id: string) => {
  const response = await ApiRequest<{ message: string }>(
    ENDPOINTS.PRODUCTS.BY_ID(id),
    "DELETE",
    undefined,
    {
      withAuth: true,
      showToasts: true,
      successToast: MESSAGES.PRODUCT.DELETE_SUCCESS,
      errorToast: MESSAGES.PRODUCT.DELETE_FAILED,
    }
  )

  return response
}
