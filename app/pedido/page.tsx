"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { createOrderInDB } from "@/lib/orders"

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    tableNumber,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()


  const [orderConfirmed, setOrderConfirmed] = useState(false)

  const handleConfirmOrder = async () => {
    if (items.length === 0) return

    await createOrderInDB({
      origin: "mesa",
      tableNumber,
      items,
      subtotal: total,
    })

    clearCart()
    setOrderConfirmed(true)

    setTimeout(() => {
      router.push(`/mesa/${tableNumber}`)
    }, 2000)
  }



  if (orderConfirmed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Seu pedido foi enviado para a cozinha.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/mesa/${tableNumber}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Pedido</h1>
            <p className="text-sm opacity-90">Mesa {tableNumber}</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto p-4 pb-32">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Carrinho vazio
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.sizeLabel}
                    </p>
                    <p className="font-bold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus />
                    </button>

                    <button onClick={() => removeItem(item.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleConfirmOrder}
              size="lg"
              className="w-full"
            >
              Confirmar Pedido
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
