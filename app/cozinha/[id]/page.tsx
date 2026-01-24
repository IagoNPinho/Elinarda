"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Check, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"
import {
  updateOrderStatus,
  fetchOrderById,
  closeOrder,
} from "@/lib/orders"
import type { Order, PaymentMethod } from "@/lib/orders"
import { openWhatsAppWithOrderStatus } from "@/lib/whatsapp-message"
import { ConfirmModal } from "@/components/confirm-cancel-modal"
import { cancelOrder } from "@/lib/orders"

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
  cancelled: "bg-red-100 text-red-700"
}

export default function KitchenOrderPage() {
  // Status para modal de cancelamento
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [loadingCancel, setLoadingCancel] = useState(false)

  const { id } = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null)
  const [paymentDetails, setPaymentDetails] = useState("")

  async function loadOrder() {
    const data = await fetchOrderById(id as string)
    setOrder(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) loadOrder()
  }, [id])

  async function handlePrint(order: Order) {
    if (order.status === "pending") {
      await updateOrderStatus(order.id, "preparing")
    }

    generateOrderThermalPDF(order, { width: 58 })
    loadOrder()
  }

  async function updateStatus(
    order: Order,
    status:
      | "pending"
      | "preparing"
      | "ready"
      | "out_for_delivery"
      | "delivered"
      | "closed",
  ) {
    await updateOrderStatus(order.id, status)
    loadOrder()
  }

  function assertPaymentMethod(
    method: PaymentMethod | null,
  ): asserts method is PaymentMethod {
    if (!method) {
      throw new Error("Forma de pagamento obrigatória")
    }
  }

  if (loading) {
    return (
      <main className="p-6 text-center text-muted-foreground">
        Carregando pedido...
      </main>
    )
  }

  if (!order) {
    return (
      <main className="p-6 text-center">
        <p>Pedido não encontrado.</p>
        <Button onClick={() => router.push("/cozinha")}>
          Voltar
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/cozinha")}
          >
            <ArrowLeft />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-bold">
              Pedido #{order.id.slice(0, 6)}
            </h1>

            {order.origin === "mesa" && (
              <p className="text-sm opacity-90">
                Mesa {order.table_number}
              </p>
            )}

            {order.origin === "delivery" && (
              <span className="inline-block mt-1 text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded">
                DELIVERY
              </span>
            )}
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded ${statusColor[order.status]}`}
          >
            {statusLabel[order.status]}
          </span>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* DADOS DO CLIENTE */}
        {order.origin === "delivery" && (
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-orange-700">
              Dados do Cliente
            </h3>

            <p className="text-sm">
              <strong>Nome:</strong> {order.customer_name}
            </p>

            <p className="text-sm">
              <strong>Telefone:</strong>{" "}
              <button
                onClick={() => openWhatsAppWithOrderStatus(order)}
                className="text-green-600 font-medium underline"
              >
                {order.customer_phone}
              </button>
            </p>

            <p className="text-sm">
              <strong>Endereço:</strong><br />
              {order.customer_street}, {order.customer_number}<br />
              {order.customer_neighborhood} – CEP {order.customer_cep}
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={() => openWhatsAppWithOrderStatus(order)}
            >
              Falar com cliente no WhatsApp
            </Button>
          </div>
        )}

        {order.origin === "delivery" && order.status === "out_for_delivery" && (
          <div className="border rounded-lg p-4 space-y-3">
            <Button
              onClick={() => openWhatsAppWithOrderStatus(order)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Avisar cliente no WhatsApp
            </Button>
          </div>
        )}


        {/* ITENS */}
        <ul className="border rounded-lg p-4 space-y-2">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="text-sm">
              {item.weightInGrams ? (
                <>
                  {item.name} – {item.weightInGrams}g
                  <span className="text-muted-foreground">
                    {" "}
                    • vendido por peso
                  </span>
                </>
              ) : (
                <>
                  {item.quantity}x {item.name} ({item.sizeLabel})
                </>
              )}
            </li>
          ))}
        </ul>

        {/* TOTAL */}
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>

        {/* AÇÕES */}
        <div className="grid gap-3 sm:grid-cols-3">
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
              router.push("/cozinha")
            }}
          />

          <Button
            variant="outline"
            onClick={() => handlePrint(order)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Imprimir Pedido
          </Button>

          {order.status === "pending" && (
            <Button onClick={() => updateStatus(order, "preparing")}>
              <ChefHat className="w-4 h-4 mr-2" />
              Iniciar Preparo
            </Button>
          )}

          {order.status === "preparing" && (
            <Button onClick={() => updateStatus(order, "ready")}>
              <Check className="w-4 h-4 mr-2" />
              Marcar como Pronto
            </Button>
          )}

          {order.origin === "delivery" &&
            order.status === "ready" && (
              <Button
                onClick={() =>
                  updateStatus(order, "out_for_delivery")
                }
              >
                🚚 Saiu para Entrega
              </Button>
            )}

          {(order.origin !== "delivery" &&
            order.status === "ready") ||
            (order.origin === "delivery" &&
              order.status === "out_for_delivery") ? (
            <div className="space-y-3 border rounded-lg p-4 sm:col-span-2">
              <h3 className="font-semibold">Forma de Pagamento</h3>

              <div className="grid grid-cols-2 gap-2">
                {["dinheiro", "pix", "credito", "debito"].map(
                  (method) => (
                    <Button
                      key={method}
                      variant={
                        paymentMethod === method
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setPaymentMethod(method as PaymentMethod)
                      }
                    >
                      {method.toUpperCase()}
                    </Button>
                  ),
                )}
              </div>

              <input
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Observações (ex: troco para 50)"
                value={paymentDetails}
                onChange={(e) =>
                  setPaymentDetails(e.target.value)
                }
              />

              <Button
                variant="destructive"
                disabled={!paymentMethod}
                onClick={async () => {
                  assertPaymentMethod(paymentMethod)

                  await closeOrder({
                    id: order.id,
                    paymentMethod,
                    paymentDetails,
                  })

                  router.push("/cozinha")
                }}
              >
                Finalizar Pedido
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
