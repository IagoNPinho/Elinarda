"use client"

import { CartProvider } from "@/components/cart-provider"
import DeliveryPageContent from "./page"


export default function DeliveryPage() {
  return (
    <CartProvider>
      <DeliveryPageContent />
    </CartProvider>
  )
}