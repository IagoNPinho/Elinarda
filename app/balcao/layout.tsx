"use client"

import { CartProvider } from "@/components/cart-provider"
import BalcaoMenuPage from "./page"


export default function BalcaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
