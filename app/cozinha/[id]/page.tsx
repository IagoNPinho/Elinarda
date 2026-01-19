"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Check, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"
import { updateOrderStatus, fetchOrderById, closeOrder } from "@/lib/orders"
import type { Order, PaymentMethod } from "@/lib/orders"

export default function KitchenOrderPage() {
  const { id } = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentDetails, setPaymentDetails] = useState("")


  const loadOrder = async () => {
    const data = await fetchOrderById(id as string)
    setOrder(data)
    setLoading(false)
  }

  const handlePrint = async (order: Order) => {
    if (order.status === "pending") {
      await updateOrderStatus(order.id, "preparing")
    }

    generateOrderThermalPDF(order, { width: 58 })
    loadOrder()
  }


  const updateStatus = async (order: Order, status:
    | "pending"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "closed"
  ) => {
    await updateOrderStatus(order.id, status)

    loadOrder()
  }

  function assertPaymentMethod(
    method: PaymentMethod | null
  ): asserts method is PaymentMethod {
    if (!method) {
      throw new Error("Forma de pagamento obrigatória")
    }
  }


  useEffect(() => {
    if (id) loadOrder()
  }, [id])

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
      {/* HEADER PADRÃO */}
      <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/cozinha")}
          >
            <ArrowLeft />
          </Button>

          <div>
            <h1 className="text-xl font-bold">
              Pedido #{order.id.slice(0, 6)}
            </h1>
            {order.origin === "mesa" && (
              <p className="text-sm opacity-90">
                Mesa {order.table_number}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <ul className="border rounded-lg p-4 space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.weightInGrams ? (
                <>
                  {item.name} – {item.weightInGrams}g
                  <span className="text-muted-foreground">
                    {" "}• vendido por peso
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

        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>

        {/* AÇÕES */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={async () => {
              handlePrint(order)
              loadOrder()
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Imprimir Pedido
          </Button>

          {order.status === "pending" && (
            <Button onClick={() =>
              updateStatus(order, "preparing")
            }>
              <ChefHat className="w-4 h-4 mr-2" />
              Iniciar Preparo
            </Button>
          )}

          {order.status === "preparing" && (
            <Button onClick={() =>
              updateStatus(order, "ready")
            }>
              <Check className="w-4 h-4 mr-2" />
              Marcar como Pronto
            </Button>
          )}

          {order.origin === "delivery" && order.status === "ready" && (
            <Button onClick={() => updateStatus(order, "out_for_delivery")}>
              🚚 Saiu para Entrega
            </Button>
          )}

          {order.origin !== "delivery" && order.status === "ready" && (
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="font-semibold">Forma de Pagamento</h3>

              <div className="grid grid-cols-2 gap-2">
                {["dinheiro", "pix", "credito", "debito"].map((method) => (
                  <Button
                    key={method}
                    variant={paymentMethod === method ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method as any)}
                  >
                    {method.toUpperCase()}
                  </Button>
                ))}
              </div>

              <input
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Observações (ex: troco para 50)"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
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
          )}


          {order.origin === "delivery" && order.status === "out_for_delivery" && (
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="font-semibold">Forma de Pagamento</h3>

              <div className="grid grid-cols-2 gap-2">
                {["dinheiro", "pix", "credito", "debito"].map((method) => (
                  <Button
                    key={method}
                    variant={paymentMethod === method ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method as any)}
                  >
                    {method.toUpperCase()}
                  </Button>
                ))}
              </div>

              <input
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Observações (ex: troco para 50)"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
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
          )}


        </div>
      </div>
    </main>
  )
}
