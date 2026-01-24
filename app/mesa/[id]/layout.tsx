"use client"

import { CartProvider } from "@/components/cart-provider"
import TableMenuPage from "./page"

interface PageProps {
  params: Promise<{ id: string | string[] }>
}

export default function Page(props: PageProps) {
  
  return (
    <CartProvider>
      <TableMenuPage params={props.params} />
    </CartProvider>
  )
}
