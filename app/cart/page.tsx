"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { auth } from "@/lib/firebase/client"
import CartItem from "@/components/client/CartItem"
import { checkoutOrder } from "@/services/checkoutService"
import useHandleCart from "@/hooks/useHandleCart"
import useVerify from "@/hooks/useVerify"
import { getTokenFromLocalStorage, decodeToken, isTokenExpired } from "@/utils/tokenUtils"
import { MESSAGES, ROUTES } from "@/constants/CONSTANTS"

export default function CartPage() {
  const router = useRouter()
  const { verifyOrRedirect } = useVerify()
  const {
    items,
    loading: cartLoading,
    handleIncrease,
    handleDecrease,
    handleRemove,
  } = useHandleCart()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getTokenFromLocalStorage()

      if (!token || isTokenExpired(token) || !decodeToken(token)) {
        setIsAuthenticated(false)
        setCheckingAuth(false)
        return
      }

      // Wait for Firebase auth to initialize
      const authReady = await new Promise<boolean>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe()
          resolve(!!user)
        })
      })

      setIsAuthenticated(authReady)
      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleCheckout = async () => {
    const verified = verifyOrRedirect({
      noTokenMessage: MESSAGES.CHECKOUT.AUTH_REQUIRED,
    })
    if (!verified) {
      return
    }

    try {
      await checkoutOrder(items)
      toast.success(MESSAGES.CHECKOUT.SUCCESS)
      // The listener will automatically handle any cart changes if checkout removes items,
      // though usually checkout just places an order.
    } catch (error: any) {
      toast.error(error.message || MESSAGES.CHECKOUT.FAILED)
    }
  }

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review the products you added to your cart.
          </p>
        </div>

        {checkingAuth ? (
          <div className="text-center text-gray-600">Checking authentication...</div>
        ) : !isAuthenticated ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Login Required</h2>
            <p className="mb-6 text-gray-600">
              {MESSAGES.AUTH.REQUIRED}
            </p>
            <button
              onClick={() => router.push(ROUTES.LOGIN)}
              className="rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800"
            >
              Login to Continue
            </button>
          </div>
        ) : cartLoading ? (
          <div className="text-gray-600">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="mb-6 flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
