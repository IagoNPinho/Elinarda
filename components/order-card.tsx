"use client"

import { FileText, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Order } from "@/lib/orders-store"

interface OrderCardProps {
  order: Order
  onMarkReady?: (id: string) => void
}

export function OrderCard({ order, onMarkReady }: OrderCardProps) {
  const handleGeneratePDF = () => {
    const content = `
PEDIDO #${order.orderNumber}
Mesa: ${order.tableNumber}
Data: ${order.createdAt.toLocaleString("pt-BR")}

ITENS:
${order.items.map((item) => `- ${item.quantity}x ${item.name} (${item.sizeLabel}) - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`).join("\n")}

TOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pedido-${order.orderNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusConfig = {
    pending: { label: "Aguardando", icon: Clock, color: "text-amber-600 bg-amber-100" },
    preparing: { label: "Preparando", icon: Clock, color: "text-blue-600 bg-blue-100" },
    ready: { label: "Pronto", icon: Check, color: "text-green-600 bg-green-100" },
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-secondary/50 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Pedido #{order.orderNumber}</h3>
            <p className="text-lg font-semibold text-primary">Mesa {order.tableNumber}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <div>
                <span className="font-medium text-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-sm text-muted-foreground ml-2">({item.sizeLabel})</span>
              </div>
              <span className="font-medium text-foreground">
                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-lg font-bold text-foreground">
            Total: <span className="text-primary">R$ {order.total.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex gap-2">
            {order.status !== "ready" && onMarkReady && (
              <Button onClick={() => onMarkReady(order.id)} variant="outline" size="lg">
                <Check className="w-4 h-4 mr-1" />
                Pronto
              </Button>
            )}
            <Button onClick={handleGeneratePDF} size="lg" className="font-semibold">
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
