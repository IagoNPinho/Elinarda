"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { CartModal } from "@/components/cart/cart-modal"


interface CartBarProps {
  origin: "mesa" | "balcao" | "delivery"
}

export function CartBar({ origin }: CartBarProps) {
  const { total, itemCount } = useCart()
  const [open, setOpen] = useState(false)

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
            <p className="text-lg font-bold text-foreground">R$ {total.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <Button onClick={() => setOpen(true)} size="lg" className="font-semibold px-6">
          Ver carrinho
        </Button>
        
        <CartModal
          open={open}
          onClose={() => setOpen(false)}
          origin={origin}
        />
      </div>
    </div>
  )
}
