"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ProductCard from "@/components/admin/product"
import useHandleProduct from "@/hooks/useHandleProduct"
import { productSchema } from "@/schema/product"
import { verifyAdminAccess } from "@/services/accessServices"
import type { Product, ProductFormValues } from "@/types"

const defaultFormValues: ProductFormValues = {
  title: "",
  price: "",
  description: "",
  category: "",
  imageUrl: "",
}

export default function AdminPage() {
  const router = useRouter()
  const {
    products,
    loading,
    getProductsHandler,
    uploadProductHandler,
    editProductHandler,
    deleteProductHandler,
  } = useHandleProduct()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    const access = verifyAdminAccess()

    if (!access.isAuthorized) {
      router.push(access.redirectTo)
      setIsChecking(false)
      return
    }

    setIsAuthorized(true)
    setIsChecking(false)
  }, [router])

  useEffect(() => {
    if (isAuthorized) {
      getProductsHandler()
    }
  }, [isAuthorized, getProductsHandler])

  const resetForm = () => {
    reset(defaultFormValues)
    setEditingId(null)
  }

  const handleSubmit = async (values: ProductFormValues) => {
    const payload = productSchema.parse(values)

    try {
      if (editingId) {
        await editProductHandler(editingId, payload)
      } else {
        await uploadProductHandler(payload)
      }

      resetForm()
    } catch {
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    reset({
      title: product.title,
      price: String(product.price),
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this product?")
    if (!confirmDelete) return

    try {
      await deleteProductHandler(id)
    } catch {
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      {isChecking ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      ) : !isAuthorized ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Redirecting...</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create, update, and delete products.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {editingId ? "Update Product" : "Create Product"}
              </h2>

              <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
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
                    <p className="mt-1 text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:opacity-60"
                  >
                    {loading
                      ? editingId
                        ? "Updating..."
                        : "Creating..."
                      : editingId
                      ? "Update Product"
                      : "Create Product"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                All Products
              </h2>

              {products.length === 0 ? (
                <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
                  No products found.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      data={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
