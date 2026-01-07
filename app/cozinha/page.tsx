"use client"

import Link from "next/link"
import { ChefHat, FileText } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"

export default function KitchenPage() {
  const { orders } = useCart()

  console.log("🔵 ORDERS NA COZINHA:", orders)

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER (PADRÃO DO SISTEMA) */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
          <h1 className="text-xl font-bold">
            Cozinha
          </h1>
        </div>
      </header>

      {/* LISTA DE PEDIDOS */}
      {orders.length === 0 ? (
        <div className="text-center text-muted-foreground mt-20">
          <p>Nenhum pedido em aberto no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 p-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-card flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">
                    Pedido #{order.id}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Mesa {order.mesa}
                  </p>
                </div>

                <span className="text-sm font-semibold text-primary">
                  {order.status === "aberto"
                    ? "Em preparo"
                    : "Pronto"}
                </span>
              </div>

              <ul className="text-sm space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.weightInGrams
                      ? `${item.name} – ${item.weightInGrams}g`
                      : `${item.quantity}x ${item.name} (${item.sizeLabel})`}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-bold">
                  R$ {order.total.toFixed(2)}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateOrderThermalPDF(order, { width: 58 })}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Imprimir
                  </Button>

                  <Button asChild size="sm">
                    <Link href={`/cozinha/${order.id}`}>
                      Ver
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
