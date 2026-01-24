"use client"

import { FileText, Clock, Check, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Order } from "@/lib/orders"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"
import { updateOrderStatus } from "@/lib/orders"

interface OrderCardProps {
  order: Order
  onRefresh?: () => void
}

export function OrderCard({ order, onRefresh }: OrderCardProps) {
  const statusConfig: Record<
    Order["status"],
    { label: string; icon: any; color: string }
  > = {
    pending: {
      label: "Aguardando",
      icon: Clock,
      color: "text-amber-700 bg-amber-100",
    },
    preparing: {
      label: "Em preparo",
      icon: ChefHat,
      color: "text-blue-700 bg-blue-100",
    },
    ready: {
      label: "Pronto",
      icon: Check,
      color: "text-green-700 bg-green-100",
    },
    out_for_delivery: {
      label: "Saiu para entrega",
      icon: Clock,
      color: "text-purple-700 bg-purple-100",
    },
    delivered: {
      label: "Entregue",
      icon: Check,
      color: "text-green-700 bg-green-100",
    },
    closed: {
      label: "Finalizado",
      icon: Check,
      color: "text-muted-foreground bg-muted",
    },
    cancelled: {
      label: "Cancelado",
      icon: FileText,
      color: "text-red-700 bg-red-100",
    }
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const handlePrint = async () => {
    if (order.status === "pending") {
      await updateOrderStatus(order.id, "preparing")
    }

    await generateOrderThermalPDF(order, { width: 58 })

    onRefresh?.()
  }

  const handleMarkReady = async () => {
    await updateOrderStatus(order.id, "ready")
    onRefresh?.()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-secondary/50 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Pedido #{order.id.slice(0, 6)}
            </h3>

            {order.origin === "mesa" && order.table_number && (
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

          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${status.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* ITENS */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start py-2 border-b border-border last:border-0"
            >
              <div>
                {item.weightInGrams ? (
                  <span className="font-medium text-foreground">
                    {item.name} – {item.weightInGrams}g
                    <span className="ml-1 text-xs text-muted-foreground">
                      • vendido por peso
                    </span>
                  </span>
                ) : (
                  <span className="font-medium text-foreground">
                    {item.quantity}x {item.name}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({item.sizeLabel})
                    </span>
                  </span>
                )}
              </div>

              <span className="font-medium text-foreground">
                R${" "}
                {(item.price * item.quantity)
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-lg font-bold text-foreground">
            Total:{" "}
            <span className="text-primary">
              R$ {order.total.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* AÇÕES */}
          <div className="flex gap-2">
            {order.status === "preparing" && (
              <Button
                onClick={handleMarkReady}
                variant="outline"
                size="sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Pronto
              </Button>
            )}

            <Button onClick={handlePrint} size="sm">
              <FileText className="w-4 h-4 mr-1" />
              Imprimir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}