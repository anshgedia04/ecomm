import type { AdminProductCardProps } from "@/types"

export default function Product({ data, onEdit, onDelete }: AdminProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <img
        src={data.imageUrl}
        alt={data.title}
        className="h-48 w-full object-contain"
      />

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
          <span className="whitespace-nowrap text-sm font-medium text-gray-700">
            ₹{data.price}
          </span>
        </div>

        <p className="mb-2 text-sm text-gray-500">{data.category}</p>

        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {data.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(data)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
