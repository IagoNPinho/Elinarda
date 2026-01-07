"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { generateOrderThermalPDF } from "@/lib/generate-order-pdf-thermal"

export default function KitchenOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { orders } = useCart()

  // 🔥 normalização TOTAL do id (Next 16 safe)
  const rawId = params?.id
  const orderId =
    typeof rawId === "string"
      ? Number(rawId)
      : Array.isArray(rawId)
        ? Number(rawId[0])
        : NaN

  console.log("🔵 ORDERS NA COZINHA:", orders)
  console.log("🟣 ORDER ID DA URL:", orderId)

  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <header className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <img src="/logo.svg" alt="Restaurante" className="w-12 h-12" />
            <h1 className="text-xl font-bold">
              Cozinha
            </h1>
          </div>
        </header>
        <p className="text-muted-foreground">
          Pedido não encontrado.
        </p>
        <Button onClick={() => router.push("/cozinha")}>
          Voltar para a cozinha
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <header className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/cozinha")}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold">
          Pedido #{order.id}
        </h1>
      </header>

      <div className="space-y-4">
        <p className="text-sm">
          Mesa {order.mesa}
        </p>

        <ul className="border rounded-lg p-4 space-y-2">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.weightInGrams
                ? `${item.name} – ${item.weightInGrams}g`
                : `${item.quantity}x ${item.name} (${item.sizeLabel})`}
            </li>

          ))}
        </ul>

        <p className="font-bold text-lg">
          Total: R$ {order.total.toFixed(2)}
        </p>

        <Button
          onClick={() => generateOrderThermalPDF(order, { width: 58 })}
          className="w-full flex gap-2"
        >
          <FileText className="w-5 h-5" />
          Gerar PDF do Pedido
        </Button>
      </div>
    </main>
  )
}
