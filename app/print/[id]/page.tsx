"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchOrderById } from "@/lib/orders"
import type { Order } from "@/lib/orders"

const originLabel: Record<Order["origin"], string> = {
  mesa: "Mesa",
  balcao: "Balcão",
  delivery: "Delivery",
}

export default function PrintOrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const formattedDate = useMemo(() => {
    if (!order?.created_at) return ""
    return new Date(order.created_at).toLocaleString("pt-BR")
  }, [order?.created_at])

  useEffect(() => {
    if (!id) return

    fetchOrderById(id as string).then((data) => {
      setOrder(data)
      setLoading(false)
      if (data) {
        setTimeout(() => window.print(), 300)
      }
    })
  }, [id])

  if (loading) {
    return (
      <main className="p-4 text-center text-sm text-muted-foreground">
        Carregando...
      </main>
    )
  }

  if (!order) {
    return (
      <main className="p-4 text-center text-sm">
        <p>Pedido não encontrado.</p>
        <button
          className="no-print mt-3 rounded border px-3 py-1 text-xs"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </main>
    )
  }

  const deliveryFeeText =
    order.delivery_fee == null
      ? "a consultar"
      : `R$ ${order.delivery_fee.toFixed(2).replace(".", ",")}`

  return (
    <main className="thermal-root">
      <div className="no-print flex gap-2 pb-2">
        <button
          className="rounded border px-3 py-1 text-xs"
          onClick={() => window.print()}
        >
          Imprimir
        </button>
        <button
          className="rounded border px-3 py-1 text-xs"
          onClick={() => window.close()}
        >
          Fechar
        </button>
      </div>

      <div className="thermal">
        <div className="text-center text-sm font-semibold">
          La na Calcada - Restaurante
        </div>

        <div className="mt-2 text-xs">
          <div>
            Pedido #{order.daily_order_number ?? order.id.slice(0, 6)}
          </div>
          <div>Data/Hora: {formattedDate}</div>
          <div>
            Origem: {originLabel[order.origin]}
            {order.origin === "mesa" && order.table_number
              ? ` ${order.table_number}`
              : ""}
          </div>
        </div>

        {order.origin === "delivery" && (
          <div className="mt-2 text-xs">
            <div className="font-semibold">Cliente</div>
            <div>{order.customer_name}</div>
            <div>
              {order.customer_street}, {order.customer_number}
            </div>
            <div>
              {order.customer_neighborhood} - CEP {order.customer_cep}
            </div>
            {order.delivery_ordered_at && (
              <div>
                Pedido feito:{" "}
                {new Date(order.delivery_ordered_at).toLocaleString("pt-BR")}
              </div>
            )}
            <div>Taxa de entrega: {deliveryFeeText}</div>
          </div>
        )}

        <div className="mt-2 border-t pt-2 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span>
                  {item.quantity}x {item.name} {item.sizeLabel ? item.sizeLabel : ""}
                </span>
              </div>
              {item.base && <div>* {item.base}</div>}
              {item.salad && <div>* {item.salad}</div>}
              {item.optional && item.optional.length > 0 && (
                <div>* {item.optional.join(", ")}</div>
              )}
              {item.proteins && item.proteins.length > 0 && (
                <div>* {item.proteins.map((p) => p.name).join(", ")}</div>
              )}
              {item.options && item.options.length > 0 && (
                <div>* {item.options.join(", ")}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 border-t pt-2 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de entrega</span>
            <span>{deliveryFeeText}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>

      <style>{`
        .thermal-root {
          padding: 8px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        }
        .thermal {
          width: 52mm;
        }
        @media print {
          @page {
            size: 52mm auto;
            margin: 0;
          }
          body {
            width: 52mm;
            font-size: 11px;
          }
          .no-print {
            display: none !important;
          }
          .thermal-root {
            padding: 4mm;
          }
        }
      `}</style>
    </main>
  )
}
