"use client"

export const dynamic = "force-dynamic"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { FileText, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"
import type { Order } from "@/lib/orders"
import { fetchOpenOrders, updateOrderStatus, cancelOrder } from "@/lib/orders"
import { ConfirmModal } from "@/components/confirm-cancel-modal"

export default function KitchenPage() {
  // Status para modal de cancelamento
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [loadingCancel, setLoadingCancel] = useState(false)


  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // filtros
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [originFilter, setOriginFilter] = useState<
    "all" | "mesa" | "balcao" | "delivery"
  >("all")
  const [statusFilter, setStatusFilter] = useState<
    "all" | Order["status"]
  >("all")

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

  useEffect(() => {
    loadOrders(true)
    const interval = setInterval(() => loadOrders(), 3000)
    return () => clearInterval(interval)
  }, [])

  const handlePrint = async (order: Order) => {
    if (order.status === "pending") {
      await updateOrderStatus(order.id, "preparing")
    }
    generateOrderThermalPDF(order, { width: 58 })
  }

  const statusLabel: Record<Order["status"], string> = {
    pending: "Aguardando",
    preparing: "Em preparo",
    ready: "Pronto",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    closed: "Finalizado",
    cancelled: "Cancelado",
  }

  const statusColor: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    out_for_delivery: "bg-orange-100 text-orange-800",
    delivered: "bg-slate-100 text-slate-800",
    closed: "bg-slate-200 text-slate-700",
    cancelled: "bg-red-100 text-red-800",
  }

  // 🔎 filtros aplicados
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at)

    const sameDay =
      orderDate.toDateString() === selectedDate.toDateString()

    const matchOrigin =
      originFilter === "all" || order.origin === originFilter

    const matchStatus =
      statusFilter === "all" || order.status === statusFilter

    return sameDay && matchOrigin && matchStatus
  })

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10 flex flex-col">
        <div className="max-w-4xl flex flex-col items-center mx-auto space-y-3">
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
            <h1 className="text-xl font-bold">Cozinha</h1>
          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2">
            {/* DATA */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-black" variant="outline" size="sm">
                  {selectedDate.toLocaleDateString("pt-BR")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                />
              </PopoverContent>
            </Popover>

            {/* ORIGEM */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-black" variant="outline" size="sm">
                  Origem:{" "}
                  {originFilter === "all"
                    ? "Todos"
                    : originFilter === "mesa"
                      ? "Mesa"
                      : originFilter === "balcao"
                        ? "Balcão"
                        : "Delivery"}{" "}
                  ▼
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-40 p-2 space-y-1">
                {[
                  { label: "Todos", value: "all" },
                  { label: "Mesa", value: "mesa" },
                  { label: "Balcão", value: "balcao" },
                  { label: "Delivery", value: "delivery" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setOriginFilter(opt.value as any)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {/* STATUS */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-black" variant="outline" size="sm">
                  Status:{" "}
                  {statusFilter === "all"
                    ? "Todos"
                    : statusLabel[statusFilter]}{" "}
                  ▼
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-48 p-2 space-y-1">
                {[
                  { label: "Todos", value: "all" },
                  { label: "Aguardando", value: "pending" },
                  { label: "Em preparo", value: "preparing" },
                  { label: "Pronto", value: "ready" },
                  { label: "Saiu p/ entrega", value: "out_for_delivery" },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setStatusFilter(opt.value as any)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

          </div>
        </div>
      </header>

      {/* LISTAGEM */}
      {loading ? (
        <p className="text-center mt-20 text-muted-foreground">
          Carregando pedidos...
        </p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center mt-20 text-muted-foreground">
          Nenhum pedido encontrado para os filtros selecionados.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 p-4 max-w-4xl mx-auto">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-card flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
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
                    <>
                      <span className="inline-block text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded mt-1">
                        DELIVERY
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_phone}
                      </p>
                    </>
                  )}
                </div>

                <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColor[order.status]}`}>
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

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold">
                  R$ {order.total.toFixed(2)}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setCancelId(order.id)}
                  >
                    Cancelar
                  </Button>

                  <ConfirmModal
                    open={!!cancelId}
                    title="Cancelar pedido"
                    description="Este pedido será cancelado e não entrará no caixa. Essa ação não pode ser desfeita."
                    confirmText="Cancelar pedido"
                    loading={loadingCancel}
                    onCancel={() => setCancelId(null)}
                    onConfirm={async () => {
                      if (!cancelId) return

                      setLoadingCancel(true)
                      await cancelOrder(cancelId)
                      setLoadingCancel(false)
                      setCancelId(null)
                    }}
                  />


                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrint(order)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Imprimir
                  </Button>

                  <Button asChild size="sm">
                    <Link href={`/cozinha/${order.id}`}>Ver</Link>
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
