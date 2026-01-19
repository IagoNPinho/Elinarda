"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"
import type { Order } from "@/lib/orders"
import { fetchOpenOrders, updateOrderStatus } from "@/lib/orders"

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const previousOrdersRef = useRef<string>("")

  const loadOrders = async (isInitial = false) => {
    const data = await fetchOpenOrders()
    const serialized = JSON.stringify(data)

    if (serialized !== previousOrdersRef.current) {
      previousOrdersRef.current = serialized
      setOrders(data)
    }

    if (isInitial) {
      setLoading(false)
    }
  }

  const handlePrint = async (order: Order) => {
    if (order.status === "pending") {
      await updateOrderStatus(order.id, "preparing")
    }

    generateOrderThermalPDF(order, { width: 58 })
  }

  const statusLabel: Record<string, string> = {
    pending: "Aguardando",
    preparing: "Em preparo",
    ready: "Pronto",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    closed: "Finalizado",
  }



  useEffect(() => {
    loadOrders(true)

    const interval = setInterval(() => {
      loadOrders()
    }, 3000)

    return () => clearInterval(interval)
  }, [])


  return (
    <main className="min-h-screen bg-background">
      {/* HEADER PADRÃO */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
          <h1 className="text-xl font-bold">Cozinha</h1>
        </div>
      </header>

      {/* LISTA */}
      {loading ? (
        <p className="text-center mt-20 text-muted-foreground">
          Carregando pedidos...
        </p>
      ) : orders.length === 0 ? (
        <p className="text-center mt-20 text-muted-foreground">
          Nenhum pedido em aberto no momento.
        </p>
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
                    Pedido #{order.id.slice(0, 6)}
                  </h2>
                  {order.origin === "mesa" && (
                    <p className="text-sm text-muted-foreground">
                      Mesa {order.table_number}
                    </p>
                  )}
                  {order.origin === "delivery" && (
                    <p className="text-sm text-muted-foreground">
                      Delivery
                    </p>
                  )}
                </div>

                <span className="text-sm font-semibold text-primary">
                  {statusLabel[order.status]}
                </span>
              </div>

              <ul className="text-sm space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx}>
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
                    onClick={() =>
                      handlePrint(order)
                    }
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
