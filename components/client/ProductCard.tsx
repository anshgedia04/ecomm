"use client"

import Image from "next/image"
import useAddToCart from "@/hooks/useAddToCart"
import type { ProductCardProps } from "@/types"

export default function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useAddToCart(product)

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-52 items-center justify-center bg-gray-50 p-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.title}
          </h3>
          <span className="whitespace-nowrap text-sm font-medium text-gray-700">
            ₹{product.price}
          </span>
        </div>

        <p className="mb-2 text-sm text-gray-500">{product.category}</p>

        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {product.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
