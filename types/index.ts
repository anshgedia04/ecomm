import type { AxiosRequestConfig, Method } from "axios"
import type { User as FirebaseUser } from "firebase/auth"
import type { NextResponse } from "next/server"
import type { z } from "zod"
import type { productSchema } from "@/schema/product"

export type UserRole = "admin" | "customer"

export type Product = {
  id: string
  title: string
  price: number
  description: string
  category: string
  imageUrl: string
}

export type ProductFormValues = z.input<typeof productSchema>
export type ProductPayload = z.output<typeof productSchema>

export type AddProductFormProps = {
  editingProduct: Product | null
  onSaved: () => Promise<void> | void
  onCancelEdit: () => void
}

export type ProductCardProps = {
  product: Product
}

export type AdminProductCardProps = {
  data: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export interface User {
  id: string
  email: string
  name: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export type CartItemDisplay = {
  id: string
  title: string
  price: number
  imageUrl: string
  quantity: number
}

export type CartItemProduct = {
  productId: string
  title: string
  price: number
  imageUrl: string
  quantity: number
}

export type CartItemRecord = CartItemProduct & {
  id: string
}

export type CartItemComponentProps = {
  item: CartItemDisplay
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onRemove?: (id: string) => void
}

export type DecodedToken = {
  email: string
  role: string
  iat?: number
  exp?: number
}

export type UserPayload = {
  email: string
  role: UserRole
} | null

export type VerifyAdminSuccess = {
  isValid: true
  user: {
    uid: string
    email: string
    role: string
  }
}

export type VerifyUserSuccess = {
  isValid: true
  user: {
    uid: string
    email: string
    role: string
  }
}

export type VerifyAdminFailure = {
  isValid: false
  error: NextResponse
}

export type VerifyAdminAccessResult =
  | { isAuthorized: true }
  | { isAuthorized: false; redirectTo: "/login" | "/" }

export type RouteIdParams = {
  params: Promise<{
    id: string
  }>
}

export type ToastType = "success" | "error"

export type ApiOptions = {
  params?: AxiosRequestConfig["params"]
  headers?: AxiosRequestConfig["headers"]
  withAuth?: boolean
  token?: string
  timeout?: number
  showToasts?: boolean
  successToast?: string
  errorToast?: string
}

export type ApiRequestInput<TData = unknown> = {
  path: string
  method?: Method
  data?: TData
} & ApiOptions

export type VerifySessionOptions = {
  noTokenMessage?: string
  expiredTokenMessage?: string
  invalidTokenMessage?: string
  missingAuthMessage?: string
  requireDecodedToken?: boolean
}

export type VerifySessionFailure = {
  ok: false
  message: string
}

export type VerifySessionSuccess = {
  ok: true
  token: string
  user: FirebaseUser
  decoded: DecodedToken | null
}

export type VerifySessionResult = VerifySessionFailure | VerifySessionSuccess
