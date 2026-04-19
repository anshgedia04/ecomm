import ProductCard from "@/components/client/ProductCard"
import { ApiRequest } from "@/app/_api/api"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import type { Product } from "@/types"

async function getProducts() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  try {
    const data = await ApiRequest<{ products?: Product[] }>(
      `${baseURL}${ENDPOINTS.PRODUCTS.BASE}`,
      "GET"
    )
    return data.products ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Explore all available products.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
            No products available.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
