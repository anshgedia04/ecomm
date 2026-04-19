import Image from "next/image"
import type { CartItemComponentProps } from "@/types"

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemComponentProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      
      {/* LEFT: Image + Info */}
      <div className="flex gap-4">
        <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 p-2">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={80}
            height={80}
            quality={35}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500">₹{item.price}</p>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrease?.(item.id)}
            className="h-8 w-8 rounded-md border text-lg hover:bg-gray-100"
          >
            -
          </button>

          <span className="w-6 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease?.(item.id)}
            className="h-8 w-8 rounded-md border text-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* Total */}
        <div className="text-sm font-semibold text-gray-900">
          ₹{item.price * item.quantity}
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove?.(item.id)}
          className="text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
