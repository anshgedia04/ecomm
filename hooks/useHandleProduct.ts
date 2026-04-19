"use client"

import { useCallback, useState } from "react"

import {
  deleteProduct,
  editProduct,
  getProducts,
  uploadProduct,
} from "@/services/productService"
import type { Product, ProductPayload } from "@/types"

export default function useHandleProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const getProductsHandler = useCallback(async () => {
    const data = await getProducts()
    setProducts(data.products || [])
  }, [])

  const uploadProductHandler = useCallback(
    async (payload: ProductPayload) => {
      setLoading(true)
      try {
        await uploadProduct(payload)
        await getProductsHandler()
      } finally {
        setLoading(false)
      }
    },
    [getProductsHandler]
  )

  const editProductHandler = useCallback(
    async (id: string, payload: ProductPayload) => {
      setLoading(true)
      try {
        await editProduct(id, payload)
        await getProductsHandler()
      } finally {
        setLoading(false)
      }
    },
    [getProductsHandler]
  )

  const deleteProductHandler = useCallback(
    async (id: string) => {
      await deleteProduct(id)
      await getProductsHandler()
    },
    [getProductsHandler]
  )

  return {
    products,
    loading,
    getProductsHandler,
    uploadProductHandler,
    editProductHandler,
    deleteProductHandler,
  }
}
