"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/client"
import { updateCartItem, removeFromCart } from "@/services/cartService"
import { MESSAGES } from "@/constants/CONSTANTS"
import type { CartItemRecord } from "@/types"
import { toast } from "sonner"

export default function useHandleCart() {
  const [items, setItems] = useState<CartItemRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = (uid: string) => {
      const cartRef = collection(db, "cart", uid, "items")
      unsubscribe = onSnapshot(
        cartRef,
        (snapshot) => {
          const cartItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as CartItemRecord[]
          setItems(cartItems)
          setLoading(false)
        },
        (error) => {
          console.error("Cart listener error:", error)
          toast.error("Failed to sync cart")
          setLoading(false)
        }
      )
    }

    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setupListener(user.uid)
      } else {
        if (unsubscribe) unsubscribe()
        setItems([])
        setLoading(false)
      }
    })

    return () => {
      authUnsubscribe()
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleIncrease = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    try {
      // Optimistic update
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
      await updateCartItem(id, item.quantity + 1)
    } catch {
      toast.error(MESSAGES.CART.UPDATE_FAILED)
    }
  }

  const handleDecrease = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    if (item.quantity === 1) {
      return handleRemove(id)
    }

    try {
      // Optimistic update
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
      await updateCartItem(id, item.quantity - 1)
    } catch {
      toast.error(MESSAGES.CART.UPDATE_FAILED)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      // Optimistic update
      setItems(prev => prev.filter(i => i.id !== id))
      await removeFromCart(id)
    } catch {
      // Error handled by utility
    }
  }

  return {
    items,
    loading,
    handleIncrease,
    handleDecrease,
    handleRemove,
  }
}
