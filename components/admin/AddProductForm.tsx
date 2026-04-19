"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { ApiRequest } from "@/app/_api/api"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { AddProductFormProps, ProductFormValues } from "@/types"
import { productSchema } from "@/schema/product"

const defaultFormValues: ProductFormValues = {
  title: "",
  price: "",
  description: "",
  category: "",
  imageUrl: "",
}

export default function AddProductForm({
  editingProduct,
  onSaved,
  onCancelEdit,
}: AddProductFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (editingProduct) {
      reset({
        title: editingProduct.title,
        price: String(editingProduct.price),
        description: editingProduct.description,
        category: editingProduct.category,
        imageUrl: editingProduct.imageUrl,
      })
      return
    }

    reset(defaultFormValues)
  }, [editingProduct, reset])

  const handleCancel = () => {
    reset(defaultFormValues)
    onCancelEdit()
  }

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true)

    const payload = productSchema.parse(values)

    try {
      if (editingProduct) {
        await ApiRequest(ENDPOINTS.PRODUCTS.BY_ID(editingProduct.id), "PUT", payload, {
          withAuth: true,
          showToasts: true,
          successToast: MESSAGES.PRODUCT.UPDATE_SUCCESS,
          errorToast: MESSAGES.PRODUCT.UPDATE_FAILED,
        })
      } else {
        await ApiRequest(ENDPOINTS.PRODUCTS.BASE, "POST", payload, {
          withAuth: true,
          showToasts: true,
          successToast: MESSAGES.PRODUCT.CREATE_SUCCESS,
          errorToast: MESSAGES.PRODUCT.CREATE_FAILED,
        })
      }

      reset(defaultFormValues)
      onCancelEdit()
      await onSaved()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {editingProduct ? "Update Product" : "Create Product"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            placeholder="Product title"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            placeholder="79999"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("price")}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            placeholder="mobile"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("category")}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Write product description"
            rows={4}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading
              ? editingProduct
                ? "Updating..."
                : "Creating..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border px-4 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
